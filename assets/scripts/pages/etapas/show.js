function adicionarEtapa(event) {
    event.preventDefault();

    campeonatoId = $('#formEtapa').find('select[name="campeonatoEtapa"]').val();

    $.ajax({
        type: "POST",
        url: url.origin + `/api/campeonatos/${campeonatoId}/etapas`,
        dataType: "json",
        data: $('#formEtapa').serialize(),
        success: function(response){
            const etapaUrl = url.origin + `/campeonatos/${campeonatoId}/etapas/${response.id}`;
            showModalInformation("Etapa criada com sucesso.", () => { window.location.href = etapaUrl }, () => { window.location.href = etapaUrl });
        },
        error: function(res, status, error) {
            const response = JSON.parse(res.responseText);
            showModalInformation(response.message);
        }
    });    
}
function salvarEtapa(event) {
    event.preventDefault();

    $.ajax({
        type: "PUT",
        url: url.origin + `/api` + url.pathname,
        dataType: "json",
        data: $('#formEtapa').serialize(),
        success: function(response){
            showModalInformation("Etapa atualizada com sucesso.");
        },
        error: function(res, status, error) {
            const response = JSON.parse(res.responseText);
            showModalInformation(response.message);
        }
    });
}
function excluirEtapa(event) {
    event.preventDefault();

    showModalOption("Você tem certeza que deseja excluir essa etapa?", function () {
        $.ajax({
            type: "DELETE",
            url: url.origin + `/api` + url.pathname,
            dataType: "json",
            success: function(response){
                const campeonatoUrl = url.origin + `/campeonatos/${campeonatoId}`;
                showModalInformation("Etapa excluída com sucesso.", () => { window.location.href = campeonatoUrl }, () => { window.location.href = campeonatoUrl });
            },
            error: function(res, status, error) {
                const response = JSON.parse(res.responseText);
                showModalInformation(response.message);
            }
        });
    });        
}

$('#btnAdicionarEtapa').on('click', adicionarEtapa);
$('#btnSalvarEtapa').on('click', salvarEtapa);
$('#btnExcluirEtapa').on('click', excluirEtapa);  

function showModalAdicionarCompetidor() {
    $('#modalAdicionarCompetidor').addClass('show');
}
function buscarCompetidor() {
    const cpfCompetidor = $('#modalAdicionarCompetidor').find('input[name="cpfCompetidor"]').val();

    if (!cpfCompetidor) {
        showModalInformation("Informe o CPF do competidor.");
        return;
    }

    if (!isValidCpf(cpfCompetidor)) {
        showModalInformation("Informe um CPF válido.");
        return;
    }

    $.ajax({
        type: "GET",
        url: url.origin + `/api/competidores/cpf/` + cpfCompetidor,
        dataType: "json",
        success: function(response){
            $('#modalAdicionarCompetidor').find('input[name="idCompetidor"]').val(response.id);
            $('#modalAdicionarCompetidor').find('input[name="nomeCompetidor"]').val(response.nome);
            $('#modalAdicionarCompetidor').find('select[name="categoriaCompetidor"]').removeAttr('disabled');
            $('#modalAdicionarCompetidor').find('input[name="placa"]').removeAttr('disabled');
            $('#modalAdicionarCompetidor').find('input[name="rfid"]').removeAttr('disabled');
            $('#modalAdicionarCompetidor').find('#btnAdicionarCompetidor').removeAttr('disabled');

            switch(response.generoId) {
                case 1:
                    $('#modalAdicionarCompetidor').find('.catMasculina').removeAttr('hidden');
                    $('#modalAdicionarCompetidor').find('.catFeminina').attr('hidden', '');
                    break;
                case 2:
                    $('#modalAdicionarCompetidor').find('.catMasculina').attr('hidden', '');
                    $('#modalAdicionarCompetidor').find('.catFeminina').removeAttr('hidden');
                    break;
            }
        },
        error: function(res, status, error) {
            const response = JSON.parse(res.responseText);
            showModalInformation(response.message);
        }
    });
}
function clearCompetidorInputs(event, cpf = false) {
    if (cpf) {
        $('#modalAdicionarCompetidor').find('input[name="cpfCompetidor"]').val("");
    }

    $('#modalAdicionarCompetidor').find('input[name="idCompetidor"]').val("");
    $('#modalAdicionarCompetidor').find('input[name="nomeCompetidor"]').val("").attr("disabled", "");
    $('#modalAdicionarCompetidor').find('select[name="categoriaCompetidor"]').val("").attr("disabled", "");
    $('#modalAdicionarCompetidor').find('input[name="placa"]').val("").attr("disabled", "");
    $('#modalAdicionarCompetidor').find('input[name="rfid"]').val("").attr("disabled", "");
    $('#modalAdicionarCompetidor').find('#btnAdicionarCompetidor').attr("disabled", "");
}
function adicionarCompetidor() {
    const idCompetidor = $('#modalAdicionarCompetidor').find('input[name="idCompetidor"]').val();
    const categoriaCompetidor = $('#modalAdicionarCompetidor').find('select[name="categoriaCompetidor"]').val();
    const placa = $('#modalAdicionarCompetidor').find('input[name="placa"]').val();
    const rfid = $('#modalAdicionarCompetidor').find('input[name="rfid"]').val();
    
    if (!idCompetidor) {
        showModalInformation("Nenhum competidor selecionado.");
        return;
    }

    if (!categoriaCompetidor) {
        showModalInformation("Informe a categoria do competidor.");
        return;
    }

    if (!placa) {
        showModalInformation("Informe a placa do competidor.");
        return;
    }

    if (!rfid) {
        showModalInformation("Informe o RFID do competidor.");
        return;
    }

    $.ajax({
        type: "POST",
        url: url.origin + `/api` + url.pathname + `/competidores`,
        data: {
            idCompetidor: idCompetidor,
            categoriaCompetidor: categoriaCompetidor,
            placa: placa,
            rfid: rfid
        },
        dataType: "json",
        success: function(response){
            document.location.reload();
        },
        error: function(res, status, error) {
            const response = JSON.parse(res.responseText);
            showModalInformation(response.message);
        }
    });
}
$('#btnModalCompetidor').on('click', showModalAdicionarCompetidor);  
$('#btnBuscarCompetidor').on('click', buscarCompetidor);
$('input[name="cpfCompetidor"]').on("keyup keydown keypress click", clearCompetidorInputs);
$('#btnAdicionarCompetidor').on('click', adicionarCompetidor);

function showModalEditarCompetidor() {
    $('#modalEditarCompetidor').addClass('show');

    const row = $( $(this).data('target') );

    const idCompetidor = row.data('competidor-id');
    const cpfCompetidor = row.data('competidor-cpf');
    const nomeCompetidor = row.data('competidor-nome');
    const generoCompetidor = row.data('competidor-genero-id');
    const idCategoria = row.data('categoria-id');
    const rfid = row.data('rfid');
    const placa = row.data('placa');

    $('#modalEditarCompetidor').find('input[name="idCompetidor"]').val(idCompetidor);
    $('#modalEditarCompetidor').find('input[name="cpfCompetidor"]').val(cpfCompetidor);
    $('#modalEditarCompetidor').find('input[name="nomeCompetidor"]').val(nomeCompetidor);
    $('#modalEditarCompetidor').find('select[name="categoriaCompetidor"]').val(idCategoria).change();
    $('#modalEditarCompetidor').find('input[name="rfid"]').val(rfid);
    $('#modalEditarCompetidor').find('input[name="placa"]').val(placa);
    
    switch(generoCompetidor) {
        case 1:
            $('#modalEditarCompetidor').find('.catMasculina').removeAttr('hidden');
            $('#modalEditarCompetidor').find('.catFeminina').attr('hidden', '');
            break;
        case 2:
            $('#modalEditarCompetidor').find('.catMasculina').attr('hidden', '');
            $('#modalEditarCompetidor').find('.catFeminina').removeAttr('hidden');
            break;
    }
}
function editarCompetidor() {
    const idCompetidor = $('#modalEditarCompetidor').find('input[name="idCompetidor"]').val();
    const categoriaCompetidor = $('#modalEditarCompetidor').find('select[name="categoriaCompetidor"]').val();
    const placa = $('#modalEditarCompetidor').find('input[name="placa"]').val();
    const rfid = $('#modalEditarCompetidor').find('input[name="rfid"]').val();
    
    if (!idCompetidor) {
        showModalInformation("Nenhum competidor selecionado.");
        return;
    }

    if (!categoriaCompetidor) {
        showModalInformation("Informe a categoria do competidor.");
        return;
    }

    if (!placa) {
        showModalInformation("Informe a placa do competidor.");
        return;
    }

    if (!rfid) {
        showModalInformation("Informe o RFID do competidor.");
        return;
    }

    $.ajax({
        type: "PUT",
        url: url.origin + `/api` + url.pathname + `/competidores/` + idCompetidor,
        data: {
            categoriaCompetidor: categoriaCompetidor,
            placa: placa,
            rfid: rfid
        },
        dataType: "json",
        success: function(response){
            document.location.reload();
        },
        error: function(res, status, error) {
            const response = JSON.parse(res.responseText);
            showModalInformation(response.message);
        }
    });
}
$('.editar-competidor').on('click', showModalEditarCompetidor);
$('#btnSalvarCompetidor').on('click', editarCompetidor);

function showModalEditarTempoCompetidor() {
    $('#modalEditarTempoCompetidor').addClass('show');

    const row = $( $(this).data('target') );

    const idCompetidor = row.data('competidor-id');
    const nomeCompetidor = row.data('competidor-nome');

    const dciTime = row.data('dci-time');
    const dciDate = row.data('dci-date');

    const dcfTime = row.data('dcf-time');
    const dcfDate = row.data('dcf-date');

    const piTime = row.data('pi-time');
    const piDate = row.data('pi-date');

    const pfTime = row.data('pf-time');
    const pfDate = row.data('pf-date');

    $('#modalEditarTempoCompetidor').find('input[name="idCompetidor"]').val(idCompetidor);
    $('#modalEditarTempoCompetidor').find('input[name="nomeCompetidor"]').val(nomeCompetidor);

    $('#modalEditarTempoCompetidor').find('input[name="dci"]').val(dciTime);
    $('#modalEditarTempoCompetidor').find('input[name="dci"]').attr('valueAsDate', dciDate);

    $('#modalEditarTempoCompetidor').find('input[name="dcf"]').val(dcfTime);
    $('#modalEditarTempoCompetidor').find('input[name="dcf"]').attr('valueAsDate', dcfDate);

    $('#modalEditarTempoCompetidor').find('input[name="pi"]').val(piTime);
    $('#modalEditarTempoCompetidor').find('input[name="pi"]').attr('valueAsDate', piDate);

    $('#modalEditarTempoCompetidor').find('input[name="pf"]').val(pfTime);
    $('#modalEditarTempoCompetidor').find('input[name="pf"]').attr('valueAsDate', pfDate);

}
function editarTempoCompetidor() {
    const idCompetidor = $('#modalEditarTempoCompetidor').find('input[name="idCompetidor"]').val();
    
    if (!idCompetidor) {
        showModalInformation("Nenhum competidor selecionado.");
        return;
    }

    const data = {};

    const dciInput = $('#modalEditarTempoCompetidor').find('input[name="dci"]');
    const dcfInput = $('#modalEditarTempoCompetidor').find('input[name="dcf"]');
    const piInput = $('#modalEditarTempoCompetidor').find('input[name="pi"]');
    const pfInput = $('#modalEditarTempoCompetidor').find('input[name="pf"]');
    
    if (!dciInput.val()) {
        showModalInformation("Informe o tempo inicial do competidor na descida classificatória.");
        return;
    }
    data.dci = dciInput.attr('valueasdate') + ' ' + dciInput.val();

    if (!dcfInput.val()) {
        showModalInformation("Informe o tempo final do competidor na descida classificatória.");
        return;
    }
    data.dcf = dcfInput.attr('valueasdate') + ' ' + dcfInput.val(); 

    if (etapaStatus == 2) {
        if (!piInput) {
            showModalInformation("Informe o tempo inicial do competidor na prova.");
            return;
        }
        data.pi = piInput.attr('valueasdate') + ' ' + piInput.val(); 

        if (!pfInput) {
            showModalInformation("Informe o tempo final do competidor na prova.");
            return;
        } 
        data.pf = pfInput.attr('valueasdate') + ' ' + pfInput.val(); 
    }
    
    $.ajax({
        type: "PUT",
        url: url.origin + `/api` + url.pathname + `/competidores/` + idCompetidor,
        data: data,
        dataType: "json",
        success: function(response){
            document.location.reload();
        },
        error: function(res, status, error) {
            const response = JSON.parse(res.responseText);
            showModalInformation(response.message);
        }
    });
}
$('.editar-tempo-competidor').on('click', showModalEditarTempoCompetidor);
$('#btnSalvarTempoCompetidor').on('click', editarTempoCompetidor);

function excluirCompetidor() {

    const row = $( $(this).data('target') );

    const idCompetidor = row.data('competidor-id');

    showModalOption("Você tem certeza que deseja remover esse competidor da etapa?", function () {
        $.ajax({
            type: "DELETE",
            url: url.origin + `/api` + url.pathname + `/competidores/` + idCompetidor,
            dataType: "json",
            success: function(response){
                showModalInformation("Competidor removido da etapa com sucesso.", () => { document.location.reload(); }, () => { document.location.reload(); });                    
            },
            error: function(res, status, error) {
                const response = JSON.parse(res.responseText);
                showModalInformation(response.message);
            }
        });
    });
}
$('.remove-row').on('click', excluirCompetidor);  

$('.modal-competidor').find('#btnCancelar').on('click', closeModal);
$('.modal-competidor').find('.close-modal').on('click', closeModal);

const serialSocket = io(window.location.origin, {
    autoConnect: false, 
    reconnection: false,
    path: '/api/serial/log/',
    query: 'etapa=' + etapaId
});
serialSocket.on('connect_error', (error) => {
    showModalInformation('Ocorreu um erro ao estabelecer conexão com o servidor.');
});
serialSocket.on('disconnect', () => {
    console.log('Cliente desconectado do socket de log.');
});
serialSocket.on('connect', () => {
    console.log('Cliente conectado ao socket de log.');
});
serialSocket.on('log', (json) => {
    const data = JSON.parse(json);

    if (!data.status) {
        return;
    }

    $('#modalLog').find('.log-list').append(
        '<li>' + '[' + data.data['time'] + '] ' + data.message + '</li>'
    );
})
serialSocket.on('saved', () => {
    socketDisonnect();
    showModalInformation('Salvo com sucesso!', () => { document.location.reload(); }, () => { document.location.reload(); });
})
function socketConnect() {
    serialSocket.connect();
}
function socketDisonnect() {
    serialSocket.disconnect();
}
function initRun() {
    clearModalLog();
    showModalLog();
    socketConnect();
}
function cancelRun() {
    closeModalLog();
    socketDisonnect();
    showModalInformation('Operação cancelada com sucesso.');
}
function finishRun() {
    closeModalLog();
    saveRunData();
}
function saveRunData() {
    serialSocket.emit('save');
}
function showModalLog() {
    $('#modalLog').addClass('show');
}
function closeModalLog() {
    $('#modalLog').removeClass('show');
}
function clearModalLog() {
    $('#modalLog').find('.log-list').html('');
}
function initDc() {
    showModalOption("Você tem certeza de que deseja iniciar a descida classificatória?", initRun);   
}
function clearDc() {
    showModalOption("Você tem certeza de que deseja limpar os dados relacionados a descida classificatória?", function() {
        $.ajax({
            type: "PUT",
            url: url.origin + `/api` + url.pathname,
            dataType: "json",
            data: {
                status: 0
            },
            success: function(response){
                showModalInformation("Os dados da descida classificatória foram limpos com sucesso.", () => { window.location.reload(); }, () => { window.location.reload(); });
            },
            error: function(res, status, error) {
                const response = JSON.parse(res.responseText);
                showModalInformation(response.message);
            }
        });
    });   
}
function initCompetition() {
    showModalOption("Você tem certeza de que deseja iniciar a prova?", initRun);   
}
function clearCompetition() {
    showModalOption("Você tem certeza de que deseja limpar os dados relacionados a  prova?", function() {
        $.ajax({
            type: "PUT",
            url: url.origin + `/api` + url.pathname,
            dataType: "json",
            data: {
                status: 1
            },
            success: function(response){
                showModalInformation("Os dados da prova foram limpos com sucesso.", () => { window.location.reload(); }, () => { window.location.reload(); });
            },
            error: function(res, status, error) {
                const response = JSON.parse(res.responseText);
                showModalInformation(response.message);
            }
        });
    });   
}

$('#modalLog').find('#btnCancelar').on('click', cancelRun);
$('#modalLog').find('.close-modal').on('click', cancelRun);
$('#modalLog').find('#btnFinalizar').on('click', finishRun);

$('#btnIniciarDc').on('click', initDc);
$('#btnLimparDc').on('click', clearDc);
$('#btnIniciarProva').on('click', initCompetition);
$('#btnLimparProva').on('click', clearCompetition);

function showModalBackup() {
    $('#modalBackup').addClass('show');
}
function closeModalBackup() {
    $('#modalBackup').removeClass('show');
}
function showFileExplorer() {
    $('#modalBackup').find('#arquivoBackup').click();
}
function updateFileName() {
    const absoluteFileName = $('#modalBackup').find('#arquivoBackup').val();
    const fileName = absoluteFileName.split('\\').pop();
    $('#modalBackup').find('#nomeArquivoBackup').val( fileName );
}
function importarBackup() {
    if (!$('#arquivoBackup').val()) {
        showModalInformation('Você deve informar um arquivo válido.');
        return;
    }

    const formData = new FormData();
    const file = $('#modalBackup').find('#arquivoBackup')[0].files[0];
    formData.append('arquivoBackup', file);

    $.ajax({
        type: "POST",
        url: url.origin + `/api` + url.pathname + `/backup`,
        dataType: "json",
        data: formData,
        contentType: false,
        processData: false,
        success: function(response){
            closeModalBackup();
            showModalInformation('Backup importado com sucesso.', () => { document.location.reload(); }, () => { document.location.reload(); });
        },
        error: function(res, status, error) {
            const response = JSON.parse(res.responseText);
            showModalInformation(response.message);
        }
    });
}
$('#modalBackup').find('.close-modal').on('click', closeModal);
$('#modalBackup').find('#btnCancelar').on('click', closeModal);
$('#modalBackup').find('#btnSelecionarArquivoBackup').on('click', showFileExplorer);
$('#modalBackup').find('#arquivoBackup').on('change', updateFileName);
$('#modalBackup').find('#btnImportarBackup').on('click', importarBackup);
$('#btnModalBackup').on('click', showModalBackup);

$('input[name="cpfCompetidor"]').mask('000.000.000-00', {reverse: true});

function openLiveView() {
    window.open( `/campeonatos/${campeonatoId}/etapas/${etapaId}/live`, 'Live', `scrollbars=no,status=no,location=no,toolbar=no,menubar=no,
    width=0,height=0,left=-1000,top=-1000`);
}

$('#btnLive').on('click', openLiveView);