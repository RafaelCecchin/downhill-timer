'use strict';
const ConfiguracaoService = require('./configuracao');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline')
var serialConnection = {};
var parser = {};

class SerialService {

    static async configure() {    
        if (serialConnection.isOpen) {
            await this.finish();
        }

        this.start();
    }

    static async finish() {
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

    static async start() {
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

    static async communicate(deviceRequired, operationRequired, timeout = 5000, sendMessage = true) {

        return new Promise((resolve, reject) => {
            setTimeout(function() {
                reject(new Error("Erro: o dispositivo demorou muito tempo para responder."));
            }, timeout);

            if (sendMessage) {
                serialConnection.write(`{
                    "device":"${deviceRequired}",
                    "operation":"${operationRequired}"
                }`, function(err) {
                    if (err) {
                        reject(err);
                    }
                });
            }

            parser.on('data', function(json) {
                try {
                    const data = JSON.parse(json);

                    if (!data.status) {
                        reject(new Error(data.message));
                        return;
                    }

                    if ((deviceRequired && deviceRequired != data.device) || 
                        (operationRequired && operationRequired != data.operation)) {
                        return;
                    }
                    
                    resolve(data);
                } catch(err) {
                    console.log(err);
                }
            });                   
        });

    };

    static async centralConnectionTest() {
        return this.communicate(1, 1);
    }

    static async largadaConnectionTest() {
        return this.communicate(2, 1);
    }

    static async largadaRfidTest() {
        return this.communicate(2, 2);
    }
}

SerialService.configure();

module.exports = SerialService;