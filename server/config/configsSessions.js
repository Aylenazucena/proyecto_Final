// se importa manejo de sesiones con express
import ExpressSession from 'express-session';
// importando mensajes flash
import ConnectFlash from 'connect-flash';
// soporte de almacenamiento
import MongoStore from 'connect-mongo';
// importando la URL de la base de datos de sistema
import configKeys from './configKeys';

// Se crea objeto de opciones para el manejo de sesiones
const options = {
  secret: 'awesome',
  resave: true,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: configKeys.MONGO_URL,
    ttl: 1 * 24 * 60 * 60, // se guardaran por 24 hrs
  }),
};

// Exportando funcion que registra
export default (app) => {
  // Creando el middleware
  const sessionsMiddleware = ExpressSession(options);
  // Se registra middleware en app
  app.use(sessionsMiddleware);
  // Se registra middlware de mensajes flash
  app.use(ConnectFlash());
  // se crea middleware para rescatar mensajes de sesiones
  app.use((req, res, next) => {
    res.locals.successMessage = req.flash('successMessage');
    res.locals.infoMessage = req.flash('infoMessage');
    res.locals.errorMessage = req.flash('errorMessage');
    res.locals.passportError = req.flash('passportError');
    next();
  });
  return app;
};
