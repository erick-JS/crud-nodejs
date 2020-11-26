// cSpell:Ignore versao bodyparser
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const InicializaMongoServer = require('./config/db')
const livro = require('./routes/Livro')

//Inicializamos o servidor MongoDB
InicializaMongoServer()

const app = express()

//porta default
const PORT = process.env.PORT || 4000;

//Middleware básico
app.use(function (req, res, next) {
    //Em produção, remova o * e informe a sua URL
    res.setHeader('Access-Control-Allow-Origin', '*')

    //Cabeçalhos que serão permitidos
    res.setHeader('Access-Control-Allow-Headers', 'Origin', 'X-Requested-With, Content-Type, Accept, x-access-token')

    //Métodos que serão permitidos
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    next()
})

//parse JSON (validação)
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.json({
        mensagem: 'API do projeto funcionando',
        versao: '1.0.0'
    })
})

//Rotas do Livro
app.use('/livro', livro)

app.listen(PORT, (req, res) => {
    console.log(`Servidor do projeto iniciado na porta ${PORT}`)
})