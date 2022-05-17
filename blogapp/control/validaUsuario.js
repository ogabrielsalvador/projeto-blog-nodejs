// Crie uma função que recebe por parâmetros os dados enviados pelo formulário e faz a validação dos campos

var verificaUsuario = function verificaUsuario(dados){

    var erros = []

    // ao inves de utilizar o 'req.body.nome' você deve utilizar o 'dados.nome'
    // devido ao 'dados' ter recebido o 'req.body'

    if(!dados.nome || typeof dados.nome == undefined || dados.nome == null){
        erros.push({
            texto: "Nome inválido"
        })
    }

    if(dados.nome.length < 3){
        erros.push({
            texto: "Nome informado é muito pequeno, ele deve conter pelo menos 3 caracteres."
        })
    }

    if(!dados.email || typeof dados.email == undefined || dados.email == null){
        erros.push({
            texto: "Email inválido"
        })
    }

    if(!dados.senha || typeof dados.senha == undefined || dados.senha == null){
        erros.push({
            texto: "Senha inválida"
        })
    }

    if(dados.senha.length < 4){
        erros.push({
            texto: "Senha informada é muito pequena, ela deve conter pelo menos 4 caracteres."
        })
    }

    if (dados.senha != dados.senha2){
        erros.push({
            texto: "As senhas são diferentes, tente novamente!"
        })
    }

    //Tem que retornar a quantidade de erros! 
    return erros;
}

//Muito importante, não se esquecer de exportar o "módulo"

module.exports = verificaUsuario