async function showModalTest(loadingMessage, testCallback, finishCallback = closeModal, closeCallback = closeModal) {
    $('#modalTest').attr('class', 'modal modal-test').addClass('show').addClass('status-loading');
    $('#modalTest').find('.information-text').text(loadingMessage);
    $('#modalTest').find('#btnFinalizar').off('click').on('click', finishCallback).on('click', closeModal);
    $('#modalTest').find('.close-modal').off('click').on('click', closeCallback).on('click', closeModal).on('click', function() {
        if ($('#modalTest').hasClass('status-loading')) {
            $('#modalTest').find('#btnCancelar').click();
        }
    });
    $('#modalTest').find('#btnFechar').off('click').on('click', closeCallback).on('click', closeModal);
    $('#modalTest').find('#btnCancelar').off('click').on('click', closeModal).on('click', function(event) {
        $('#modalTest').addClass('canceled');
        showModalInformation("Operação cancelada.");        
    });
    $('#modalTest').find('#btnTentarNovamente').off('click').on('click', function() {
        showModalTest(loadingMessage, testCallback, finishCallback, closeCallback);
    });    
    
    let testReturn = await testCallback();
    
    if (!$('#modalTest').hasClass('canceled')) {
        if (testReturn.status) {
            $('#modalTest').attr('class', 'modal modal-test show').addClass('status-finish');
            $('#modalTest').find('.information-text').text(testReturn.message ?? "Teste finalizado com sucesso.");
        } else {
            $('#modalTest').attr('class', 'modal modal-test show').addClass('status-error');
            $('#modalTest').find('.information-text').text(testReturn.message ?? "Ocorreu um erro ao realizar o teste.");
        }
    }        
}

function salvarConfiguracao(event) {
    event.preventDefault();

    $.ajax({
        type: "PUT",
        url: url.origin + `/api` + url.pathname,
        dataType: "json",
        data: $('#formConfiguracao').serialize(),
        success: function(response){
            showModalInformation("Configuração atualizada com sucesso.");
        },
        error: function(res, status, error) {
            const response = JSON.parse(res.responseText);
            showModalInformation(response.message);
        }
    });
}

function testCentralSerialConnection() {
    showModalTest('Aguarde enquanto o teste de conexão serial está sendo realizado.', async function() {
        return new Promise((resolve, reject) => {
            
            setTimeout(function () {
                $.ajax({
                    type: "GET",
                    url: url.origin + `/api/serial/central`,
                    dataType: "json",
                    complete: function(response){
                        resolve( JSON.parse(response.responseText) );
                    }
                });
            }, 1000);

        });
    }); 
}

function testLargadaConnection() {
    showModalTest('Aguarde enquanto o teste de conexão LoRa está sendo realizado.', async function() {
        return new Promise((resolve, reject) => {
            
            setTimeout(function () {
                $.ajax({
                    type: "GET",
                    url: url.origin + `/api/serial/largada`,
                    dataType: "json",
                    complete: function(response){
                        resolve( JSON.parse(response.responseText) );
                    }
                });
            }, 1000);

        });
    }); 
}
function testLargadaRfid() {
    showModalTest('Aproxime um RFID do leitor de largada.', async function() {
        return new Promise((resolve, reject) => {
            
            setTimeout(function () {
                $.ajax({
                    type: "GET",
                    url: url.origin + `/api/serial/largada/rfid`,
                    dataType: "json",
                    complete: function(response){
                        resolve( JSON.parse(response.responseText) );
                    }
                });
            }, 1000);

        });
    }); 
}
function testAndUpdateLargadaRtc() {
    showModalTest('Aguarde enquanto a data e hora são obtidas.', async function() {
        return new Promise((resolve, reject) => {
            
            setTimeout(function () {
                $.ajax({
                    type: "GET",
                    url: url.origin + `/api/serial/largada/rtc`,
                    dataType: "json",
                    complete: function(response){
                        resolve( JSON.parse(response.responseText) );
                    }
                });
            }, 1000);

        });
    }); 
}
function testLargadaInterruptor() {
    showModalTest('Acione o interruptor de largada.', async function() {
        return new Promise((resolve, reject) => {
            
            setTimeout(function () {
                $.ajax({
                    type: "GET",
                    url: url.origin + `/api/serial/largada/interruptor`,
                    dataType: "json",
                    complete: function(response){
                        resolve( JSON.parse(response.responseText) );
                    }
                });
            }, 1000);

        });
    }); 
}

function testChegadaConnection() {
    showModalTest('Aguarde enquanto o teste de conexão ESP-NOW está sendo realizado.', async function() {
        return new Promise((resolve, reject) => {
            
            setTimeout(function () {
                $.ajax({
                    type: "GET",
                    url: url.origin + `/api/serial/chegada`,
                    dataType: "json",
                    complete: function(response){
                        resolve( JSON.parse(response.responseText) );
                    }
                });
            }, 1000);

        });
    }); 
}
function testChegadaRfid() {
    showModalTest('Aproxime um RFID do leitor de chegada.', async function() {
        return new Promise((resolve, reject) => {
            
            setTimeout(function () {
                $.ajax({
                    type: "GET",
                    url: url.origin + `/api/serial/chegada/rfid`,
                    dataType: "json",
                    complete: function(response){
                        resolve( JSON.parse(response.responseText) );
                    }
                });
            }, 1000);

        });
    }); 
}
function testAndUpdateChegadaRtc() {
    showModalTest('Aguarde enquanto a data e hora são obtidas.', async function() {
        return new Promise((resolve, reject) => {
            
            setTimeout(function () {
                $.ajax({
                    type: "GET",
                    url: url.origin + `/api/serial/chegada/rtc`,
                    dataType: "json",
                    complete: function(response){
                        resolve( JSON.parse(response.responseText) );
                    }
                });
            }, 1000);

        });
    }); 
}
function testChegadaInterruptor() {
    showModalTest('Acione o interruptor de chegada.', async function() {
        return new Promise((resolve, reject) => {
            
            setTimeout(function () {
                $.ajax({
                    type: "GET",
                    url: url.origin + `/api/serial/chegada/interruptor`,
                    dataType: "json",
                    complete: function(response){
                        resolve( JSON.parse(response.responseText) );
                    }
                });
            }, 1000);

        });
    }); 
}

$('#btnSelecionarCom').on('click', salvarConfiguracao);

$('#btnTestarSerial').on('click', testCentralSerialConnection);

$('#btnTestarConexaoLargada').on('click', testLargadaConnection);
$('#btnTestarRfidLargada').on('click', testLargadaRfid);
$('#btnTestarRtcLargada').on('click', testAndUpdateLargadaRtc);
$('#btnTestarInterruptorLargada').on('click', testLargadaInterruptor);

$('#btnTestarConexaoChegada').on('click', testChegadaConnection);
$('#btnTestarRfidChegada').on('click', testChegadaRfid);
$('#btnTestarRtcChegada').on('click', testAndUpdateChegadaRtc);
$('#btnTestarInterruptorChegada').on('click', testChegadaInterruptor);