// Crie uma função que recebe por parâmetros os dados enviados pelo formulário e faz a validação dos campos

var verificaPostagem = function validaPostagem(dados){

    var erros = []

    // ao inves de utilizar o 'req.body.nome' você deve utilizar o 'dados.nome'
    // devido ao 'dados' ter recebido o 'req.body'

    if(!dados.titulo || typeof dados.titulo == undefined || dados.titulo == null){
        erros.push({
            texto: "Título inválido"
        })
    }

    if(dados.titulo.length < 2){
        erros.push({
            texto: "Título da postagem é muito pequeno. "
        })
    }

    if(!dados.slug || typeof dados.slug == undefined || dados.slug == null){
        erros.push({
            texto: "Slug inválido"
        })
    }

    if(!dados.descricao || typeof dados.descricao == undefined || dados.descricao == null){
        erros.push({
            texto: "Descrição inválida"
        })
    }

    if(!dados.conteudo || typeof dados.conteudo == undefined || dados.conteudo == null){
        erros.push({
            texto: "Conteúdo inválido"
        })
    }

    if(dados.categoria == '0'){
        erros.push({
            texto: 'Categoria inválida, registre uma categoria'
        })
    }

    //Tem que retornar a quantidade de erros! 
    return erros;
}

//Muito importante, não se esquecer de exportar o "módulo"

module.exports = verificaPostagem