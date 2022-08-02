'use strict';
const { SerialPort } = require('serialport');

module.exports = class SerialService {

    static async getAvailablePorts() {
        const ports = await SerialPort.list();

        return ports;
    }

}