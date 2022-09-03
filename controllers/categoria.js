const { Op } = require("sequelize");
const models = require('../models');
const Categoria = models.Categoria;
const Genero = models.Genero;

exports.index = async (req, res) => {
    const generos = await Genero.findAll();

    Categoria.findAll({
        where: {
            [Op.or]: [
                { nome: { [Op.like]: `%${req.query.search ?? ''}%` } },
            ]
        }
    })
    .then(data => {
        res.render('pages/categorias/index', {
            viewName: 'categorias',
            categorias: data,
            search: req.query.search ?? '',
            generos: generos
        });
    });
};

exports.new = async (req, res) => {
    const generos = await Genero.findAll();
    
    res.render('pages/categorias/show', {
        viewName: 'categorias', 
        formAction: 'create',
        generos: generos
    });
};

exports.show = async (req, res) => {
    const generos = await Genero.findAll();

    Categoria.findByPk( req.params.id )
        .then(data => {
            if (data) {
                res.render('pages/categorias/show', 
                {
                    viewName: 'categorias', 
                    formAction: 'update',
                    categoria: data,
                    generos: generos
                });
            } else {
                res.redirect('/categorias/new');
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
    const categoria = { 
        nome: req.body.nomeCategoria,
        generoId: req.body.generoCategoria
    }

    Categoria.create(categoria)
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
    Categoria.findByPk( req.params.id, {raw: true} )
        .then(data => {
            if (data) {
                res.status(200).send(data);
            } else {
                res.status(404).send({
                    message: "Categoria não encontrada."
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
    const categoria = { 
        nome: req.body.nomeCategoria,
    }

    Categoria.update(categoria, {
            where: { id: req.params.id }
        })
        .then(num => {
            if (num.shift() == 1) {
                res.status(204).send();
            } else {
                res.status(500).send({
                    message: `Categoria não encontrado.`
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
    Categoria.destroy({
            where: { id: req.params.id }
        })
        .then(num => {
            if (num == 1) {
                res.status(204).send();
            } else {
                res.status(500).send({
                    message: `Categoria não encontrada.`
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