// Importando enrutador home
import homeRouter from './domains/home /home.router';
// Importando enrutador user
import userRouter from './domains/usuario/usario.router';
// Imporntado enrutador project
import projectRouter from './domains/libro/libro.router';

// Función que agrega rutas
const addRoutes = (app) => {
  // Agregando el enrutador de home
  app.use('/', homeRouter);
  // Agregado el enrutado de user
  app.use('/user', userRouter);
  // Agregado el enrutado de project
  app.use('/project', projectRouter);
  return app;
};

// Exportando objeto
export default { addRoutes };
