// Importando el Router de Express
import { Router } from 'express';

// Importando el controlador
import libroController from './libro.controller';

// Importando factory de validación
import ValidateFactory from '../../services/validateFactory';
// Importando el validador de proyectos
import libroValidator from './libro.validator';

// Creando una isntancia del enrutador
const router = new Router();

// Enrutamos
// GET "/book"
router.get(['/', '/dashboard'], libroController.showDashboard);

// GET "/book/add"
router.get(['/add', '/add-form'], libroController.add);

// POST "/book/add"
router.post(
  '/add',
  ValidateFactory({
    schema: libroValidator.libroSchema,
    getObject: libroValidator.getlibro,
  }),
  libroController.addPost,
);

// GET "/project/edit/:id"
router.get('/edit/:id', libroController.edit);

// PUT "/book/edit/:id"
router.put(
  '/edit/:id',
  ValidateFactory({
    schema: libroValidator.libroSchema,
    getObject: libroValidator.getlibro,
  }),
  libroController.editPut,
);

// DELETE "/book/:id"
router.delete('/:id', libroController.deletelibro);

// Exporto este tramo de ruta
export default router;
