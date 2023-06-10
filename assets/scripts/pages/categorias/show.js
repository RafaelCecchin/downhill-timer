function validarCategoria() {
    const nomeCategoria = $('#formCategoria').find('input[name="nomeCategoria"]').val();
    const generoCategoria = $('#formCategoria').find('select[name="generoCategoria"]').val();

    if (!nomeCategoria) {
        showModalInformation("Informe um nome para a categoria.");
        return false;
    }

    if (!generoCategoria) {
        showModalInformation("Informe um gênero para a categoria.");
        return false;
    }

    return true;
}

function salvarCategoria(event) {
    event.preventDefault();

    if (!validarCategoria()) {
        return;
    }

    switch(formAction) {
        case 'create':
            $.ajax({
                type: "POST",
                url: url.origin + `/api/categorias`,
                dataType: "json",
                data: $( this ).serialize(),
                success: function(response){
                    const categoriaUrl = url.origin + `/categorias/${response.id}`;
                    showModalInformation("Categoria criada com sucesso.", () => { window.location.href = categoriaUrl }, () => { window.location.href = categoriaUrl });
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
                    showModalInformation("Categoria atualizada com sucesso.");
                },
                error: function(res, status, error) {
                    const response = JSON.parse(res.responseText);
                    showModalInformation(response.message);
                }
            });

            break;
    }

       
}
function excluirCategoria(event) {
    event.preventDefault();

    showModalOption("Você tem certeza que deseja excluir essa categoria?", function () {
        $.ajax({
            type: "DELETE",
            url: url.origin + `/api` + url.pathname,
            dataType: "json",
            success: function(response){
                const categoriasUrl = url.origin + `/categorias`;
                showModalInformation("Categoria excluída com sucesso.", () => { window.location.href = categoriasUrl }, () => { window.location.href = categoriasUrl });
            },
            error: function(res, status, error) {
                const response = JSON.parse(res.responseText);
                showModalInformation(response.message);
            }
        });
    });        
}

$('#formCategoria').on('submit', salvarCategoria);
$('#btnExcluirCategoria').on('click', excluirCategoria);    