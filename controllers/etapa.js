const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const models = require('../models');
const Etapa = models.Etapa;
const Campeonato = models.Campeonato;

exports.index = async (req, res) => {
    Etapa.findAll({
        include: [
            {
                association: 'campeonato',
                attributes: ['id','nome' ],
            }
        ],
        where: {
            [Op.or]: [
                Sequelize.where(Sequelize.literal("numero || 'ª Etapa / ' || `campeonato`.`nome`"), 
                    Op.like, `%${req.query.search ?? ''}%`
                )
            ]
        }
    })
        .then(data => {
            res.render('pages/etapas/index', {
                viewName: 'etapas',
                etapas: data,
                search: req.query.search ?? ''
            });
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
        data: req.body.dataEtapa,
        status: 0
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
    Etapa.findByPk( req.params.id, {raw: true} )
        .then(data => {
            if (data) {
                res.status(200).send(data);
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