const mongoose = require('mongoose');

const DB_URI = 'mongodb://localhost:27017/ComunidadDB';

const conectarDB = async () => {
    try {
        await mongoose.connect(DB_URI, {});
        console.log("DB CONECTADA");
    } catch (err) {
        console.log("ERROR DE CONEXIÓN:", err);
        // No hacer process.exit(), dejar que el servidor siga corriendo
    }
};

module.exports = conectarDB;