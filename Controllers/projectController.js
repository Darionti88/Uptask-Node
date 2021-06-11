const Proyectos = require('../Models/Proyectos')
const Tareas = require('../Models/Tareas')
const slug = require('slug')

exports.proyectosHome = async (req, res)=>{
    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyectos.findAll({where:{usuarioId}})
    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos
    } )
}

exports.formularioProyecto = async (req, res)=>{
    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyectos.findAll({where:{usuarioId}})
    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    })
}

exports.nuevoProyecto = async (req, res)=>{
    const usuarioId = res.locals.usuario.id
    const proyectos = await Proyectos.findAll({where:{usuarioId}})
    //validar
    const nombre = req.body.nombre

    let errores = []

    if(!nombre){
        errores.push({'texto': 'Agrega un Nombre al Proyecto'})
    }
    //si hay errores
    if(errores.length > 0){
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo proyecto',
            errores,
            proyectos
        })
    } else {
        const usuarioId = res.locals.usuario.id
        await Proyectos.create({nombre,
        usuarioId})
        res.redirect('/')

    }
}

exports.proyectoPorUrl = async (req, res)=>{
    const usuarioId = res.locals.usuario.id
    const proyectosPromise = Proyectos.findAll({where:{usuarioId}})
    const proyectoPromise = Proyectos.findOne({
        where:{
            url: req.params.url,
            usuarioId
        }
    })
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise])
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        }
    })

    if(!proyecto) return next()

    //render a la vista
    res.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyectos,
        proyecto,
        tareas
    })
}

exports.formularioEditar = async (req, res)=>{
    const usuarioId = res.locals.usuario.id
    const proyectosPromise = Proyectos.findAll({where:{usuarioId}})
    const proyectoPromise = Proyectos.findOne({
        where:{
            id: req.params.id,
            usuarioId
        }
    })
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise])

    
    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    })
}

exports.actualizarProyecto = async (req, res)=>{
    const proyectos = await Proyectos.findAll()
    //validar
    const nombre = req.body.nombre

    let errores = []

    if(!nombre){
        errores.push({'texto': 'Agrega un Nombre al Proyecto'})
    }
    //si hay errores
    if(errores.length > 0){
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo proyecto',
            errores,
            proyectos
        })
    } else {
        
        //update en la DB
        await Proyectos.update(
            {nombre: nombre},
            { where:{
                id: req.params.id
            }})
        res.redirect('/')

    }
}

exports.eliminarProyecto = async (req, res, next)=> {
    const {urlProyecto} = req.query

    const resultado = await Proyectos.destroy({where:{
        url: urlProyecto
    }})

    if(!resultado){
        return next()
    }
    res.status(200).send('Proyecto Eliminado Correctamente')
}