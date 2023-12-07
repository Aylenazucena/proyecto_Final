// importando logger
import log from '../config/winston';

const AuthorizarionMiddleware = (role) => (req, res, next) => {
  // si el usuario no está autenticado
  if (!req.isAuthenticated()) {
    log.info('Requiere acceder con su cuenta');
    req.flash('infoMessage', 'Requiere acceder con su cuenta');
    res.redirect('/user/login');
  }

  // si el usuario no está autenticadotiene el rol deseado
  if (!req.user.role === role) {
    log.info('No tienes permisos para acceder a este recurso');
    req.flash('errorMessage', 'No tienes permisos para acceder a este recurso');
    res.redirect('/');
  }
  // si el usuario cunmple con las caracteristicas anteriores
  return next();
};

export default AuthorizarionMiddleware;
