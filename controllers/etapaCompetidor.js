const { Op } = require("sequelize");
const models = require('../models');
const EtapaCompetidor = models.EtapaCompetidor;

exports.create = async (req, res) => {
    const competidor = { 
        etapaId: req.params.etapa,
        competidorId: req.body.idCompetidor,
        categoriaId: req.body.categoriaCompetidor,
        placa: req.body.placaCompetidor,
        rfid: req.body.rfidCompetidor
    }

    EtapaCompetidor.create(competidor)
        .then(data => {
                res.status(201).send(data);
            })
        .catch(err => {
            res.status(500).send({
                message:
                err.message
            });
        });
};

exports.read = async (req, res) => {
    
};

exports.update = async (req, res) => {
    
};

exports.delete = async (req, res) => {
    
};