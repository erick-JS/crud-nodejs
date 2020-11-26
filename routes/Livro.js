//cSpell:Ignore maxlength qtde genero PRECO
const express = require('express')
const { check, validationResult } = require('express-validator')
const router = express.Router()
const Livro = require('../model/Livro')

// URL Padrão: localhost:4000/livro

//Lista todos os livros - GET 
router.get('/', async (req, res) => {
    try {
        const livro = await Livro.find().sort({ titulo: 1 })
        res.json(livro)
    } catch (e) {
        res.send({ error: `Erro ao obter os dados dos produtos: ${e.message}` })
    }
})

//Mostra o livro pelo ID selecionado
router.get("/:id", async (req, res) => {
    await Livro.findById(req.params.id)
        .then(livro => {
            res.send(livro)
        }).catch(err => {
            return res.status(400).send({
                message: `Erro ao obter o produto com o ID ${req.params.id}`
            })
        })
})

//Insere um novo livro - POST
router.post('/',
    [
        check('ISBN', 'Por favor, informe um ISBN válido.')
            //.isNumeric()
            .isISBN()
            //.isLength({ min: 13, max: 13 })
            .not().isEmpty(),
        check('titulo', 'Por favor, informe o título do livro.').not().isEmpty(),
        check('autor', 'Por favor, informe o autor do livro.').not().isEmpty(),
        check('editora', 'Por favor, informe a editora do livro.').not().isEmpty(),
        check('idioma', 'Por favor, informe o idioma do livro.').not().isEmpty(),
        check('genero', 'Por favor, informe o gênero do livro.')
            .isIn(['Ficção científica', 'Romance', 'Literatura', 'História', 'Línguas', 'Ciências Exatas']),
        check('qtdePaginas', 'Por favor, informe a quantidade de páginas do livro.').not().isEmpty(),
        check('foto', 'Por favor, insira uma foto do livro.')
            .isURL()
            .not().isEmpty(),
        check('preco', 'Por favor, informe um preço válido!')
            .isFloat({ min: 0 })
            .not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }

        const { ISBN, titulo, autor, editora, idioma, genero, qtdePaginas, foto, sinopse, preco } = req.body
        try {
            let livro = await Livro.findOne({ ISBN })
            if (livro) {
                return res.status(400).json({
                    mensagem: 'O ISBN informado já existe em outro livro'
                })
            }
            livro = new Livro({ ISBN, titulo, autor, editora, idioma, genero, qtdePaginas, foto, sinopse, preco })
            await livro.save()
            //return res.json({ 'mensagem': 'Livro incluído com sucesso!' })
            res.send(livro)
        } catch (err) {
            //return res.json({ 'mensagem': 'erro' })
            return res.status(500).json({ errors: `Erro ao salvar o livro: ${err.message}` })
        }

    }
)

//Apaga um determinado livro pelo ID - DELETE
router.delete("/:id", async (req, res) => {
    await Livro.findByIdAndRemove(req.params.id)
        .then(livro => {
            res.send({ message: 'Livro removido com sucesso!' })
        }).catch(err => {
            return res.status(400).send({
                message: `Não foi possível remover o livro com o ID ${req.params.id}`
            })
        })
})

//Edita o livro
router.put("/", [
    check('ISBN', 'Por favor, informe um ISBN válido.')
        //.isNumeric()
        .isISBN()
        //.isLength({ min: 13, max: 13 })
        .not().isEmpty(),
    check('titulo', 'Por favor, informe o título do livro.').not().isEmpty(),
    check('autor', 'Por favor, informe o autor do livro.').not().isEmpty(),
    check('editora', 'Por favor, informe a editora do livro.').not().isEmpty(),
    check('idioma', 'Por favor, informe o idioma do livro.').not().isEmpty(),
    check('genero', 'Por favor, informe o gênero do livro.')
        .isIn(['Ficção científica', 'Romance', 'Literatura', 'História', 'Línguas', 'Ciências Exatas']),
    check('qtdePaginas', 'Por favor, informe a quantidade de páginas do livro.').not().isEmpty(),
    check('foto', 'Por favor, insira uma foto do livro.')
        .isURL()
        .not().isEmpty(),
    check('preco', 'Por favor, informe um preço válido!')
        .isFloat({ min: 0 })
        .not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    let dados = req.body
    await Livro.findByIdAndUpdate(req.body._id, {
        $set: dados
    }, { new: true },
        function (err, result) {
            if (err) {
                res.send(err)
            } else {
                res.send(result)
            }
        })
})

module.exports = router