const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const hbs = require('express-handlebars');
const models = require('./models');

let app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));

app.engine('handlebars', hbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.static('assets'));

app.get('/', async(req, res) => {
    res.render('home');
});

let port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
    console.log('Servidor rodando');
});