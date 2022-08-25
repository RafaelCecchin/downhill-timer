const express = require('express');
const http = require('http');
const socket = require("socket.io");
const bodyParser = require('body-parser');
const util = require("util");
const cors = require('cors');
const exphbs = require('express-handlebars');
const sections = require('express-handlebars-sections');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new socket.Server(server, {
    'path': '/api/serial/log/'
});

const SerialService = require('./services/serial');

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

require('./routes')(app);
SerialService.configureSocket(io);

// Server
const port = process.env.PORT || 3000;
server.listen(port, (req, res) => {
    console.log('Servidor rodando');
});