const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const exphbs = require('express-handlebars');
const models = require('./models');
const path = require('path');
var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('assets'));

var hbs = exphbs.create({
    helpers: {
        ifCond: function (v1, operator, v2, options) {
            switch (operator) {
                case '==':
                    return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '===':
                    return (v1 === v2) ? options.fn(this) : options.inverse(this);
                case '!=':
                    return (v1 != v2) ? options.fn(this) : options.inverse(this);
                case '!==':
                    return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                case '<':
                    return (v1 < v2) ? options.fn(this) : options.inverse(this);
                case '<=':
                    return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                case '>':
                    return (v1 > v2) ? options.fn(this) : options.inverse(this);
                case '>=':
                    return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                case '&&':
                    return (v1 && v2) ? options.fn(this) : options.inverse(this);
                case '||':
                    return (v1 || v2) ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        }
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

// Routes
app.get('/', async(req, res) => {
    res.render('pages/painel/index', {viewName: 'painel'});
});

app.get('/configuracoes', async(req, res) => {
    res.render('pages/configuracoes/index', {viewName: 'configuracoes'});
});

app.get('/campeonatos', async(req, res) => {
    res.render('pages/campeonatos/index', {viewName: 'campeonatos'});
});

app.get('/campeonatos/:id', async(req, res) => {
    res.render('pages/campeonatos/show', {viewName: 'campeonatos'});
});

app.get('/competidores', async(req, res) => {
    res.render('pages/competidores/index', {viewName: 'competidores'});
});

app.get('/competidores/:id', async(req, res) => {
    res.render('pages/competidores/show', {viewName: 'competidores'});
});

app.get('/categorias', async(req, res) => {
    res.render('pages/categorias/index', {viewName: 'categorias'});
});

app.get('/etapas', async(req, res) => {
    res.render('pages/etapas/index', {viewName: 'etapas'});
});

// Server
let port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
    console.log('Servidor rodando');
});