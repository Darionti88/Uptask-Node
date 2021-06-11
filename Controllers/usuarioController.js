const Usuarios = require('../Models/Usuarios')
const enviarEmail = require('../Handlers/email')


exports.formCrearCuenta = (req, res)=>{
    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta'
    })
}

exports.formIniciarSesion = (req, res)=>{
    const {error} = res.locals.mensajes
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesion en Uo',
        error
    })
}

exports.crearCuenta = async (req, res)=>{
    //leer los datos
    const {email, password} = req.body

    try{
        await Usuarios.create({
            email,
            password
        })

        //crear URL de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`

        //crear Objeto de usuario
        const usuario ={
            email
        }

        //enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirmar Cuenta de Uptask',
            confirmarUrl,
            archivo: 'confirmar-cuenta',
        }).catch(err =>{
            console.log(err, 'soy el error')
        })
        //redirigir al usuario
        req.flash('correcto', 'Enviamos un email, confirma tu cuenta');
        res.redirect('/iniciar-sesion');

    } catch(error){
        console.log(error)
        req.flash('error', error.errors.map(error => error.message))
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina:'Crear Cuenta',
            email,
            password
        })
    }

    //crear usuario
}

exports.formReestablecerPass = (req, res)=>{
    res.render('reestablecer', {
        nombrePagina:'Reestablecer tu contraseña'
    })
}

//cambia estado de cuenta
exports.confirmarCuenta = async (req, res)=>{
    const usuario = await Usuarios.findOne({where: {
        email: req.params.mail
    }})

    if(!usuario){
        req.flash('error', 'No válido')
        res.redirect('/crear-cuenta')
    }

    usuario.activo = 1
    usuario.save()

    req.flash('correcto', 'Cuenta creada correctamente')
    res.redirect('/iniciar-sesion')
}
