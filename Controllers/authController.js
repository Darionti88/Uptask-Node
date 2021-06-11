// const passport = require('../Config/passport')
const passport = require('passport')
const crypto = require('crypto')
const Usuarios = require('../Models/Usuarios');
const { Op } = require("sequelize");
const bcrypt = require('bcrypt-nodejs')
const enviarEmail = require('../Handlers/email')

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos Campos son obligatorios'
})

//Funcion para revisar si está logueado

exports.usuarioAutenticado = (req, res, next)=>{
    //Si autenticado..adelante
    if(req.isAuthenticated()){
        return next()
    }
    //sino a
    return res.redirect('/iniciar-sesion')
}

exports.cerrarSesion = (req, res)=>{
    req.session.destroy(()=>{
        res.redirect('/iniciar-sesion')
    })
}

//genera token si user valido
exports.enviarToken = async (req, res)=>{

    const {email} = req.body
    const usuario = await Usuarios.findOne({where: {email}})

    //si no existe

    if(!usuario){
        req.flash('error', 'No existe la cuenta')
        res.redirect('/reestablecer')    
    }
    //usiuario existe
    usuario.token = crypto.randomBytes(20).toString('hex')
    usuario.expiracion = Date.now() + 3600000

    //guardarlo en la DB
    await usuario.save()

    //url Reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`

     //envio el correo con el token
    await enviarEmail.enviar({
            usuario,
            subject: 'Password Reset',
            resetUrl,
            archivo: 'reestablecer-pass',
        }).catch(err =>{
            console.log(err, 'soy el error')
        })

        req.flash('correcto', 'Se envió un mensaje a tu correo');
        res.redirect('/iniciar-sesion');
}

exports.validarToken = async (req, res)=>{
    const usuario = Usuarios.findOne({where: {
        token: req.params.token
    }})

    // si no encuentra user
    if(!usuario){
        req.flash('error', 'No válido')
        res.redirect('/reestablecer')
    }

    //form para generar formulario
    res.render('resetPassword', {
        nombrePagina: 'Reestablece tu Contraseña'
    })
}

exports.actualizarPassword = async (req, res)=>{
    

    //verifican token valido y fecha de exp
    const usuario = await Usuarios.findOne({where: {
        token: req.params.token,
        expiracion: {
            [Op.gte]: Date.now()
        }
    }
})
if (!usuario){
    req.flash('error', 'Token no válido')
    res.redirect('/reestablecer')
}
 //hash pass
    usuario.password =  bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    usuario.token = null
    usuario.expiracion = null

    //guardamos pass
    await usuario.save()

    req.flash('correcto', 'Tu password fue creado correctamente')
    res.redirect('/iniciar-sesion')
}