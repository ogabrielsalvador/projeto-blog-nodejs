// Carregando módulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const bodyParser = require('body-parser')
    const app = express()

    const admin = require('./routes/admin')

    const path = require('path')
    const mongoose = require('mongoose')
    const session = require('express-session')
    const flash = require('connect-flash')      // o 'flash' funciona como mensagens que aparecem temporiariamente

    require('./models/Postagem')
    const Postagem = mongoose.model('postagens')

    require('./models/Categoria')
    const Categoria = mongoose.model('categorias')

    require('./models/Usuario')
    const Usuario = mongoose.model('usuarios')
    
    const user = require('./routes/user')

    const passport = require('passport')
    require('./config/auth')(passport)      // esse 'passport' é o parâmetro da function do 'module.exports' no arquivo 'auth'

// Configurações

    // Sessão
        // a ordem precisa ser essa: primeiro configura a sessão -> dps configura o passport -> dps configura o flash

        app.use(session({
            secret: 'cursodenode',      // essa é uma chave de segurança que gera uma sessão p/ vc (busque colocar algo bem seguro) 
            resave: true,
            saveUninitialized: true
        }))

        app.use(passport.initialize())  // os comandos do passport deve vir dps de 'session()' e antes de 'flash()'
        app.use(passport.session())

        app.use(flash())                // a config do 'flash' sempre deve ficar no final da config da 'sessão'

    // Middleware
        app.use((req, res, next) => {
            // declarando variáveis globais da aplicação, sempre que quiser criar uma é só usar o '.locals'
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            res.locals.error = req.flash('error')
            res.locals.user = req.user || null;     // variável global p/ armazenar os dados de sessão do usuário logado
            next()          // sempre ao fim de um middleware colocar um 'next()'
        })

    // Body Parser
        app.use(express.urlencoded({extended: true}))
        app.use(express.json())

    // Handlebars
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars')

    // Mongoose
        mongoose.Promise = global.Promise;
        mongoose.connect('mongodb://localhost/blogapp').then(() => {
            console.log('Conectado ao mongo')
        }).catch((err) => {
            console.log('Erro ao se conectar: ' + err)
        })

    // Public
        app.use(express.static(path.join(__dirname, 'public')))

// Rotas
    // Home Page
    app.get('/', (req, res) => {
        Postagem.find().lean().populate('categoria').sort({data: 'desc'}).then((postagens) => {
            res.render('index', {postagens: postagens})
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno ao carregar as postagens')
            res.redirect('/404')
        })
    })

    // Página para a leitura completa de uma postagem
    app.get('/postagem/:slug', (req, res) => {
        Postagem.findOne({slug: req.params.slug}).lean().populate('categoria').then((postagem) => {
            if(postagem){
                res.render('postagem/index', {postagem: postagem})
            }else{
                req.flash('error_msg', 'Esta postagem não existe')
                res.redirect('/')
            }
        }).catch((err) => {
            req.flash('error_msg', 'Houve um error interno ao carregar a página da postagem')
            res.redirect('/')
        })
    })

    // Página que lista todas as categorias
    app.get('/categorias', (req, res) => {
        Categoria.find().lean().then((categorias) => {

            // ordenando as categorias em ordem alfabética
            categorias.sort(function (a, b) {
                if (a.nome > b.nome) {
                    return 1;
                }
                if (a.nome < b.nome) {
                    return -1;
                }
                return 0;
                });

            res.render('categorias/index', {categorias: categorias})
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno ao listar as categorias')
            res.redirect('/')
        })
    })

    // Página que lista todas as postagens de um categoria
    app.get('/categorias/:slug', (req, res) => {
        Categoria.findOne({slug: req.params.slug}).lean().then((categoria) => {
            if(categoria){

                Postagem.find({categoria: categoria._id}).lean().then((postagens) => {

                    res.render('categorias/postagens', {postagens: postagens, categoria: categoria})

                }).catch((err) => {
                    req.flash('error_msg', 'Houve um erro ao listar as postagens dessa categoria' + err)
                    res.redirect('/')
                })

            }else{
                req.flash('error_msg', 'Esta categoria não existe')
                res.redirect('/')
            }
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro interno ao carregar a página desta categoria')
            res.redirect('/')
        })
    })

    // Error Page
    app.get('/404', (req, res) => {
        res.send('<h3>ERRO 404</h3>')
    })

    // acesso as páginas de admin
    app.use('/admin', admin)

    // acesso as páginas de usuários
    app.use('/user', user)

// Outros
    const PORT = process.env.PORT || 8081
    app.listen(PORT, () => {
        console.log('Servidor rodando')
    })
