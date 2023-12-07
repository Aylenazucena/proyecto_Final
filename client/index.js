// cargando los estilos
/* eslint-disable no-console */
import './styles/style.css';
// mensaje en consola
/* eslint-disable */
// Importando estilos de Materialize CSS
import 'materialize-css/dist/css/materialize.css';
// Importando scripts de Materialize
import 'materialize-css/dist/js/materialize';
/* eslint-enable */
// Script para borrar book
import deleteBook from './domains/libro.dashboard';
import deleteUser from './domains/user.dashboard';

// Inicializando Scripts de Materialize para la interactividad
M.AutoInit();

// Cargando script en caso de que la URL sea '/libro'
if (window.location.pathname === '/book') {
  window.deleteBook = deleteBook;
}
if (window.location.pathname === '/user') {
  window.deleteUser = deleteUser;
}

console.log('🎉 Estilos cargados correctamente 🎉');
