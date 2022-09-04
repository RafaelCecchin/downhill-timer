const { Op } = require("sequelize");
const models = require('../models');
const EtapaService = require('../services/etapa');
const EtapaCompetidor = models.EtapaCompetidor;

exports.create = async (req, res) => {
    const competidor = { 
        etapaId: req.params.etapa,
        competidorId: req.body.idCompetidor,
        categoriaId: req.body.categoriaCompetidor,
        placa: req.body.placa,
        rfid: req.body.rfid
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
        placa: req.body.placa,
        rfid: req.body.rfid,
        dci: req.body.dci,
        dcf: req.body.dcf,
        pi: req.body.pi,
        pf: req.body.pf
    }

    EtapaCompetidor.update(competidor, {
            where: {
                etapaId: req.params.etapa,
                competidorId: req.params.competidor
            },
            individualHooks: true
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
            if (num == 1) {
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

exports.importBackup = async (req, res) => {
    const backup = {
        etapaId: req.params.etapa,
        file: req.files.arquivoBackup
    }

    EtapaService.importBackup(backup)
        .then(() => {
            res.status(204).send();
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message
            });
        });
}