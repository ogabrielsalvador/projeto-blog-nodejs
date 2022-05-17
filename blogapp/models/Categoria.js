const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Categoria = new Schema({
    nome: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true          // o 'require' torna obrigatório ao usuário informar algo
    },
    data: {
        type: Date,
        default: Date.now()     // o 'default' adiciona um valor padrão p/ caso o usuário não informe nada
    }
})

mongoose.model('categorias', Categoria)