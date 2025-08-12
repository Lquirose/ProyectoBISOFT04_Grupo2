const mongoose = require('mongoose');

const publicacionSchema = new mongoose.Schema({
  reportTitle: { type: String, required: true },
  reportDescription: { type: String, required: true },
  category: { type: String, required: true },
  communityLocation: { type: String, required: true },
  loginDate: { type: Date, required: true },
  imagePath: { type: String }, // ruta del archivo subido
  aprobado: { type: Boolean, default: false }, // pendiente de aprobación
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required : true } // si querés vincular al usuario
}, {
  timestamps: true
});

module.exports = mongoose.model('Publicacion', publicacionSchema);
