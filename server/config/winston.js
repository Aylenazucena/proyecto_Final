// Importando el core de winston
// y la función format de winston
import winston, { format } from 'winston';
import path from 'path';

// Se desestructuran funciones para realizar la
// composición del formato
const { combine, timestamp, label, printf, colorize } = format;

// Creando variable del directorio raiz
// eslint-disable-next-line
global['__rootdir'] = path.resolve(process.cwd());

// Se define un esquema de colores
// segun el grado de severidad
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// Agregando el esquema de colores a Winston
winston.addColors(colors);

// ==== Se crean las plantillas para los formatos ====

// Formato para la consola
const myConsoleFormat = combine(
  // Agregando colores la formato
  colorize({ all: true }),
  // Agregando una etiqueta al log
  label({ label: '📣' }),
  // Agregando Fecha
  timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
  // Función de impreson
  printf(
    (info) =>
      `${info.level}: ${info.label}: ${info.timestamp}: ${info.message}`,
  ),
);

// Formato para los archivos
const myFileFormat = combine(
  // Quitando todo tipo de colorizacion
  format.uncolorize(),
  // Agregando fecha
  timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
  // Estableciendo la salida en formato Json
  format.json(),
);

// Creando el objeto de opciones para cada transporte
const options = {
  infoFile: {
    level: 'info',
    filename: `${__rootdir}/server/logs/info.log`,
    handleExceptions: false,
    maxSize: 5242880, // 5MB
    maxFiles: 5,
    format: myFileFormat,
  },
  warnFile: {
    level: 'info',
    filename: `${__rootdir}/server/logs/warn.log`,
    handleExceptions: false,
    maxSize: 5242880, // 5MB
    maxFiles: 5,
    format: myFileFormat,
  },
  errorFile: {
    level: 'error',
    filename: `${__rootdir}/server/logs/error.log`,
    handleExceptions: false,
    maxSize: 5242880, // 5MB
    maxFiles: 5,
    format: myFileFormat,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    format: myConsoleFormat,
  },
};

// Se crea instancia de logger
const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.infoFile),
    new winston.transports.File(options.warnFile),
    new winston.transports.File(options.errorFile),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false, // No finaliza en excepciones no manejadas
});

/*
Por defecto Morgan envía la salida exclusivamente a la consola, algo asi:
 Morgan --->[logs]---> consola
Lo que haremos a continuación sera definir una función llamada "write" que será parte de un objeto que se asignará a la propiedad stream del logger, esta función será capaz de recibir la salida que genera Morgan "message" y redirigirla a winston como informativa
Usaremos el nivel informativo para que tanto el transportador archivo como el de consola tomen el 
Morgan --->[logs]---> Winston ---> [Logs a transportes informativos]
*/

// Estableciendo un flujo de entrada que servira
// para interceptar el log de morgan
logger.stream = {
  write(message) {
    logger.info(message);
  },
};

// Por ultimo exportamos el logger
export default logger;
