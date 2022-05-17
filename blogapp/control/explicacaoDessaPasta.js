/*
Encontrei uma forma de validar os campos sem precisar está fazendo todo o processo em cada rota. 

Por questão de organização, criei uma pasta com o nome "Control"
Dentro dela criei um arquivo com o nome "validaCampos.js"

Segue estrutara: 

/control/validaCampos.js

########## script 

// Crie uma função que recebe por parâmetros os dados enviados pelo formulário
 // e faz a validação dos campos

var verifica = function validaCampos(dados){

    var erros = []

    // ao inves de utilizar o req.body.nome você deve utilizar o dados.nome
        //devido ao dados ter recebido o req.body

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

module.exports = verifica;

################### No arquivo de rotas "admin.js"

# Só fazer o importe do módulo da função

/adim.js

#script 

//criar uma variável para receber a função. 
                            //apontar para onde está o arquivo
const validaCampos = require('../control/validaCampos.js)

# Na rota onde você vai fazer a validação, ao invés de usar todos aqueles if
# Basta criar uma variável que vai receber a função e passar por paramêmtro os dados do formulário

// Variável que vai receber a função passando a ela por parâmetro os dados do formulário (req.body)
var erros = validaCampos(req.body)

# agora só basta validar se existe erro ou não

if(erros.length > 0){

        res.render("admin/addcategoria", {erros: erros})


} else {

    // Caso não existir erro,  Fazer todo o processo para salvar no banco
}

## Assim é possível validar vários formulários, só criar as validações no módulo de validação (validaCampos.js)
*/