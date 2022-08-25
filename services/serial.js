'use strict';
const ConfiguracaoService = require('./configuracao');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline')
const models = require('../models');
const Etapa = models.Etapa;

let serialConnection = {};
let parser = {};
let socket;

let currentRun;

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
            SerialService.setCurrentRun(socket.handshake.query['etapa']);
            console.log('Cliente conectado ao socket de log.');

            socket.on('disconnect', () => {
                currentRun.save = false;
                currentRun.etapa = false;
                console.log('Cliente desconectado do socket de log.');
            });
        });        
    }

    static async setCurrentRun(etapa) {
        currentRun = await Etapa.findByPk(etapa);
    }

    static async clearCurrentRun(etapa) {
        currentRun = null;
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

                if (!currentRun) {
                    return;
                }

                socket.emit('log', json);
                SerialService.saveData(data);
                
            } catch(err) {
                console.log(err);
            }
        });
    }

    static async saveData(data) {

        switch(data.device) {
            case 2:
                
                break;
            case 3:

                break;
        }
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