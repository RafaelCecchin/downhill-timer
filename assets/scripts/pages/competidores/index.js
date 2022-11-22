function excluirCompetidor(event) {
    event.preventDefault();

    const row = $( $(this).data('target') );
    const idCompetidor = row.data('cod');

    showModalOption("Você tem certeza que deseja excluir esse competidor?", function () {
        $.ajax({
            type: "DELETE",
            url: url.origin + `/api/competidores/` + idCompetidor,
            dataType: "json",
            success: function(response){
                row.remove();
                showModalInformation("Competidor excluído com sucesso.");                    
            },
            error: function(res, status, error) {
                const response = JSON.parse(res.responseText);
                showModalInformation(response.message);
            }
        });
    });   
}

$('.remove-row').on('click', excluirCompetidor); 