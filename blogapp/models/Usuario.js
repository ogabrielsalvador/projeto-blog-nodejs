const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Usuario = new Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    eAdmin: {               // forma de conferir se já existe um registro com os dados informados
        type: Number,       // o 'default: 0' significa que não existe nenhum registro
        default: 0          // quando existir o default passará a ser igual a '1'
    },
    senha: {
        type: String,
        required: true
    }
})

mongoose.model('usuarios', Usuario)