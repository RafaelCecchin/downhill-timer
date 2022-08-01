const models = require('../models');

exports.index = (req, res) => {
    res.render('pages/painel/index', {viewName: 'painel'});
};