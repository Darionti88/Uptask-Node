const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const Usuarios = require('../Models/Usuarios')


//Local Strategy con credenciales propias (mail y pass)

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done)=>{
            try{

                const usuario = await Usuarios.findOne({where:{
                    email,
                    activo: 1
                }})
            //usuario existe pero password no
            if(!usuario.verificarPassword(password)) {
                return done(null, false,{
                    message:'Password Incorrecto'
                })
            }
            //Ambos están bien
                return done(null, usuario)
            
            }catch (error){
                return done(null, false,{
                    message:'Esa cuenta no existe'
                })
            }
        }
    )
)

//serializar usuario
passport.serializeUser((usuario, callback)=>{
    callback(null, usuario)
})

//deserializar el usuario
passport.deserializeUser((usuario, callback)=>{
    callback(null, usuario)
})

//Exporto
module.exports = passport