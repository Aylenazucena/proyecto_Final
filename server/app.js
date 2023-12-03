// Cargando dependencias
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan'; // Quita los paréntesis aquí
import webpack from 'webpack';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import WebpackHotMiddleware from 'webpack-hot-middleware';
import debug from './server/debugLogger';

// var debug = require('debug')('dwpcii:server');

import indexRouter from './routes/index'; // Cambia require por import
import usersRouter from './routes/users'; // Cambia require por import

// Setting Webpack Modules
// Importing webpack configuration
import webpackConfig from '../webpack.dev.config';

// Creando la instancia de express
const app = express(); // Usa "const" en lugar de "var"

// Get the execution mode
const nodeEnvironment = process.env.NODE_ENV || 'production'; // Corrige la variable a "nodeEnvironment"

// Deciding if we add webpack middleware or not
if (nodeEnvironment === 'development') {
  // Start Webpack dev server
  debug('🛠️ Ejecutando en modo desarrollo 🛠️');
  // Adding the key "mode" with its value "development"
  webpackConfig.mode = nodeEnvironment; // Corrige la variable a "nodeEnvironment"
  // Setting the dev server port to the same value as the express server
  webpackConfig.devServer.port = process.env.PORT;
  // Setting up the HMR (Hot Module Replacement)
  webpackConfig.entry = [
    'webpack-hot-middleware/client?reload=true&timeout=1000',
    ...webpackConfig.entry, // Corrige la sintaxis de concatenación
  ];
  // Agregar el plugin a la configuración de desarrollo
  // de webpack
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  // Creating the bundler
  const bundle = webpack(webpackConfig);
  // Enabling the webpack middleware
  app.use(
    WebpackDevMiddleware(bundle, {
      publicPath: webpackConfig.output.publicPath,
    }),
  );
  // Enabling the webpack HMR
  app.use(WebpackHotMiddleware(bundle));
} else {
  console.log('🏭 Ejecutando en modo producción 🏭');
}

// Configurando el motor de plantillas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Se establecen los middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Crea un server de archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public')));

// Registro de Middlewares de aplicación
app.use('/', indexRouter);
// Activa "usersRouter" cuando se
// solicita "/users"
app.use('/users', usersRouter);
// app.use('/author', (req, res)=>{
//   res.json({mainDeveloper: "Ivan Rivalcoba"})
// });

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app; // Usa "export default" en lugar de "module.exports"