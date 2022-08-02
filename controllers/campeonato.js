const { Op } = require("sequelize");
const models = require('../models');
const Campeonato = models.Campeonato;

exports.index = async (req, res) => {
    Campeonato.findAll({
            where: {
                [Op.or]: [
                    { nome: { [Op.like]: `%${req.query.search ?? ''}%` } },
                ]
            }
        })
        .then(data => {
            res.render('pages/campeonatos/index', {
                viewName: 'campeonatos',
                campeonatos: data,
                search: req.query.search ?? ''
            });
        });
};

exports.new = async (req, res) => {
    res.render('pages/campeonatos/show', {viewName: 'campeonatos', formAction: 'create'});
};

exports.show = async (req, res) => {
    Campeonato.findByPk( req.params.id )
        .then(data => {
            if (data) {
                res.render('pages/campeonatos/show', 
                {
                    viewName: 'campeonatos', 
                    formAction: 'update',
                    campeonato: data
                });
            } else {
                res.redirect('/campeonatos/new');
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
    const campeonato = { 
        nome: req.body.nomeCampeonato 
    }

    Campeonato.create(campeonato)
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
    Campeonato.findByPk( req.params.id )
        .then(data => {
            if (data) {
                res.status(200).send(data.dataValues);
            } else {
                res.status(404).send({
                    message: "Campeonato não encontrado."
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
    const campeonato = {
        nome: req.body.nomeCampeonato
    }

    Campeonato.update(campeonato, {
            where: { id: req.params.id }
        })
        .then(num => {
            if (num == 1) {
                res.status(204).send();
            } else {
                res.status(500).send({
                    message: `Campeonato não encontrado.`
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
    Campeonato.destroy({
            where: { id: req.params.id }
        })
        .then(num => {
            if (num == 1) {
                res.status(204).send();
            } else {
                res.status(500).send({
                    message: `Campeonato não encontrado.`
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