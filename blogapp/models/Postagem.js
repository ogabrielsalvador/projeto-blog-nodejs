const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Postagem = new Schema({
    titulo:{
        type: String,
        required: true
    },
    slug:{
        type: String,
        required: true
    },
    descricao:{
        type: String,
        required: true
    },
    conteudo:{
        type: String,
        required: true
    },
    categoria:{
        type: Schema.Types.ObjectId,        // ele é o id de algum objeto
        ref: 'categorias',                  // o valor de referência é o model 'categorias'
        required: true                      // ou seja, ele irá ser o id de alguma categoria
    },
    data:{
        type: Date,
        default: Date.now()
    }
})

mongoose.model('postagens', Postagem)