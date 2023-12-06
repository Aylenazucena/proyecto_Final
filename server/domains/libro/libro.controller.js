// Importing winston logger
import log from '../../config/winston';

// Importando el modelo
import libroModel from './libro.models';

// Action Methods

// GET '/libro/addForm'
// GET '/libro/add'
const addForm = (req, res) => {
  res.render('libro/addView');
};

// GET "/libro"
// GET "/libro"
const showDashboard = async (req, res) => {
  // Consultado todos los proyectos
  const libro = await libroModel.find({}).lean().exec();
  // Enviando los proyectos al cliente en JSON
  log.info('Se entrega dashboard de libros');
  res.render('libro/dashboardViews', { libro });
};

// GET "/project/add"
const add = (req, res) => {
  res.render('libro/addLibro');
};

// POST "/project/add"
const addPost = async (req, res) => {
  // Rescatando la info del formulario
  const { errorData: validationError } = req;
  // En caso de haber error
  // se le informa al cliente
  if (validationError) {
    log.info('Se entrega al cliente error de validación de addlibro');
    // Se desestructuran los datos de validación
    const { value: libro } = validationError;
    // Se extraen los campos que fallaron en la validación
    const errorModel = validationError.inner.reduce((prev, curr) => {
      // Creando una variable temporal para
      // evitar el error "no-param-reassing"
      const workingPrev = prev;
      workingPrev[`${curr.path}`] = curr.message;
      return workingPrev;
    }, {});
    return res.status(422).render('libro/addLibro', { libro, errorModel });
  }
  // En caso de que pase la validación
  // Se desestructura la información
  // de la peticion
  const { validData: libro } = req;
  try {
    // Creando la instancia de un documento
    // con los valores de 'project'
    const savedlibro = await libroModel.create(libro);
    // Se informa a cliente que se guardo el proyecto
    log.info(`Se carga libro ${savedlibro}`);
    // Se registra en el log el redireccionamiento
    log.info('Se redirecciona el sistema a /libro');
    // Agregando mensaje flash
    req.flash('successMessage', 'Libro agregado con exito');
    // Se redirecciona el sistema a la ruta '/book'
    return res.redirect('/libro');
  } catch (error) {
    log.error(
      'ln 53 book.controller: Error al guardar el libro en la base de datos',
    );
    return res.status(500).json(error);
  }
};

// GET "/libro/edit/:id"
const edit = async (req, res) => {
  // Extrayendo el id por medio de los parametros de url
  const { id } = req.params;
  // Buscando en la base de datos
  try {
    log.info(`Se inicia la busqueda del libro con el id: ${id}`);
    const libro = await libroModel.findOne({ _id: id }).lean().exec();
    if (libro === null) {
      log.info(`No se encontro el libro con el id: ${id}`);
      return res
        .status(404)
        .json({ fail: `No se encontro el libro con el id: ${id}` });
    }
    // Se manda a renderizar la vista de edición
    // res.render('book/editView', book);
    log.info(`libro encontrado con el id: ${id}`);
    return res.render('libro/editView', { libro });
  } catch (error) {
    log.error('Ocurre un error en: metodo "error" de libro.controller');
    return res.status(500).json(error);
  }
};

// PUT "/book/edit/:id"
const editPut = async (req, res) => {
  const { id } = req.params;
  // Rescatando la info del formulario
  const { errorData: validationError } = req;
  // En caso de haber error
  // se le informa al cliente
  if (validationError) {
    log.info(`Error de validación del libro con id: ${id}`);
    // Se desestructuran los datos de validación
    const { value: libro } = validationError;
    // Se extraen los campos que fallaron en la validación
    const errorModel = validationError.inner.reduce((prev, curr) => {
      // Creando una variable temporal para
      // evitar el error "no-param-reassing"
      const workingPrev = prev;
      workingPrev[`${curr.path}`] = curr.message;
      return workingPrev;
    }, {});
    return res.status(422).render('libro/editView', { libro, errorModel });
  }
  // Si no hay error
  const libro = await libroModel.findOne({ _id: id });
  if (libro === null) {
    log.info(`No se encontro el libro para actualizar con id: ${id}`);
    return res
      .status(404)
      .send(`No se encontro el libro para actualizar con id: ${id}`);
  }
  // En caso de encontrarse el documento se actualizan los datos
  const { validData: newlibro } = req;
  libro.nombre = newlibro.nombre;
  libro.description = newlibro.description;
  try {
    // Se salvan los cambios
    log.info(`Actualizando libro con id: ${id}`);
    await libro.save();
    return res.redirect(`/libro/edit/${id}`);
  } catch (error) {
    log.error(`Error al actualizar proyecto con id: ${id}`);
    return res.status(500).json(error);
  }
};

const deletelibro = async (req, res) => {
  const { id } = req.params;
  // Usando el modelo para borrar el proyecto
  try {
    const result = await libroModel.findByIdAndRemove(id);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json(error);
  }
};
// Controlador user
export default {
  // Action Methods
  showDashboard,
  add,
  addPost,
  edit,
  editPut,
  addForm,
  deletelibro,
};
