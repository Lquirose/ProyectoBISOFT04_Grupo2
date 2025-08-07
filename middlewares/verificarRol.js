function verificarRol(...rolesPermitidos) {
  return function (req, res, next) {
    if (
      req.session.usuario &&
      rolesPermitidos.includes(req.session.usuario.rol)
    ) {
      next();
    } else {
      res.redirect('/');
    }
  };
}


module.exports = verificarRol;
