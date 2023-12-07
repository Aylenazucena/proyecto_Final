// Importando el Router de Express
import { Router } from 'express';

// Importando el controlador
import userController from './usario.controller';

// Importando el validaacion usuario
import userValidator from './user.validator';

// Importando el factory de validación
import ValidateFactory from '../../services/validateFactory';

// Creando una instancia del enrutador
const router = new Router();

// Enrutamos
// GET '/user/Dashboard
router.get(['/', '/dashboard'], userController.dashboard);
// GET '/user/login
router.get('/login', userController.login);

// GET '/user/logout
router.get('/logout', userController.logout);

// GET '/user/register
router.get('/register', userController.register);

// POST '/user/register'
router.post(
  '/register',
  ValidateFactory(userValidator.signUp),
  userController.registerPost,
);
// GET "/project/edit/:id"
router.get('/edit/:id', userController.edit);

// PUT "/user/edit/:id"
router.put(
  '/edit/:id',
  ValidateFactory({
    schema: userValidator.signUp.schema,
    getObject: userValidator.signUp.getObject,
  }),
  userController.editPut,
);

// DELETE "/user/:id"
router.delete('/:id', userController.deleteUser);
// Exporto este tramo de ruta
export default router;
