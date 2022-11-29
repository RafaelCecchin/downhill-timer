function excluirCategoria(event) {
    event.preventDefault();

    const row = $( $(this).data('target') );
    const idCategoria = row.data('cod');

    showModalOption("Você tem certeza que deseja excluir essa categoria?", function () {
        $.ajax({
            type: "DELETE",
            url: url.origin + `/api/categorias/` + idCategoria,
            dataType: "json",
            success: function(response){
                row.remove();
                showModalInformation("Categoria excluída com sucesso.");                    
            },
            error: function(res, status, error) {
                const response = JSON.parse(res.responseText);
                showModalInformation(response.message);
            }
        });
    });   
}

$('.remove-row').on('click', excluirCategoria);    