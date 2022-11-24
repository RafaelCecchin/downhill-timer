const models = require('../models');
const Etapa = models.Etapa;
const EtapaCompetidor = models.EtapaCompetidor;

class EtapaService {

    static async importBackup(backup) {
        return new Promise(

            async function(resolve, reject) {
                const etapa = await Etapa.findByPk(backup.etapaId);

                if (!etapa) {
                    reject( new Error(`A etapa informada é inválida.`) );
                    return;
                }

                if (!(etapa.getDataValue('status') == 1) && !(etapa.getDataValue('status') == 2)) {
                    reject( new Error(`O status da etapa não permite importação de backup.`) );
                    return;
                }
        
                if (!backup.file) {
                    reject( new Error(`O arquivo de backup não foi informado.`) );
                    return;
                }
        
                if (backup.file.mimetype != 'text/plain') {
                    reject( new Error(`O arquivo de backup enviado está em um formato inválido.`) );
                    return;
                }
        
                if (backup.file.size / 1000000 > 25) {
                    reject( new Error(`O arquivo de backup não pode ser maior que 25mb.`) );
                    return;
                }

                const fullTextBackup = backup.file.data.toString('utf8');
                let backupList;

                try {
                    backupList = JSON.parse( fullTextBackup );
                } catch(e) {
                    reject( new Error(`O arquivo de backup não está no formato JSON.`) );
                    return;
                }

                const alreadyUpdated = { 2: [], 3: [] };

                for (const el of backupList) {

                    if ((el.device != 2 && el.device != 3) ||
                        (!el.data.rfid || !el.data.time) ||
                        (el.operation != 2) ||
                        (!alreadyUpdated[el.device].indexOf(el.data.rfid))) {
                        
                        continue;
                    }

                    const etapaCompetidor = {};
                    const date = new Date(el.data.time);
                    
                    switch(etapa.getDataValue('status')) {
                        case 1:
                            if (date < etapa.getDataValue('dci') || date > etapa.getDataValue('dcf')) {
                                continue;
                            }

                            switch(el.device) {
                                case 2:
                                    etapaCompetidor.dci = date;
                                    break;
                                case 3:
                                    etapaCompetidor.dcf = date;
                                    break;
                            }

                            break;
                        case 2:
                            if (date < etapa.getDataValue('pi') || date > etapa.getDataValue('pf')) {
                                continue;
                            }

                            switch(el.device) {
                                case 2:
                                    etapaCompetidor.pi = date;
                                    break;
                                case 3:
                                    etapaCompetidor.pf = date;
                                    break;
                            }

                            break;
                    }
                    
                    await EtapaCompetidor.update(etapaCompetidor, {
                            where: {
                                etapaId: backup.etapaId,
                                rfid: el.data.rfid
                            },
                            individualHooks: true
                        });

                    alreadyUpdated[el.device].push(el.data.rfid);
                }

                resolve();
            }
        );
    }    
}

module.exports = EtapaService;