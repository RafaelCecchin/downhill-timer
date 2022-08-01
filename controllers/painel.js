const models = require('../models');

exports.index = async (req, res) => {
    res.render('pages/painel/index', {viewName: 'painel'});
};