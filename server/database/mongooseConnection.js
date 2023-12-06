import mongoose from 'mongoose';
import log from '../config/winston';

// Creando la funcion de la conexion
export default async function connectWithRetry(mongoUrl) {
  try {
    mongoose.connect(mongoUrl);
    log.info('✔ Conectado a MongoDB');
  } catch (error) {
    log.error(`💔 No se logro la conexion a la db💔:${error.mesage}`);
    log.error('Intentando la conexion en 20 segundos');
    setTimeout(() => connectWithRetry(mongoUrl), 20000);
  }
}
