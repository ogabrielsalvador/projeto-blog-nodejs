const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

require('../models/Usuario')
const Usuario = mongoose.model('usuarios')
const validaUsuario = require('../control/validaUsuario')

const bcrypt = require('bcryptjs')      // é usado para encriptar a senha no banco de dados
const passport = require('passport')

router.get('/registro', (req, res) => {     // formulário p/ criar novo usuário
    if(req.user){
        req.flash('error_msg', 'É preciso fazer o logout para criar uma nova conta!')
        res.redirect('/')
    } else{
        res.render('user/registro')
    }
})

router.post('/registro', (req, res) => {    // processo de validação/salvando novo usuário

    var erros = validaUsuario(req.body)

    if(erros.length > 0){

        res.render('user/registro', {erros: erros})

    }else{
        
        Usuario.findOne({email: req.body.email}).then((usuario) => {

            if(usuario){
                req.flash('error_msg', 'Já existe uma conta cadastrada com esse email. Tente novamente!')
                res.redirect('/user/registro')
            }else{

                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha       // ainda falta transformar a senha em um hash
                })

                bcrypt.genSalt(10, (erro, salt) => {        // o 'salt' é para tornar a senha maior, adicionando caracteres aleatórios a ela
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {      // criando um hash com base na senha informada

                        if(erro){
                            req.flash('error msg', 'Houve um erro ao salvar o usuário')
                            res.redirect('/')
                        }else{

                            novoUsuario.senha = hash        // substituindo a senha pelo hash

                            novoUsuario.save().then(() => {
                                req.flash('success_msg', 'Usuário cadastrado com sucesso!')
                                res.redirect('/')
                            }).catch((err) => {
                                req.flash('error msg', 'Houve um erro ao criar o usuário')
                                res.redirect('/user/registro')
                            })
                        }
                    })
                })

            }

        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno ao verificar o seu email')
            res.redirect('/')
        })
    }
})

router.get('/login', (req, res) => {        // formulário p/ informar os dados de login
    if(req.user){
        req.flash('error_msg', 'Você já está logado!')
        res.redirect('/')
    } else{
        res.render('user/login')
    }
})

router.post('/login', (req, res, next) => {     // rota de autentificação
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true 
    })(req, res, next)
})

router.get('/logout', (req, res) => {       // rota para o usuário se deslogar
    req.logOut()
    req.flash('success_msg', 'Deslogado com sucesso!')
    res.redirect('/')
})



module.exports = router