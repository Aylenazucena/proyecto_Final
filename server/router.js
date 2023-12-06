// Importando enrutador home
import homeRouter from './domains/home /home.router';
// Importando enrutador user
import userRouter from './domains/usuario/usario.router';
// Imporntado enrutador project
import libroRouter from './domains/libro/book.router';

// Función que agrega rutas
const addRoutes = (app) => {
  // Agregando el enrutador de home
  app.use('/', homeRouter);
  // Agregado el enrutado de user
  app.use('/user', userRouter);
  // Agregado el enrutado de project
  app.use('/book', libroRouter);
  return app;
};

// Exportando objeto
export default { addRoutes };
