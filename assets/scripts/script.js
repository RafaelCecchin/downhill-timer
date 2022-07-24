// Modal
$('.close-modal').on('click', closeModal);

function closeModal() {
    $(this).parents('.modal').removeClass('show');
}
function showModalOption(message, yesCallback, noCallback = closeModal) {
    $('#modal-option').addClass('show');
    $('#modal-option').find('.information-text').text(message);
    $('#modal-option').find('#btn-aceitar').off('click').on('click', yesCallback);
    $('#modal-option').find('#btn-recusar').off('click').on('click', noCallback);
}
function showModalInformation(title, message, okCallback = closeModal) {
    $('#modal-information').addClass('show');
    $('#modal-information').find('.information-title').text(title);
    $('#modal-information').find('.information-text').text(message);
    $('#modal-information').find('#btn-ok').off('click').on('click', okCallback);
}
function showModalTest(loadingMessage, testCallback, finishCallback = closeModal) {
    $('#modal-test').attr('class', 'modal modal-test').addClass('show').addClass('status-loading');
    $('#modal-test').find('.information-text').text(loadingMessage);
    $('#modal-test').find('#btn-finalizar').off('click').on('click', finishCallback);

    let testReturn = testCallback();
    
    if (testReturn.status) {
        $('#modal-test').attr('class', 'modal modal-test show').addClass('status-finish');
    } else {
        $('#modal-test').attr('class', 'modal modal-test show').addClass('status-error');
    }

    $('#modal-test').find('.information-text').text(testReturn.message);
}
function testFunctionExample() {
    let ret = new Object();
    ret.status = 1; // 0 = Erro; 1 = ok;
    ret.message = 'Ok';

    return ret;
}