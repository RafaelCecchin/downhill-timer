'use strict';
const ConfiguracaoService = require('./configuracao');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline')
var serialConnection = {};
var parser = {};
var socket;

class SerialService {

    static async configureSerial() {    
        if (serialConnection.isOpen) {
            await this.finish();
        }

        this.startSerial();
    }

    static async configureSocket(io) {
        socket = io;

        socket.on('connection', (socket) => {
            console.log('Cliente conectado ao socket de log.');
        });

        socket.on('disconnect', () => {
            console.log('Cliente desconectado do socket de log.');
        });
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

    static async startSerial() {
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

        parser.on('data', function(json) {
            try {
                const data = JSON.parse(json);

                if (!data.status) {
                    return;
                }

                socket.emit('log', json);
            } catch(err) {
                console.log(err);
            }
        });
    }

    static async getAvailablePorts() {
        const ports = await SerialPort.list();

        return ports;
    }

    static async sendSerial(deviceRequired, operationRequired, timeout = 5000, sendMessage = true) {

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
        return this.sendSerial(1, 1);
    }

    static async largadaConnectionTest() {
        return this.sendSerial(2, 1);
    }

    static async largadaRfidTest() {
        return this.sendSerial(2, 2);
    }

    static async largadaRtcTest() {
        return this.sendSerial(2, 3);
    }

    static async largadaInterruptorTest() {
        return this.sendSerial(2, 4);
    }

    static async chegadaConnectionTest() {
        return this.sendSerial(3, 1);
    }

    static async chegadaRfidTest() {
        return this.sendSerial(3, 2);
    }

    static async chegadaRtcTest() {
        return this.sendSerial(3, 3);
    }

    static async chegadaInterruptorTest() {
        return this.sendSerial(3, 4);
    }
}

SerialService.configureSerial();

module.exports = SerialService;