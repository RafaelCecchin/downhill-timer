'use strict';
const ConfiguracaoService = require('./configuracao');
const Helper = require('../helper/helper');
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

        socket.on('connection', async (socket) => {
            await SerialService.setCurrentRun(socket.handshake.query['etapa']);
            await SerialService.setRunStartTime();
            console.log('Cliente conectado ao socket de log.');

            socket.on('save', async () => {
                
                if (!currentRun) {
                    throw new Error('A corrida não foi iniciada.');
                }

                currentRun.get('etapaCompetidor').forEach(element => {
                    element.save();
                });

                await SerialService.setRunFinishTime();

                switch(currentRun.getDataValue('status')) {
                    case 0:
                        currentRun.set('status', 1);
                        break;
                    case 1:
                        currentRun.set('status', 2);
                        break;
                }
                
                await currentRun.save();
                
                socket.emit('saved');
                console.log('Dados salvos com sucesso!');
            });

            socket.on('disconnect', () => {
                currentRun = null;
                console.log('Cliente desconectado do socket de log.');
            });
        });        
    }

    static async setCurrentRun(etapa) {
        currentRun = await Etapa.findByPk(etapa, {
            include: [
                {
                    association: 'etapaCompetidor',
                    include: [
                        {
                            association: 'competidor'
                        },
                        {
                            association: 'etapa'
                        },
                        {
                            association: 'categoria'
                        }
                    ]
                }
            ]
        });
    }

    static async setRunStartTime() {
        const date = Helper.getCurrentDateTime();

        switch(currentRun.getDataValue('status')) {
            case 0:
                currentRun.set('dci', date);
                break;
            case 1:
                currentRun.set('pi', date);
                break;
        }
    }

    static async setRunFinishTime() {
        const date = Helper.getCurrentDateTime();

        switch(currentRun.getDataValue('status')) {
            case 0:
                currentRun.set('dcf', date);
                break;
            case 1:
                currentRun.set('pf', date);
                break;
        }
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
                const serialData = JSON.parse(json);

                if (!serialData.status) {
                    return;
                }

                if (!currentRun) {
                    return;
                }

                SerialService.sendLog(serialData);
                SerialService.updateData(serialData);
                
            } catch(err) {
                //console.log(err);
            }
        });
    }

    static async sendLog(serialData) {

        if (!currentRun) {
            throw new Error('A corrida não foi iniciada.');
        }

        currentRun.get('etapaCompetidor').filter(function (el) {

            if (el.rfid != serialData.data.rfid) {
                return false;
            }

            serialData.message = serialData.message.replace(
                '[NOME_COMPETIDOR]', // Replace tag
                el.get('competidor').get('nome')
            );

            socket.emit('log', JSON.stringify(serialData));
        });

    }

    static async updateData(serialData) {

        if (!currentRun) {
            throw new Error('A corrida não foi iniciada.');
        }

        currentRun.get('etapaCompetidor').filter(function (el) {

            if (el.rfid != serialData.data.rfid) {
                return false;
            }

            switch(serialData.device) {
                case 2:
                    switch(currentRun.getDataValue('status')) {
                        case 0: 
                            if (!el.getDataValue('dci')) {
                                el.set('dci', serialData.data.dateTime);
                            }
    
                            break;
                        case 1: 
                            if (!el.getDataValue('pi')) {
                                el.set('pi', serialData.data.dateTime);
                            }
    
                            break;
                    }
                    break;
                case 3:
                    switch(currentRun.getDataValue('status')) {
                        case 0: 
                            if (!el.getDataValue('dcf')) {
                                el.set('dcf', serialData.data.dateTime);
                            }

                            break;
                        case 1: 
                            if (!el.getDataValue('pf')) {
                                el.set('pf', serialData.data.dateTime);
                            }

                            break;
                    }
                    break;
            }
            
            return true;
        });
    }

    static async getAvailablePorts() {
        const ports = await SerialPort.list();

        return ports;
    }

    static async sendSerial(deviceRequired, operationRequired, sendData = {}, timeout = 5000, sendMessage = true) {

        return new Promise((resolve, reject) => {
            setTimeout(function() {
                reject(new Error("Erro: o dispositivo demorou muito tempo para responder."));
            }, timeout);

            if (sendMessage) {
                serialConnection.write(`{
                    "device":"${deviceRequired}",
                    "operation":"${operationRequired}",
                    "data": ${JSON.stringify(sendData)}
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
                    //console.log(err);
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
        return this.sendSerial(2, 3, {
            dateTime: Helper.getCurrentDateTime()
        });
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
        return this.sendSerial(3, 3, {
            dateTime: Helper.getCurrentDateTime()
        });
    }

    static async chegadaInterruptorTest() {
        return this.sendSerial(3, 4);
    }
}

SerialService.configureSerial();

module.exports = SerialService;