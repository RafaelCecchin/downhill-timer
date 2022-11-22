function excluirEtapa(event) {
    event.preventDefault();

    const row = $( $(this).data('target') );
    const idEtapa = row.data('cod');

    showModalOption("Você tem certeza que deseja excluir essa etapa?", function () {
        $.ajax({
            type: "DELETE",
            url: url.origin + `/api/etapas/` + idEtapa,
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