const {Sequelize, DataTypes} = require('sequelize')
const db = require('../Config/db')
const Proyectos = require('../Models/Proyectos')
const bcrypt = require('bcrypt-nodejs')


const Usuarios = db.define('usuarios', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email:{
        type: DataTypes.STRING(60),
        allowNull: false,
        validate:{
            isEmail: {
                msg: "Agrega un correo válido"
            },
            notEmpty:{
                msg: 'El Email no puede estar vacio'
            },
        },
        unique:{
            args: true,
            msg: 'Usuario ya registrado'
        }
    },
    password:{
        type: DataTypes.STRING(60),
        allowNull: false,
        validate:{
            notEmpty:{
                msg: 'El password no puede estar vacio'
            }
        }
    },
    token: {
        type: DataTypes.STRING
    },
    expiracion: {
        type: DataTypes.DATE
    },
    activo: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
},{
    hooks: {
        beforeCreate(usuario){
            usuario.password =  bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10))
        }
    }
}
)

//Custom Methods
Usuarios.prototype.verificarPassword = function(password){
    return bcrypt.compareSync(password, this.password)
}

Usuarios.hasMany(Proyectos)

module.exports = Usuarios

