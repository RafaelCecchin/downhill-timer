function adicionarCampeonato(event) {
    event.preventDefault();
    
    const nomeCampeonato = $('#formCampeonato').find('input[name="nomeCampeonato"]').val();

    if (!nomeCampeonato) {
        showModalInformation("Informe um nome para o campeonato.");
        return;
    }

    $.ajax({
        type: "POST",
        url: url.origin + `/api/campeonatos`,
        dataType: "json",
        data: {
            nomeCampeonato: nomeCampeonato
        },
        success: function(response){
            const campeonatoUrl = url.origin + `/campeonatos/${response.id}`;
            showModalInformation("Campeonato criado com sucesso.", () => { window.location.href = campeonatoUrl }, () => { window.location.href = campeonatoUrl });
        },
        error: function(res, status, error) {
            const response = JSON.parse(res.responseText);
            showModalInformation(response.message);
        }
    });    
}
function salvarCampeonato(event) {
    event.preventDefault();

    $.ajax({
        type: "PUT",
        url: url.origin + `/api` + url.pathname,
        dataType: "json",
        data: $('#formCampeonato').serialize(),
        success: function(response){
            showModalInformation("Campeonato atualizado com sucesso.");
        },
        error: function(res, status, error) {
            const response = JSON.parse(res.responseText);
            showModalInformation(response.message);
        }
    });
}
function excluirCampeonato(event) {
    event.preventDefault();

    showModalOption("Você tem certeza que deseja excluir esse campeonato?", function () {
        $.ajax({
            type: "DELETE",
            url: url.origin + `/api` + url.pathname,
            dataType: "json",
            success: function(response){
                const campeonatosUrl = url.origin + `/campeonatos`;
                showModalInformation("Campeonato excluído com sucesso.", () => { window.location.href = campeonatosUrl }, () => { window.location.href = campeonatosUrl });
            },
            error: function(res, status, error) {
                const response = JSON.parse(res.responseText);
                showModalInformation(response.message);
            }
        });
    });        
}

$('#btnAdicionarCampeonato').on('click', adicionarCampeonato);
$('#btnSalvarCampeonato').on('click', salvarCampeonato);
$('#btnExcluirCampeonato').on('click', excluirCampeonato);   