const { Op } = require("sequelize");
const models = require('../models');
const Competidor = models.Competidor;
const Genero = models.Genero;

exports.index = async (req, res) => {
    const generos = await Genero.findAll();

    Competidor.findAll({
            where: {
                [Op.or]: [
                    { nome: { [Op.like]: `%${req.query.search ?? ''}%` } },
                ]
            }
        })
        .then(data => {
            res.render('pages/competidores/index', {
                viewName: 'competidores',
                competidores: data,
                search: req.query.search ?? '',
                generos: generos
            });
        });
};

exports.new = async (req, res) => {
    const generos = await Genero.findAll();
    
    res.render('pages/competidores/show', {
        viewName: 'competidores', 
        formAction: 'create',
        generos: generos
    });
};

exports.show = async (req, res) => {
    const generos = await Genero.findAll();

    Competidor.findByPk( req.params.id )
        .then(data => {
            if (data) {
                res.render('pages/competidores/show', 
                {
                    viewName: 'competidores', 
                    formAction: 'update',
                    competidor: data,
                    generos: generos
                });
            } else {
                res.redirect('/competidores/new');
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
    const competidor = { 
        cpf: req.body.cpfCompetidor,
        nome: req.body.nomeCompetidor,
        generoId: req.body.generoCompetidor,
        nascimento: req.body.dataNascimentoCompetidor,
        patrocinador: req.body.patrocinadorCompetidor
    }

    Competidor.create(competidor)
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
    Competidor.findByPk( req.params.id )
        .then(data => {
            if (data) {
                res.status(200).send(data.dataValues);
            } else {
                res.status(404).send({
                    message: "Competidor não encontrada."
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
    const competidor = { 
        cpf: req.body.cpfCompetidor,
        nome: req.body.nomeCompetidor,
        generoId: req.body.generoCompetidor,
        nascimento: req.body.dataNascimentoCompetidor,
        patrocinador: req.body.patrocinadorCompetidor
    }

    Competidor.update(competidor, {
            where: { id: req.params.id }
        })
        .then(num => {
            if (num == 1) {
                res.status(204).send();
            } else {
                res.status(500).send({
                    message: `Competidor não encontrado.`
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
    Competidor.destroy({
            where: { id: req.params.id }
        })
        .then(num => {
            if (num == 1) {
                res.status(204).send();
            } else {
                res.status(500).send({
                    message: `Competidor não encontrado.`
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