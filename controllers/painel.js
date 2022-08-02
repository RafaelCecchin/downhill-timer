exports.index = async (req, res) => {
    res.render('pages/painel/index', {viewName: 'painel'});
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