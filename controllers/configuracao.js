const { Op } = require("sequelize");
const SerialService = require('../services/serial');
const models = require('../models');
const Configuracao = models.Configuracao;

exports.index = async (req, res) => {
    const serialPorts = await SerialService.getAvailablePorts();

    Configuracao.findByPk(1)
        .then(data => {
            res.render('pages/configuracoes/index', {
                viewName: 'configuracoes',
                configuracoes: data,
                serialPorts: serialPorts
            });
        });
};

exports.read = async (req, res) => {
    Configuracao.findByPk( 1, {raw: true} )
        .then(data => {
            if (data) {
                res.status(200).send(data);
            } else {
                res.status(404).send({
                    message: "Configuração não encontrada."
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

exports.update = async (req, res) => {
    const configuracoes = { 
        portaCom: req.body.portaCom
    }

    Configuracao.update(configuracoes, {
            where: { id: 1 }
        })
        .then(num => {
            if (num.shift() == 1) {
                SerialService.configureSerial();
                res.status(204).send();
            } else {
                res.status(500).send({
                    message: `Configuração não encontrada.`
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