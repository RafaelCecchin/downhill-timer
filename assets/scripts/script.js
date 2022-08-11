// Url
const url = new URL(window.location.href);

// Modal
function closeModal() {
    $(this).parents('.modal').removeClass('show');
}
function showModalOption(message, yesCallback, noCallback = closeModal, closeCallback = closeModal) {
    $('#modalOption').addClass('show');
    $('#modalOption').find('.information-text').text(message);
    $('#modalOption').find('#btnAceitar').off('click').on('click', yesCallback).on('click', closeModal);
    $('#modalOption').find('#btnRecusar').off('click').on('click', noCallback).on('click', closeModal);
    $('#modalOption').find('.close-modal').off('click').on('click', closeCallback).on('click', closeModal);
}
function showModalInformation(message, okCallback = closeModal, closeCallback = closeModal) {
    $('#modalInformation').addClass('show');
    $('#modalInformation').find('.information-text').text(message);
    $('#modalInformation').find('#btnOk').off('click').on('click', okCallback).on('click', closeModal);
    $('#modalInformation').find('.close-modal').off('click').on('click', closeCallback).on('click', closeModal);
}
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