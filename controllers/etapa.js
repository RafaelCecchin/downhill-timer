const { Op } = require("sequelize");
const models = require('../models');
const Etapa = models.Etapa;
const Campeonato = models.Campeonato;

exports.index = async (req, res) => {
    res.render('pages/etapas/index', {
        viewName: 'etapas',
    });
};

exports.new = async (req, res) => {
    const campeonatos = await Campeonato.findAll();
    
    res.render('pages/etapas/show', {
        viewName: 'etapas', 
        formAction: 'create',
        campeonatos: campeonatos
    });
};

exports.show = async (req, res) => {
    const campeonatos = await Campeonato.findAll();

    Etapa.findByPk( req.params.id )
        .then(data => {
            if (data) {
                res.render('pages/etapas/show', 
                {
                    viewName: 'etapas', 
                    formAction: 'update',
                    etapa: data,
                    campeonatos: campeonatos
                });
            } else {
                res.redirect('/etapas/new');
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                  err.message
            });
        });
};

exports.create = async (req, res) => {
    const etapa = { 
        campeonatoId: req.body.campeonatoEtapa,
        numero: req.body.numeroEtapa,
        data: req.body.dataEtapa
    }

    Etapa.create(etapa)
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
    Etapa.findByPk( req.params.id )
        .then(data => {
            if (data) {
                res.status(200).send(data.dataValues);
            } else {
                res.status(404).send({
                    message: "Etapa não encontrada."
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
    const etapa = { 
        campeonatoId: req.body.campeonatoEtapa,
        numero: req.body.numeroEtapa,
        data: req.body.dataEtapa
    }

    Etapa.update(etapa, {
            where: { id: req.params.id }
        })
        .then(num => {
            if (num == 1) {
                res.status(204).send();
            } else {
                res.status(500).send({
                    message: `Etapa não encontrada.`
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
    Etapa.destroy({
            where: { id: req.params.id }
        })
        .then(num => {
            if (num == 1) {
                res.status(204).send();
            } else {
                res.status(500).send({
                    message: `Etapa não encontrada.`
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