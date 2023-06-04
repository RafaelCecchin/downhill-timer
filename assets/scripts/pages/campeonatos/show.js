function validarCampeonato() {
    const nomeCampeonato = $('#formCampeonato').find('input[name="nomeCampeonato"]').val();

    if (!nomeCampeonato) {
        showModalInformation("Informe um nome para o campeonato.");
        return false;
    }

    return true;
}
function salvarCampeonato(event) {
    event.preventDefault();

    if (!validarCampeonato()) {
        return;
    }

    switch(formAction) {
        case 'create':
            $.ajax({
                type: "POST",
                url: url.origin + `/api/campeonatos`,
                dataType: "json",
                data: $( this ).serialize(),
                success: function(response){
                    const campeonatoUrl = url.origin + `/campeonatos/${response.id}`;
                    showModalInformation("Campeonato criado com sucesso.", () => { window.location.href = campeonatoUrl }, () => { window.location.href = campeonatoUrl });
                },
                error: function(res, status, error) {
                    const response = JSON.parse(res.responseText);
                    showModalInformation(response.message);
                }
            });   

            break;
        case 'update':
            $.ajax({
                type: "PUT",
                url: url.origin + `/api` + url.pathname,
                dataType: "json",
                data: $( this ).serialize(),
                success: function(response){
                    showModalInformation("Campeonato atualizado com sucesso.");
                },
                error: function(res, status, error) {
                    const response = JSON.parse(res.responseText);
                    showModalInformation(response.message);
                }
            });

            break;
    } 
}
function excluirCampeonato(event) {
    event.preventDefault();

    showModalOption("Ao excluir esse campeonato você também apaga todas as etapas vinculadas a ele. Tem certeza que deseja excluir esse campeonato?", function () {
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

$('#formCampeonato').on('submit', salvarCampeonato);
$('#btnExcluirCampeonato').on('click', excluirCampeonato);

function excluirEtapa(event) {
    event.preventDefault();

    const row = $( $(this).data('target') );
    const idEtapa = row.data('cod');

    showModalOption("Você tem certeza que deseja excluir essa etapa?", function () {
        $.ajax({
            type: "DELETE",
            url: url.origin + `/api/campeonatos/${campeonatoId}/etapas/${idEtapa}`,
            dataType: "json",
            success: function(response){
                row.remove();
                showModalInformation("Etapa excluída com sucesso.");                    
            },
            error: function(res, status, error) {
                const response = JSON.parse(res.responseText);
                showModalInformation(response.message);
            }
        });
    });   
}

$('.remove-row').on('click', excluirEtapa);