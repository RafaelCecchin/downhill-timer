// Url
const url = new URL(window.location.href);

// Modal
function closeModal() {
    $(this).parents('.modal').removeClass('show');
}
function showModalOption(message, yesCallback, noCallback = closeModal, closeCallback = closeModal) {
    $('#modal-option').addClass('show');
    $('#modal-option').find('.information-text').text(message);
    $('#modal-option').find('#btn-aceitar').off('click').on('click', yesCallback);
    $('#modal-option').find('#btn-recusar').off('click').on('click', noCallback);
    $('#modal-option').find('.close-modal').off('click').on('click', closeCallback);
}
function showModalInformation(message, okCallback = closeModal, closeCallback = closeModal) {
    $('#modal-information').addClass('show');
    $('#modal-information').find('.information-text').text(message);
    $('#modal-information').find('#btn-ok').off('click').on('click', okCallback);
    $('#modal-information').find('.close-modal').off('click').on('click', closeCallback);
}
function showModalTest(loadingMessage, testCallback, finishCallback = closeModal, closeCallback = closeModal) {
    $('#modal-test').attr('class', 'modal modal-test').addClass('show').addClass('status-loading');
    $('#modal-test').find('.information-text').text(loadingMessage);
    $('#modal-test').find('#btn-finalizar').off('click').on('click', finishCallback);
    $('#modal-test').find('.close-modal').off('click').on('click', closeCallback);

    let testReturn = testCallback();
    
    if (testReturn.status) {
        $('#modal-test').attr('class', 'modal modal-test show').addClass('status-finish');
    } else {
        $('#modal-test').attr('class', 'modal modal-test show').addClass('status-error');
    }

    $('#modal-test').find('.information-text').text(testReturn.message);
}