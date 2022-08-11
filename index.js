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
        section: sections(),
        getDateOnly: function(fullDate) {
            const date = new Date(fullDate);

            const dd = String(date.getDate() + 1).padStart(2, '0');
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const yyyy = String(date.getFullYear()).padStart(4, '0');

            return yyyy + '-' + mm + '-' + dd;
        }
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

// Controllers
const painelController = require('./controllers/painel');
const campeonatoController = require('./controllers/campeonato');
const categoriaController = require('./controllers/categoria');
const competidorController = require('./controllers/competidor');
const configuracaoController = require('./controllers/configuracao');
const serialController = require('./controllers/serial');

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

// Categorias
app.get('/categorias', categoriaController.index);
app.get('/categorias/new', categoriaController.new);
app.get('/categorias/:id', categoriaController.show);

app.post('/api/categorias/create', categoriaController.create);
app.get('/api/categorias/:id', categoriaController.read);
app.put('/api/categorias/:id', categoriaController.update);
app.delete('/api/categorias/:id', categoriaController.delete);

// Competidores
app.get('/competidores', competidorController.index);
app.get('/competidores/new', competidorController.new);
app.get('/competidores/:id', competidorController.show);

app.post('/api/competidores/create', competidorController.create);
app.get('/api/competidores/:id', competidorController.read);
app.put('/api/competidores/:id', competidorController.update);
app.delete('/api/competidores/:id', competidorController.delete);

// Configurações
app.get('/configuracoes', configuracaoController.index);
app.get('/api/configuracoes', configuracaoController.read);
app.put('/api/configuracoes', configuracaoController.update);

// SerialPort
app.get('/api/serial/portas', serialController.portas);
app.get('/api/serial/central', serialController.centralConnectionTest);
app.get('/api/serial/largada', serialController.largadaConnectionTest);
app.get('/api/serial/largada/rfid', serialController.largadaRfidTest);
app.get('/api/serial/largada/rtc', serialController.largadaRtcTest);
app.get('/api/serial/largada/interruptor', serialController.largadaInterruptorTest);

/*
    ---/api/serial/portas
    ---/api/serial/central

    ---/api/serial/largada
    ---/api/serial/largada/rfid
    ---/api/serial/largada/rtc
    ---/api/serial/largada/interruptor

    /api/serial/chegada
    /api/serial/chegada/rfid
    /api/serial/chegada/rtc
    /api/serial/chegada/interruptor
*/

// Routes without controller
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