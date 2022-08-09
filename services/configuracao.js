
const models = require('../models');
const Configuracao = models.Configuracao;

class SerialService {

    static async getSelectedPort() {
        const port = await Configuracao.findByPk( 1 );
        
        return port.dataValues.portaCom;
    }

}

module.exports = SerialService;