import * as Yup from 'yup';
import log from '../../config/winston';

const libroSchema = Yup.object().shape({
  nombre: Yup.string().required('Se requiere un titulo del libro'),
  autor: Yup.string().required('Se requiere un autor'),
  categoria: Yup.string().required('Se requiere una categoria del libro'),
  copias: Yup.number().required('Se requiere un numero de copias'), // Cambiado a tipo número
  descripcion: Yup.string()
    .max(500, 'No escribir mas de 500 caracteres')
    .required('Se requiere una descripción del libro'),
  isbn: Yup.string()
    .max(13, 'No escribir mas de 13 caracteres')
    .required('Se requiere un isbn del libro'),
});

const getlibro = (req) => {
  const { nombre, autor, categoria, isbn, copias, descripcion } = req.body; // Se agregan todas las variables
  log.info(
    `Se extraen datos de la petición: name ${nombre}, autor ${autor}, categoria ${categoria}, isbn ${isbn}, numerocopias ${copias}, description: ${descripcion}`,
  );
  return {
    nombre,
    autor,
    categoria,
    isbn,
    copias,
    descripcion,
  };
};

export default {
  libroSchema,
  getlibro,
};
