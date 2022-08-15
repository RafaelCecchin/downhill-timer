
const models = require('../models');
const Configuracao = models.Configuracao;

class SerialService {

    static async getSelectedPort() {
        const port = await Configuracao.findByPk( 1 );
        
        return port.get('portaCom');
    }

}

module.exports = SerialService;