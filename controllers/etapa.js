const Helper = require('../helper/helper');
const models = require('../models');
const Etapa = models.Etapa;
const Campeonato = models.Campeonato;
const Categoria = models.Categoria;
const EtapaCompetidor = models.EtapaCompetidor;

exports.new = async (req, res) => {
    const campeonatos = await Campeonato.findAll();
    const campeonato = await Campeonato.findByPk( req.params.campeonatoId );

    const ultimaEtapa = await Etapa.findOne({
        where: {
          campeonatoId: req.params.campeonatoId
        },
        order: [['numero', 'DESC']]
    });
    
    res.render('pages/etapas/show', {
        viewName: 'campeonatos', 
        formAction: 'create',
        campeonatos: campeonatos,
        campeonato: campeonato,
        defaultEtapaNumero: ultimaEtapa ? ultimaEtapa.numero + 1 : 1,
        defaultEtapaData: Helper.getCurrentDateTime()
    });
};

exports.live = async (req, res) => {
    res.render('pages/etapas/live', {layout: 'clear'});
};

exports.show = async (req, res) => {
    
    const campeonatos = await Campeonato.findAll();
    const categorias = await Categoria.findAll();
    const competidores = await EtapaCompetidor.findCompetidoresByEtapaId( req.params.id );

    Etapa.findByPk( req.params.id )
        .then(data => {
            if (data) {
                res.render('pages/etapas/show', 
                {
                    viewName: 'campeonatos', 
                    formAction: 'update',
                    etapa: data,
                    campeonatos: campeonatos,
                    categorias: categorias,
                    competidores: competidores
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
        campeonatoId: req.params.campeonatoId,
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
        data: req.body.dataEtapa,
        status: req.body.status
    }

    Etapa.update(etapa, {
            where: { id: req.params.id },
            individualHooks: true
        })
        .then(num => {
            if (num.shift() == 1) {
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