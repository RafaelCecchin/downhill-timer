module.exports = function(app) {

    // Controllers
    const painelController = require('./controllers/painel');
    const campeonatoController = require('./controllers/campeonato');
    const categoriaController = require('./controllers/categoria');
    const competidorController = require('./controllers/competidor');
    const etapaController = require('./controllers/etapa');
    const etapaCompetidorController = require('./controllers/etapaCompetidor');
    const configuracaoController = require('./controllers/configuracao');
    const serialController = require('./controllers/serial');

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

    app.get('/etapas/:id/live', etapaController.live);

    app.post('/api/etapas', etapaController.create);
    app.get('/api/etapas/:id', etapaController.read);
    app.put('/api/etapas/:id', etapaController.update);
    app.delete('/api/etapas/:id', etapaController.delete);

    app.post('/api/etapas/:etapa/competidores', etapaCompetidorController.create);
    app.put('/api/etapas/:etapa/competidores/:competidor', etapaCompetidorController.update);
    app.delete('/api/etapas/:etapa/competidores/:competidor', etapaCompetidorController.delete);
    
    app.post('/api/etapas/:etapa/backup', etapaCompetidorController.importBackup);

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
}