// Importando Passport
import passport from 'passport';

// Importando estrategia
import LocalStrategy from 'passport-local';

// Importando el modelo de usuarios
import User from '../domains/usuario/user.model';

// Logger
import log from '../config/winston';

// Creando objeto de configuraciones
const localOptions = {
  usernameField: 'mail',
};

// Creando la instancia de la estrategia local
const localStrategy = new LocalStrategy(
  localOptions,
  async (mail, password, done) => {
    try {
      // Buscando al usuario en la base de datos
      const user = await User.findOne({ mail });
      // En caso de no encontrar al usuario se regresa falso
      if (!user) {
        log.info('Usuario no registrado');
        return done(null, false, { message: 'Usuario no registrado' });
      }
      // En caso de que no este confirmado el usuario
      // falla la autenticación, un usuario no confirmado
      // es aquel cuya propiedad emailConfirmationAt es nula
      if (!user.emailConfirmationAt) {
        log.info('Usuario no confirmado');
        return done(
          null, // error
          false, // user
          {
            message:
              'Cuenta inactiva, favor de activarla haciendo clic en el enlace previamente enviado a su correo.',
          },
        );
      }
      // En caso de no proveer el password correcto se regresa falso
      // Para ello se usa un método que sera definido en el modelo
      // llamado authenticateUser
      if (!user.authenticateUser(password)) {
        log.info('Password incorrecto');
        return done(null, false, { message: 'Password o usuario incorrecto' });
      }
      // En caso de pasar las anteriores pruebas
      // se regresa error nulo y como segundo
      // argumento el usuario
      return done(null, user);
    } catch (error) {
      log.error(`🚨 ${error.message}`);
      return done(error, false);
    }
  },
);

// Esto genera y mantiene las cookies
passport.serializeUser((user, done) => {
  log.info('Serializando usuario');
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    log.info('Deserializando usuario');
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    log.error(`🚨 ${error.message}`);
    done(error, null);
  }
});

// se registra la estrategia
passport.use(localStrategy);

// se exporta el middleware
// como primer argumento es el nombre de la estragia
// el segundo argumento son las opciones
export const authLocal = passport.authenticate('local', {
  // Redireccionamiento en caso de exito
  successRedirect: '/book/dashboard?message=loginSuccess',
  // Redireccionamiento en caso de fallo
  failureRedirect: '/user/login?message=loginfailed',
  // Permite el uso de mensajes flash
  // si falla la autenticacion
  failureFlash: true,
});

// TODO: Falta por terminar

export const authJwT = {};
