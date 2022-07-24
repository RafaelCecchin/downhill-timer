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