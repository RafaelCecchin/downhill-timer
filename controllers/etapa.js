const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const models = require('../models');
const Etapa = models.Etapa;
const Campeonato = models.Campeonato;
const Categoria = models.Categoria;
const EtapaCompetidor = models.EtapaCompetidor;

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
    const categorias = await Categoria.findAll();
    const competidores = await new Promise(
        async function(resolve, reject) {

            let competidoresArray = [];
            const etapaCompetidoresObjs = await EtapaCompetidor.findAll({
                include: [ 
                    {
                        association: 'competidor',
                        include: ['genero']
                    }, 
                    {
                        association: 'categoria'
                    } 
                ],
                where: {
                    etapaId: req.params.id
                }
            });            
            
            for (etapaCompetidor of etapaCompetidoresObjs) {
                const genero = etapaCompetidor.get('competidor').get('genero');
                const categoria = etapaCompetidor.get('categoria');
                
                if (!competidoresArray[genero.get('id')]) {
                     competidoresArray[genero.get('id')] = new Object();
                     competidoresArray[genero.get('id')].genero = genero;
                     competidoresArray[genero.get('id')].categorias = [];
                }

                if (!competidoresArray[genero.get('id')].categorias[categoria.get('id')]) {
                     competidoresArray[genero.get('id')].categorias[categoria.get('id')] = new Object();
                     competidoresArray[genero.get('id')].categorias[categoria.get('id')].categoria = categoria;
                     competidoresArray[genero.get('id')].categorias[categoria.get('id')].competidores = [];                    
                }

                competidoresArray[genero.get('id')]
                    .categorias[categoria.get('id')]
                    .competidores
                    .push(etapaCompetidor);
            }

            resolve(competidoresArray);
        }
    );   

    Etapa.findByPk( req.params.id )
        .then(data => {
            if (data) {
                res.render('pages/etapas/show', 
                {
                    viewName: 'etapas', 
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