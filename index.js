require('dotenv').config()
const express = require('express')
const routes = require('./routes')
const bodyParser = require('body-parser')
const path = require('path')
// const expressValidator  = require('express-validator')
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('./Config/passport')




//helpers
const helpers = require('./helpers')


//Creo la conexion a la DB
const db = require('./Config/db')

//Importo mi modelo
require('./Models/Proyectos')
require('./Models/Tareas')
require('./Models/Usuarios')


db.sync()
.then(()=> console.log('conectado al server'))
.catch((err)=> console.log(err))


//Creo app de express
const app = express()

//Agrego Express-Validator a toda la App
// app.use(expressValidator())

//Habilitar Body Parser
app.use(bodyParser.urlencoded({extended: true}))


//Donde carga archivos staticos(Css)
app.use(express.static('public'))


//habilito Pug
app.set('view engine', 'pug')


//Habilitar Body Parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

//Añado carpeta de Vistas
app.set('views', path.join(__dirname, '/Views'))

//Agregar flash messages
app.use(flash())

app.use(cookieParser())

//nos permite navegar sin volver a autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

//Para usar vardump helper en la app
app.use((req,res, next)=>{
    res.locals.year = 2021
    res.locals.mensajes = req.flash()
    res.locals.vardump = helpers.vardump
    res.locals.usuario = {...req.user} || null
    next()
})

//Ruta del Home
app.use('/', routes())

const host = process.env.HOST || '0.0.0.0'
app.listen(process.env.PORT || 3000, host, ()=>{
    console.log("Express server working");
    })