const mongoose = require('mongoose');

const emprendimientoSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  businessDescription: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  businessTelephone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  businessLocation: {
    type: String,
    required: true,
    trim: true
  },
  loginDate: {
    type: Date,
    required: true
  },
  imagePath: {
    type: String,
    default: '/img/default.png',
    required: true
  },
  aprobado: {
    type: Boolean,
    default: false
  },
  usuario: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
}

}, {
  timestamps: true
});

module.exports = mongoose.model('Business', emprendimientoSchema);