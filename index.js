const express = require('express');
const bodyParser = require('body-parser');
const util = require("util");
const cors = require('cors');
const exphbs = require('express-handlebars');
const sections = require('express-handlebars-sections');
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
        },
        section: sections()
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

// Controllers
const painelController = require('./controllers/painel');
const campeonatoController = require('./controllers/campeonato');

// Routes
app.get('/', painelController.index);

// Campeonatos
app.get('/campeonatos', campeonatoController.index);
app.get('/campeonatos/new', campeonatoController.new);
app.get('/campeonatos/:id', campeonatoController.show);

app.post('/api/campeonatos/create', campeonatoController.create);
app.get('/api/campeonatos/:id', campeonatoController.read);
app.put('/api/campeonatos/:id', campeonatoController.update);
app.delete('/api/campeonatos/:id', campeonatoController.delete);


// Routes without controller
app.get('/configuracoes', async(req, res) => {
    res.render('pages/configuracoes/index', {viewName: 'configuracoes'});
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

app.get('/categorias/:id', async(req, res) => {
    res.render('pages/categorias/show', {viewName: 'categorias'});
});

app.get('/etapas', async(req, res) => {
    res.render('pages/etapas/index', {viewName: 'etapas'});
});

app.get('/etapas/:id', async(req, res) => {
    res.render('pages/etapas/show', {viewName: 'etapas'});
});

// Server
let port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
    console.log('Servidor rodando');
});