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

function isValidCpf(informedCpf) {	
    let cpf = informedCpf.replace(/[^\d]+/g,'');	
    if(cpf == '') return false;	
    
    if (cpf.length != 11 || 
        cpf == "00000000000" || 
        cpf == "11111111111" || 
        cpf == "22222222222" || 
        cpf == "33333333333" || 
        cpf == "44444444444" || 
        cpf == "55555555555" || 
        cpf == "66666666666" || 
        cpf == "77777777777" || 
        cpf == "88888888888" || 
        cpf == "99999999999")
            return false;		
            
    let add = 0;	
    
    for (let i=0; i < 9; i ++)		
        add += parseInt(cpf.charAt(i)) * (10 - i);	
        let rev = 11 - (add % 11);	
        if (rev == 10 || rev == 11)		
            rev = 0;	
        if (rev != parseInt(cpf.charAt(9)))		
            return false;		
            
    add = 0;	
    for (let i = 0; i < 10; i ++)		
        add += parseInt(cpf.charAt(i)) * (11 - i);	
    rev = 11 - (add % 11);	
    if (rev == 10 || rev == 11)	
        rev = 0;	
    if (rev != parseInt(cpf.charAt(10)))
        return false;		
    return true;   
}