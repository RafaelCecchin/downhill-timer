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

exports.largadaRtcTest = async (req, res) => {
    SerialService.largadaRtcTest()
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

exports.largadaInterruptorTest = async (req, res) => {
    SerialService.largadaInterruptorTest()
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

exports.chegadaConnectionTest = async (req, res) => {
    SerialService.chegadaConnectionTest()
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

exports.chegadaRfidTest = async (req, res) => {
    SerialService.chegadaRfidTest()
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

exports.chegadaRtcTest = async (req, res) => {
    SerialService.chegadaRtcTest()
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

exports.chegadaInterruptorTest = async (req, res) => {
    SerialService.chegadaInterruptorTest()
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