const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../modelos/usuario');

passport.serializeUser((usuario, done)=>{ 
    done(null, usuario._id); 
}) 

passport.deserializeUser((id, done)=>{
    Usuario.findById(id, (err,usuario)=> {
        done(err, usuario);
    })
})

passport.use(new LocalStrategy(
    {usernameField: 'email'},
    (email, password, done) => {
        Usuario.findOne({email:email}, (err, usuario)=> {
            if (!usuario){
                return done(null, false, {message: `Este email ${email} no está registrado`});
            }else{
                usuario.compararPassword(password, (err, sonIguales)=>{
                    if(sonIguales){
                        return done(null, usuario);
                    }else{
                        return done(null, false, {message: 'Datos incorrectos'}); 
                    }
                })
            }   
        })
    }
));

exports.estaAutenticado = (req, res, next) => {
    if(req.isAuthenticated()){
        return next()
    }
    res.status(401).send('Tienes que hacer login para acceder a este recurso')
}