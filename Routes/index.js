const express = require('express')
const router = express.Router()

//Importo express validator
const {body} = require('express-validator')


//importo controlador
const projectController = require('../Controllers/projectController')
const tareasController = require('../Controllers/tareasController')
const usuarioController = require('../Controllers/usuarioController')
const authController = require('../Controllers/authController')

module.exports = ()=> {
    router.get('/', 
        authController.usuarioAutenticado,
        projectController.proyectosHome
        )

    router.get('/nuevo-proyecto', 
        authController.usuarioAutenticado,
        projectController.formularioProyecto)

    router.post('/nuevo-proyecto/',
    body('nombre').not().isEmpty().trim().escape(),
    authController.usuarioAutenticado,
    projectController.nuevoProyecto
    )
    
    //Listar Proyecto
    router.get('/proyecto/:url', 
        authController.usuarioAutenticado,
        projectController.proyectoPorUrl)

    //Update Project
    router.get('/proyecto/editar/:id', 
    authController.usuarioAutenticado,
    projectController.formularioEditar)

    router.post('/nuevo-proyecto/:id',
    body('nombre').not().isEmpty().trim().escape(),
        authController.usuarioAutenticado,
        projectController.actualizarProyecto
    )

    //Eliminar Proyecto
    router.delete('/proyectos/:url', 
        authController.usuarioAutenticado,
        projectController.eliminarProyecto)

    //Tareas
    router.post('/proyectos/:url', 
        authController.usuarioAutenticado,
        tareasController.agregarTarea )

    //Update Tarea
    router.patch('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea)
    router.delete('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.eliminarTarea)

    //Crear Nueva cuenta
    router.get('/crear-cuenta', usuarioController.formCrearCuenta)
    router.post('/crear-cuenta', usuarioController.crearCuenta)
    router.get('/confirmar/:mail', usuarioController.confirmarCuenta)

    //iniciar sesion
    router.get('/iniciar-sesion', usuarioController.formIniciarSesion)
    router.post('/iniciar-sesion', authController.autenticarUsuario)

    //cerrar sesion
    router.get('/cerrar-sesion', authController.cerrarSesion)

    //restablecer
    router.get('/reestablecer', usuarioController.formReestablecerPass)
    router.post('/reestablecer', authController.enviarToken)
    router.get('/reestablecer/:token', authController.validarToken)
    router.post('/reestablecer/:token', authController.actualizarPassword)

    return router
}