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
    const competidor = {
        categoriaId: req.body.categoriaCompetidor,
        placa: req.body.placaCompetidor,
        rfid: req.body.rfidCompetidor
    }

    EtapaCompetidor.update(competidor, {
            where: { 
                etapaId: req.params.etapa,
                competidorId: req.params.competidor
            }
        })
        .then(num => {
            if (num.shift() == 1) {
                res.status(204).send();
            } else {
                res.status(500).send({
                    message: `Competidor não encontrado na etapa informada.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message
            });
        });
};

exports.delete = async (req, res) => {
    EtapaCompetidor.destroy({
            where: { 
                etapaId: req.params.etapa,
                competidorId: req.params.competidor
            }
        })
        .then(num => {
            if (num.shift() == 1) {
                res.status(204).send();
            } else {
                res.status(500).send({
                    message: `Competidor não encontrado na etapa informada.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message
            });
        });
};