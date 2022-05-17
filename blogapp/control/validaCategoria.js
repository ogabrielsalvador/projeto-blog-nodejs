// Crie uma função que recebe por parâmetros os dados enviados pelo formulário e faz a validação dos campos

var verificaCategoria = function validaCategoria(dados){

    var erros = []

    // ao inves de utilizar o 'req.body.nome' você deve utilizar o 'dados.nome'
    // devido ao 'dados' ter recebido o 'req.body'

    if(!dados.nome || typeof dados.nome == undefined || dados.nome == null){
        erros.push({
            texto: "Nome inválido"
        })
    }

    if(dados.nome.length < 2){
        erros.push({
            texto: "Nome da categoria é muito pequeno. "
        })
    }

    if(!dados.slug || typeof dados.slug == undefined || dados.slug == null){
        erros.push({
            texto: "Slug inválido"
        })
    }

    //Tem que retornar a quantidade de erros! 
    return erros;
}

//Muito importante, não se esquecer de exportar o "módulo"

module.exports = verificaCategoria