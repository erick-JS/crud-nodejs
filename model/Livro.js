//cSpell:Ignore maxlength qtde genero preco
const mongoose = require('mongoose')

const LivroSchema = mongoose.Schema({
    ISBN: { type: String, unique: true, required: true },
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    editora: { type: String, required: true },
    idioma: { type: String, required: true },
    genero: {
        type: String,
        enum: ['Ficção científica', 'Romance', 'Literatura', 'História', 'Línguas', 'Ciências Exatas'],
        default: 'Ficção científica',
        required: [true, 'O nome do gênero é obrigatório']
    },
    qtdePaginas: { type: Number, required: true },
    foto: { type: String, required: true },
    sinopse: { type: String, required: false },
    preco: { type: Number, required: true }
}, {
    timestamps: { createdAt: 'criadoEm', updatedAt: 'alteradoEm' }
})

module.exports = mongoose.model('livro', LivroSchema)