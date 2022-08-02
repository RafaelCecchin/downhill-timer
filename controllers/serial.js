const SerialService = require('../services/serial');

exports.portas = async (req, res) => {
    try {
        const ports = await SerialService.getAvailablePorts();

        if (ports) {
            res.status(200).send(ports);
        } else {
            res.status(404).send({
                message: "Portas não encontradas."
            });
        }
    } catch (err) {
        res.status(500).send({
            message:
              err.message
        });
    }

    
};