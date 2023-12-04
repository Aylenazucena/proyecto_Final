import { engine as exphbs } from 'express-handlebars';
import path from 'path';

// Funcion de configuración
export default (app) => {
  // Se registra el motor de plantillas
  app.engine(
    'hbs',
    exphbs({
      // Se define extensión de la plantilla
      extname: '.hbs',
      // Se fefine el nombre del layput por defecto
      defaultLayout: 'main',
    }),
  );
  console.log(__dirname);

  // Se selecciona le motor de plantilla
  app.set('view engine', 'hbs');
  // Se establece la ruta de las vistas
  app.set('views', path.join(__dirname, '..', 'views'));

  // Se retorna la instancia de la app
  return app;
};
