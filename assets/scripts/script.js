// Url
const url = new URL(window.location.href);

// Modal
function closeModal(event, modal = false) {
    if (event) {
        $(this).parents('.modal').removeClass('show');
        return;
    }

    modal.removeClass('show');
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

// Helper

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}