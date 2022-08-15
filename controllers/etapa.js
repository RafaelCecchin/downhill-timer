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
                    etapas: data,
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
    
};

exports.update = async (req, res) => {
    
};

exports.delete = async (req, res) => {
    
};