// Importando el DotEnv
import dotenv from 'dotenv';

// Invocacion ala funcion config de
// la instancia dotenv
dotenv.config();

console.log(process.env.PORT);

// Creando objetos de configuracion
const defaultConfig = {
  PORT: process.env.PORT || 3000,
  IP: process.env.IP || '0.0.0.0',
};

const devConfig = {
  CONFIG_VALUE: 100,
};

const testConfig = {
  TEST_VALUE: 200,
};

const prodConfig = {
  PROD_VALUE: 300,
};

// Creando una funcion selectora
function getenvConfig(env) {
  switch (env) {
    case 'production':
      return prodConfig;

    case 'development':
      return devConfig;

    case 'test':
      return testConfig;

    default:
      return devConfig;
  }
}
// Exportando el objeto de configuracion
export default {
  ...defaultConfig,
  ...getenvConfig(process.env.NODE_ENV),
};
