const {Sequelize , DataTypes } = require('sequelize')
const slug = require('slug')
const shortid = require('shortid')

const db = require('../Config/db')

const Proyectos = db.define('proyectos', {
    id: {
        type: DataTypes.INTEGER ,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nombre: DataTypes.STRING(100),
    url: {
        type: DataTypes.STRING(100),
        // allowNull: false
    }
}, {
    hooks: {
        beforeCreate(proyecto, ){
            const url = slug(proyecto.nombre.toLowerCase())

            proyecto.url = `${url}-${shortid.generate()}`

        }
    }
})

module.exports = Proyectos