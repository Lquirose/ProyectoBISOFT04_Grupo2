function verificarSesion(req, res, next) {
  if (req.session && req.session.usuario) {
    next(); // hay sesión activa
  } else {
    res.redirect('/'); // redirige al login
  }
}

module.exports = verificarSesion;