'use strict';
const ConfiguracaoService = require('./configuracao');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline')
var serialConnection = {};
var parser = {};

class SerialService {

    static async configure() {    
        if (serialConnection.isOpen) {
            await this.close();
        }

        this.open();
    }

    static async close() {
        return new Promise((resolve, reject) => {
            serialConnection.close(function(err) {
                if (err) {
                    console.log("Erro: " + err.message);
                    reject(err);
                    return;
                }

                console.log('Serial Port Closed');
                resolve();
            });
        });
    }

    static async open() {
        const port = await ConfiguracaoService.getSelectedPort();

        serialConnection = new SerialPort({
            path: port,
            baudRate: 9600,
            autoOpen: false
        });

        parser = serialConnection.pipe(new ReadlineParser({ delimiter: '\n' }))
        
        serialConnection.open(function (err) {
            if (err) {
                console.log("Erro: " + err.message);
                return;
            }
            
            console.log('Serial Port Opened');
        });
    }

    static async getAvailablePorts() {
        const ports = await SerialPort.list();

        return ports;
    }

    static async timeOut(rejectCallback, mil) {
        setTimeout(function() {
            rejectCallback(new Error("Erro: o dispositivo demorou muito tempo para responder"));
        }, mil);
    }

    static async testCentralConnection() {
        return new Promise((resolve, reject) => {
            this.timeOut(reject, 5000);

            serialConnection.write(`{
                "device": 1, 
                "operation": 1
            }`, function(err) {
                if (err) {
                    reject(err);
                }
            });

            parser.on('data', function(json) {
                try {
                    const data = JSON.parse(json);

                    if (!data.status) {
                        reject(new Error(data.message));
                        return;
                    }
                    
                    resolve(data);
                } catch(err) {
                    reject(err);
                }
            });                   
        });
    }
}

SerialService.configure();

module.exports = SerialService;