const express = require('express');
const http = require('http');
const socket = require("socket.io");
const bodyParser = require('body-parser');
const util = require("util");
const cors = require('cors');
const exphbs = require('express-handlebars');
const fileupload = require("express-fileupload");
const sections = require('express-handlebars-sections');
const path = require('path');
const Helper = require('./helper/helper');
const app = express();
const server = http.createServer(app);
const io = new socket.Server(server, {
    'path': '/api/serial/log/'
});

const SerialService = require('./services/serial');

app.use(cors());
app.use(fileupload());
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
        get: function(obj, data) {
            return Helper.get(obj, data);
        },
        getDataValue: function(obj, data) {
            return Helper.getDataValue(obj, data);
        },
        getDate: function(fullDate) {
            return Helper.getDate(fullDate);
        },
        getTime: function(fullDate) {
            return Helper.getTime(fullDate);
        },
        getDateTime: function(fullDate) {
            return Helper.getDateTime(fullDate);
        },
        getFormatedDateTime: function(fullDate) {
            return Helper.getFormatedDateTime(fullDate);
        },
        getUTCTime: function(fullDate) {
            return Helper.getUTCTime(fullDate);
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