const models = require('../models');
const Campeonato = models.Campeonato;

exports.index = (req, res) => {
    res.render('pages/campeonatos/index', {viewName: 'campeonatos'});
};

exports.new = (req, res) => {
    res.render('pages/campeonatos/show', {viewName: 'campeonatos', formAction: 'create'});
};

exports.show = (req, res) => {
    Campeonato.findByPk( req.params.id )
        .then(data => {
            if (data) {
                res.render('pages/campeonatos/show', 
                {
                    viewName: 'campeonatos', 
                    formAction: 'update',
                    campeonato: data.dataValues
                });
            } else {
                res.redirect('/campeonatos/create');
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                err.message
            });
        });
};

exports.create = (req, res) => {
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

exports.update = (req, res) => {
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

exports.delete = (req, res) => {
  
};

exports.deleteAll = (req, res) => {
  
};

exports.findAllPublished = (req, res) => {
  
};