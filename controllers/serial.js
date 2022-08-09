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

exports.centralConnection = async (req, res) => {
    SerialService.testCentralConnection()
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