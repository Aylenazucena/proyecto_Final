// importing Logs
import log from '../../config/winston';
// importing modelimport userModel from './user.model';
import userModel from './user.model';
// Action Methods
// GET "/user"
const showDashboard = async (req, res) => {
  // Consultado todos los proyectos
  const user = await userModel.find({}).lean().exec();
  // Enviando los proyectos al cliente en JSON
  log.info('Se entrega dashboard de user');
  res.render('usuario/userViews', { user });
};
// Get '/user/login'
const login = (req, res) => {
  // Sirve el formulario de login
  log.info('Se entrega el formulario login');
  res.render('usuario/login');
};

// Get '/user/logout'
const logout = (req, res) => {
  res.send("🚧 UNDER CONSTRUCTION GET '/user/logout'🚧");
};

// Get '/user/register'
const register = (req, res) => {
  log.info('Se entrega formulario de registro');
  res.render('usuario/register');
};

// POST '/user/register'
const registerPost = async (req, res) => {
  const { validData: userFormData, errorData } = req;
  log.info('Se procesa formulario de registro');
  // Verificando si hay errores
  if (errorData) {
    return res.json(errorData);
  }
  // En caso de no haber errores, se crea al usuario
  try {
    // 1. Se crea una instancia del modelo User
    // mediante la función create del modelo
    const user = await userModel.create(userFormData);
    log.info(`Usuario creado: ${JSON.stringify(user)}`);
    req.flash('successMessage', ' Se ha creado su perfil');
    // 3. Se contesta al cliente con el usuario creado
    return res.status(200).json(user.toJSON());
  } catch (error) {
    log.error(error);
    req.flash('errorMessage', 'algo ha fallado');
    return res.json({
      message: error.message,
      name: error.name,
      errors: error.errors,
    });
  }
};

export default {
  showDashboard,
  login,
  logout,
  register,
  registerPost,
};
