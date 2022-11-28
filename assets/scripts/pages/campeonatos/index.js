function excluirCampeonato(event) {
    event.preventDefault();

    const row = $( $(this).data('target') );
    const idCampeonato = row.data('cod');

    showModalOption("Ao excluir esse campeonato você também apaga todas as etapas vinculadas a ele. Tem certeza que deseja excluir esse campeonato?", function () {
        $.ajax({
            type: "DELETE",
            url: url.origin + `/api/campeonatos/` + idCampeonato,
            dataType: "json",
            success: function(response){
                row.remove();
                showModalInformation("Campeonato excluído com sucesso.");                    
            },
            error: function(res, status, error) {
                const response = JSON.parse(res.responseText);
                showModalInformation(response.message);
            }
        });
    });   
}

$('.remove-row').on('click', excluirCampeonato);    