// Importando el Router de Express
import { Router } from 'express';

// Importando el controlador
import userController from './libro.controller';

// Creando una instancia del enrutador
const router = new Router();

// Enrutamos
// GET '/project/projects
router.get('/', userController.dashboard);

// GET '/project/dashboard
router.get('/dashboard', userController.dashboard);

// GET '/project/add-form
router.get('/add-form', userController.addform);

// GET '/project/add
router.get('/add', userController.add);

// Exporto este tramo de ruta
export default router;
