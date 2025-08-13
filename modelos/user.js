

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    Identification: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    telefono: {
        type: String,
        required: true,
        trim: true
    },
    Fecha: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        enum: ['administrador', 'emprendedor', 'ciudadano'],
        default: 'ciudadano'
    }, 
    imagePath: {
        type: String,
        default: '/img/default.png',
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);