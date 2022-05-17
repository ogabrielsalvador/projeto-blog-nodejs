// criando um pequeno midleware p/ permitir o acesso as áreas de admin do site somente para usuários que sejam admin

module.exports = {
    eAdmin: function(req, res, next){
        if(req.isAuthenticated() && req.user.eAdmin == 1){
            // a primeira função verifica se o usuário está logado
            // a segunda função verifica com base na variável global 'user' se o usuário logado é admin
            return next();
        } else{
            req.flash('error_msg', 'Você precisa ser administrador para acessar essa página')
            res.redirect('/')
        }
    }
}
