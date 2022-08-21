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
        get: function(obj, data) {
            if (!obj || !data) {
                return '';
            }
            return obj.get(data);
        },
        section: sections(),
        getDate: function(fullDate) {
            const date = new Date(fullDate);

            const dd = String(date.getDate() + 1).padStart(2, '0');
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const yyyy = String(date.getFullYear()).padStart(4, '0');

            return yyyy + '-' + mm + '-' + dd;
        },
        getDateTime: function(fullDate) {
            const date = new Date(fullDate);

            const dd = String(date.getDate() + 1).padStart(2, '0');
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const yyyy = String(date.getFullYear()).padStart(4, '0');

            let h = String(date.getHours()).padStart(2, '0');
            let m = String(date.getMinutes()).padStart(2, '0');

            return yyyy + '-' + mm + '-' + dd + ' ' + h + ':' + m;
        },
        getFormatedDateTime: function(fullDate) {
            const date = new Date(fullDate);

            const dd = String(date.getDate() + 1).padStart(2, '0');
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const yyyy = String(date.getFullYear()).padStart(4, '0');

            let h = String(date.getHours()).padStart(2, '0');
            let m = String(date.getMinutes()).padStart(2, '0');

            return dd + '/' + mm + '/' + yyyy + ' ' + h + ':' + m;
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
const etapaController = require('./controllers/etapa');
const etapaCompetidorController = require('./controllers/etapaCompetidor');
const configuracaoController = require('./controllers/configuracao');
const serialController = require('./controllers/serial');

/***************************** Routes *****************************/

// Início
app.get('/', painelController.index);

// Campeonatos
app.get('/campeonatos', campeonatoController.index);
app.get('/campeonatos/new', campeonatoController.new);
app.get('/campeonatos/:id', campeonatoController.show);

app.post('/api/campeonatos', campeonatoController.create);
app.get('/api/campeonatos/:id', campeonatoController.read);
app.put('/api/campeonatos/:id', campeonatoController.update);
app.delete('/api/campeonatos/:id', campeonatoController.delete);

// Categorias
app.get('/categorias', categoriaController.index);
app.get('/categorias/new', categoriaController.new);
app.get('/categorias/:id', categoriaController.show);

app.post('/api/categorias', categoriaController.create);
app.get('/api/categorias/:id', categoriaController.read);
app.put('/api/categorias/:id', categoriaController.update);
app.delete('/api/categorias/:id', categoriaController.delete);

// Competidores
app.get('/competidores', competidorController.index);
app.get('/competidores/new', competidorController.new);
app.get('/competidores/:id', competidorController.show);

app.post('/api/competidores', competidorController.create);
app.get('/api/competidores/:id', competidorController.read);
app.get('/api/competidores/cpf/:cpf', competidorController.readByCpf);
app.put('/api/competidores/:id', competidorController.update);
app.delete('/api/competidores/:id', competidorController.delete);

// Configurações
app.get('/configuracoes', configuracaoController.index);
app.get('/api/configuracoes', configuracaoController.read);
app.put('/api/configuracoes', configuracaoController.update);

// Etapas
app.get('/etapas', etapaController.index);
app.get('/etapas/new', etapaController.new);
app.get('/etapas/:id', etapaController.show);

app.post('/api/etapas', etapaController.create);
app.get('/api/etapas/:id', etapaController.read);
app.put('/api/etapas/:id', etapaController.update);
app.delete('/api/etapas/:id', etapaController.delete);

app.post('/api/etapas/:etapa/competidores', etapaCompetidorController.create);
app.put('/api/etapas/:etapa/competidores/:competidor', etapaCompetidorController.update);
app.delete('/api/etapas/:etapa/competidores/:competidor', etapaCompetidorController.delete);

// SerialPort
app.get('/api/serial/portas', serialController.portas);
app.get('/api/serial/central', serialController.centralConnectionTest);

app.get('/api/serial/largada', serialController.largadaConnectionTest);
app.get('/api/serial/largada/rfid', serialController.largadaRfidTest);
app.get('/api/serial/largada/rtc', serialController.largadaRtcTest);
app.get('/api/serial/largada/interruptor', serialController.largadaInterruptorTest);

app.get('/api/serial/chegada', serialController.chegadaConnectionTest);
app.get('/api/serial/chegada/rfid', serialController.chegadaRfidTest);
app.get('/api/serial/chegada/rtc', serialController.chegadaRtcTest);
app.get('/api/serial/chegada/interruptor', serialController.chegadaInterruptorTest);

// Server
let port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
    console.log('Servidor rodando');
});