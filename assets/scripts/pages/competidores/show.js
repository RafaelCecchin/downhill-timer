function adicionarCompetidor(event) {
    event.preventDefault();
    
    if(!isValidCompetidorFormData()) {
        return;
    }
    
    $.ajax({
        type: "POST",
        url: url.origin + `/api/competidores`,
        dataType: "json",
        data: $('#formCompetidor').serialize(),
        success: function(response){
            const competidorUrl = url.origin + `/competidores/${response.id}`;
            showModalInformation("Competidor criado com sucesso.", () => { window.location.href = competidorUrl }, () => { window.location.href = competidorUrl });
        },
        error: function(res, status, error) {
            const response = JSON.parse(res.responseText);
            showModalInformation(response.message);
        }
    });    
}
function salvarCompetidor(event) {
    event.preventDefault();
    
    if(!isValidCompetidorFormData()) {
        return;
    }

    $.ajax({
        type: "PUT",
        url: url.origin + `/api` + url.pathname,
        dataType: "json",
        data: $('#formCompetidor').serialize(),
        success: function(response){
            showModalInformation("Competidor atualizado com sucesso.");
        },
        error: function(res, status, error) {
            const response = JSON.parse(res.responseText);
            showModalInformation(response.message);
        }
    });
}
function excluirCompetidor(event) {
    event.preventDefault();

    showModalOption("Ao excluir esse competidor, todo o histórico dele nas etapas será perdido. Tem certeza que deseja excluir esse competidor?", function () {
        $.ajax({
            type: "DELETE",
            url: url.origin + `/api` + url.pathname,
            dataType: "json",
            success: function(response){
                const competidoresUrl = url.origin + `/competidores`;
                showModalInformation("Competidor excluído com sucesso.", () => { window.location.href = competidoresUrl }, () => { window.location.href = competidoresUrl });
            },
            error: function(res, status, error) {
                const response = JSON.parse(res.responseText);
                showModalInformation(response.message);
            }
        });
    });        
}
function isValidCompetidorFormData() {
    const cpfCompetidor = $('#formCompetidor').find('input[name="cpfCompetidor"]').val();
    const nomeCompetidor = $('#formCompetidor').find('input[name="nomeCompetidor"]').val();
    const generoCompetidor = $('#formCompetidor').find('select[name="generoCompetidor"]').val();
    const dataNascimentoCompetidor = $('#formCompetidor').find('input[name="dataNascimentoCompetidor"]').val();
    const patrocinadorCompetidor = $('#formCompetidor').find('input[name="patrocinadorCompetidor"]').val();

    if (!cpfCompetidor) {
        showModalInformation("Informe o CPF do competidor.");
        return false;
    }

    if (!isValidCpf(cpfCompetidor)) {
        showModalInformation("Informe um CPF válido.");
        return false;
    }

    if (!nomeCompetidor) {
        showModalInformation("Informe o nome do competidor.");
        return false;
    }

    if (!generoCompetidor) {
        showModalInformation("Informe o gênero do competidor.");
        return false;
    }

    if (!dataNascimentoCompetidor) {
        showModalInformation("Informe a data de nascimento do competidor.");
        return false;
    }

    return true;
}

$('#btnAdicionarCompetidor').on('click', adicionarCompetidor);
$('#btnSalvarCompetidor').on('click', salvarCompetidor);
$('#btnExcluirCompetidor').on('click', excluirCompetidor);    

$('input[name="cpfCompetidor"]').mask('000.000.000-00', {reverse: true});