const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
const Categoria = mongoose.model('categorias')
const validaCategoria = require('../control/validaCategoria')
require('../models/Postagem')
const Postagem = mongoose.model('postagens')
const validaPostagem = require('../control/validaPostagem')
const {eAdmin} = require('../helpers/eAdmin')

// HOME
router.get('/', eAdmin, (req, res) => {
    res.render('admin/index')
})

router.get('/posts', eAdmin, (req, res) => {
    res.send('Página de posts')
})

// ROTA DAS CATEGORIAS
router.get('/categorias', eAdmin, (req, res) => {
    Categoria.find().lean().sort({data:'desc'}).then((categorias) => {
        res.render('admin/categorias', {categorias: categorias})
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar as categorias<br>Erro: ' + err)
        res.redirect('/admin')
    })
})

router.get('/categorias/add', eAdmin, (req, res) => {
    res.render('admin/addcategorias')
})

router.post('/categorias/nova', eAdmin, (req, res) => {
    
    // Variável que vai receber a função passando a ela por parâmetro os dados do formulário (req.body)

    var erros = validaCategoria(req.body)

    if(erros.length > 0){
        res.render('admin/addcategorias', {erros: erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        new Categoria(novaCategoria).save().then(() => {
            req.flash('success_msg', 'Categoria criada com sucesso!')
            res.redirect('/admin/categorias')
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao tentar salvar a categoria, tente novamente!<br>Erro: ' + err)
            res.redirect('/admin/categorias')
        })
    }
})

router.get('/categorias/edit/:id', eAdmin, (req, res) => {
    Categoria.findOne({_id:req.params.id}).lean().then((categoria) => {
        res.render('admin/editcategorias', {categoria: categoria})
    }).catch((err) => {
        req.flash('error_msg', 'Esta categoria não existe')
        res.redirect('/admin/categorias')
    })
})

router.post('/categorias/edit', eAdmin, (req, res) => {
    
    var erros = validaCategoria(req.body)

    if(erros.length > 0){
        Categoria.findOne({_id:req.body.id}).lean().then((categoria) => {
            res.render('admin/editcategorias', {erros: erros, categoria: categoria})
        }).catch((err) => {
            req.flash('error_msg', 'Esta categoria não existe')
            res.redirect('/admin/categorias')
        })
    }else{
        Categoria.findOne({_id: req.body.id}).then((categoria) => {

            categoria.nome = req.body.nome
            categoria.slug = req.body.slug
    
            categoria.save().then(() => {
                req.flash('success_msg', 'Categoria editada com sucesso!')
                res.redirect('/admin/categorias')
            }).catch((err) => {
                req.flash('error_msg', 'Houve um erro interno ao salvar a edição da categoria')
                res.redirect('/admin/categorias')
            })
    
    
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao editar a categoria' + err)
            res.redirect('/admin/categorias')
        })
    }
})

router.post('/categorias/delete', eAdmin, (req, res) => {
    Categoria.deleteOne({_id: req.body.id}).then(() => {
        req.flash('success_msg', 'Categoria deletada com sucesso')
        res.redirect('/admin/categorias')
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao deletar a categoria')
        res.redirect('/admin/categorias')
    })
})

// ROTA DAS POSTAGENS
router.get('/postagens', eAdmin, (req, res) => {
    Postagem.find().lean().populate('categoria').sort({data:'desc'}).then((postagens) => {
        res.render('admin/postagens', {postagens: postagens})
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar as postagens<br>Erro: ' + err)
        res.redirect('/admin')
    })
})

router.get('/postagens/add', eAdmin, (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render('admin/addpostagens', {categorias: categorias})
    }).catch((err) => {
        req.flash('error-msg', 'Houve um erro ao carregar o formulário')
        res.redirect('/admin')
    })
})

router.post('/postagens/nova', eAdmin, (req, res) => {
    
    // Variável que vai receber a função passando a ela por parâmetro os dados do formulário (req.body)

    var erros = validaPostagem(req.body)

    if(erros.length > 0){
        Categoria.find().lean().then((categorias) => {
            res.render('admin/addpostagens', {categorias: categorias, erros: erros})
        }).catch((err) => {
            req.flash('error-msg', 'Houve um erro ao carregar o formulário')
            res.redirect('/admin')
        })
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        }
        new Postagem(novaPostagem).save().then(() => {
            req.flash('success_msg', 'Postagem criada com sucesso!')
            res.redirect('/admin/postagens')
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao tentar salvar a postagem, tente novamente! Erro: ' + err)
            res.redirect('/admin/postagens')
        })
    }
})

router.get('/postagens/edit/:id', eAdmin, (req, res) => {

    Postagem.findOne({_id: req.params.id}).lean().then((postagem) => {

        Categoria.find().lean().then((categorias) => {
            res.render('admin/editpostagens', {categorias:categorias, postagem: postagem})

        }).catch((err) => {
            req.flash('error_msg', 'Erro ao listar as categorias')
            res.redirect('/admin/postagens')
        })

    }).catch((err) => {
        req.flash('error_msg', 'Erro ao carregar a página de edição')
        res.redirect('/admin/postagens')
    })
})

router.post('/postagens/edit', eAdmin, (req, res) => {
    
    var erros = validaPostagem(req.body)

    if(erros.length > 0){
        
        Postagem.findOne({_id: req.body.id}).lean().then((postagem) => {

            Categoria.find().lean().then((categorias) => {
                res.render('admin/editpostagens', {categorias:categorias, postagem: postagem, erros: erros})
    
            }).catch((err) => {
                req.flash('error_msg', 'Erro ao listar as categorias')
                res.redirect('/admin/postagens')
            })

        }).catch((err) => {
            req.flash('error_msg', 'Esta postagem não existe')
            res.redirect('/admin/postagens')
        })
    }else{
        Postagem.findOne({_id: req.body.id}).then((postagem) => {

            postagem.titulo = req.body.titulo
            postagem.slug = req.body.slug
            postagem.descricao = req.body.descricao
            postagem.conteudo = req.body.conteudo
            postagem.categoria = req.body.categoria
    
            postagem.save().then(() => {
                req.flash('success_msg', 'Postagem editada com sucesso!')
                res.redirect('/admin/postagens')

            }).catch((err) => {
                req.flash('error_msg', 'Houve um erro interno ao salvar a edição da postagem')
                res.redirect('/admin/postagens')
            })
    
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao editar a postagem' + err)
            res.redirect('/admin/postagens')
        })
    }
})

router.post('/postagens/delete', eAdmin, (req, res) => {
    Postagem.deleteOne({_id: req.body.id}).then(() => {
        req.flash('success_msg', 'Postagem deletada com sucesso')
        res.redirect('/admin/postagens')
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao deletar a postagem')
        res.redirect('/admin/postagens')
    })
})

module.exports = router