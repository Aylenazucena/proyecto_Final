// importing Logs
import log from '../../config/winston';
// importing modelimport userModel from './user.model';
import userModel from './user.model';
// Action Methods
// GET "/user"
const dashboard = async (req, res) => {
  // Consultado todos los proyectos
  const user = await userModel.find({}).lean().exec();
  // Enviando los proyectos al cliente en JSON
  log.info('Se entrega dashboard de user');
  res.render('usuario/userView', { user });
};
// Get '/user/login'
const login = (req, res) => {
  // Sirve el formulario de login
  log.info('Se entrega el formulario login');
  const errorMessage = req.flash('error');
  console.log(errorMessage);
  if (req.query.message) {
    res.locals.passportError = `  ${errorMessage}`;
  }
  res.render('usuario/login');
};

// Get '/user/logout'
const logout = (req, res) => {
  // Passport incrusta un mensaje en la peticion
  req.logout((err) => {
    if (err) {
      return res.json(err);
    }
    // se crea mensaje flash
    req.flash('successMessage', 'Ha cerrado sesión correctamente');
    // Se redirecciona al login
    return res.redirect('/user/login');
  });
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
    // Se construye el viewModel del usuario
    const viewModel = {
      ...user.toJSON(),
      // Se añade opcion de cambio de color de fondo
      backgroundColor: 'cyan darken-2',
    };
    log.info('Se manda a renderizar la vista "successfulResgistration.hbs"');
    req.flash('successMessage', ' Se ha creado su perfil');
    // 3. Se contesta al cliente
    return res.render('usuario/successfulRegistration', viewModel);
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

// GET "/user/edit/:id"
const edit = async (req, res) => {
  const { id } = req.params; // Obtiene el ID del usuario de los parámetros de la solicitud
  try {
    log.info(`Se inicia la búsqueda del usuario con el id: ${id}`); // Registra un mensaje informativo sobre la búsqueda del usuario
    const user = await userModel.findOne({ _id: id }).lean().exec(); // Busca un usuario en la base de datos por su ID
    if (!user) {
      // Si no se encuentra el usuario
      log.info(`No se encontró el usuario con el id: ${id}`); // Registra un mensaje informativo sobre la no existencia del usuario
      return res
        .status(404)
        .json({ fail: `No se encontró el usuario con el id: ${id}` }); // Envía una respuesta de error al cliente
    }
    log.info(`Usuario encontrado con el id: ${id}`); // Registra un mensaje informativo de que se encontró el usuario
    return res.render('usuario/edituser', { user, title: 'user | Edit' }); // Renderiza la vista de edición del usuario encontrada
  } catch (error) {
    // Manejo de errores
    log.error('Ocurrió un error en el método "edit" de user.controller'); // Registra un mensaje de error en caso de excepción
    return res.status(500).json(error); // Envia una respuesta de error al cliente con detalles del error
  }
};

// PUT "/user/edit/:id"
const editPut = async (req, res) => {
  const { id } = req.params; // Obtiene el ID del usuario de los parámetros de la solicitud
  const { errorData: validationError, validData: newuser } = req; // Obtiene los datos de validación y los datos válidos de la solicitud

  if (validationError) {
    // Si hay errores de validación
    const { value: user } = validationError; // Obtiene los valores con errores de la validación
    const errorModel = validationError.inner.reduce((prev, curr) => {
      const workingPrev = prev;
      workingPrev[`${curr.path}`] = curr.message;
      return workingPrev;
    }, {}); // Crea un modelo de errores para mostrar en la vista de edición

    console.log(errorModel);
    console.log(user);
    return res.status(422).render('user/edituser', { user, errorModel }); // Renderiza la vista de edición con errores de validación
  }

  try {
    const user = await userModel.findOneAndUpdate(
      { _id: id },
      { $set: newuser }, // Actualiza los datos del usuario con los nuevos datos válidos
      { new: true }, // Devuelve el nuevo documento actualizado
    );

    if (!user) {
      // Si no se encuentra el usuario
      log.info(`No se encontró el usuario para actualizar con id: ${id}`); // Registra un mensaje informativo sobre la no existencia del usuario
      return res
        .status(404)
        .send(`No se encontró el usuario para actualizar con id: ${id}`); // Envía una respuesta de error al cliente
    }

    req.flash('successMessage', 'Usuario editado con éxito'); // Agrega un mensaje de éxito a través de flash para mostrar al usuario
    return res.redirect(`/user/edit/${id}`); // Redirige a la vista de edición del usuario
  } catch (error) {
    // Manejo de errores
    log.error(`Error al actualizar usuario con id: ${id}`); // Registra un mensaje de error en caso de excepción
    return res.status(500).json(error); // Envia una respuesta de error al cliente con detalles del error
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  // Usando el modelo para borrar el proyecto
  try {
    const result = await userModel.findByIdAndRemove(id);
    // Agregando mensaje flash
    req.flash('successMessage', ' usuario borrado con exito');
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
};

// GET user/confirm/<token>
const confirm = async (req, res) => {
  // Extrayendo datos de validación
  const { validData, errorData } = req;
  if (errorData) return res.json(errorData);
  const { token } = validData;
  // Buscando si existe un usuario con ese token
  const user = await userModel.findByToken(token);
  if (!user) {
    return res.send('USER WITH TOKEN NOT FOUND');
  }
  // Activate user
  await user.activate();
  return res.send(`Usuario: ${user.firstName} Validado`);
};

export default {
  dashboard,
  login,
  logout,
  register,
  registerPost,
  edit,
  editPut,
  deleteUser,
  confirm,
};
