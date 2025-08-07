//Referencia a conexion.js
const conectarDB = require('../modelos/conexion.js'); // Importar la conexión

// Llamar la función de conexión
conectarDB();

// Aquí ya puedes usar mongoose
const mongoose = require('mongoose');
//Esquema
let transportSchema = mongoose.Schema({
    routeName: {type:String, required:true},
    transportTime: {type:String, required:true},
    transportDestination: {type:String,required:true},
    transportFrecuency: {type:Number, required: true},
    transportFee: {type:Number, required: true},
    tripDuration: {type:String, required: true}
    },{versionKey:false}) 

    //Modelo
    let transportModel = new mongoose.model('transportModel',transportSchema);

    module.exports = transportModel;