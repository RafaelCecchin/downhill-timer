const SerialService = require('../services/serial');

exports.portas = async (req, res) => {
    try {
        const ports = await SerialService.getAvailablePorts();
        res.status(200).send(ports);
    } catch (err) {
        res.status(500).send({
            message:
              err.message
        });
    }
};

exports.centralConnectionTest = async (req, res) => {
    SerialService.centralConnectionTest()
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                  err.message
            });
        });
};

exports.largadaConnectionTest = async (req, res) => {
    SerialService.largadaConnectionTest()
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                  err.message
            });
        });
};

exports.largadaRfidTest = async (req, res) => {
    SerialService.largadaRfidTest()
        .then(data => {
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                  err.message
            });
        });
};