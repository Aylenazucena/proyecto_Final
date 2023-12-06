import * as Yup from 'yup';
import log from '../../config/winston';
 
const bookSchema = Yup.object().shape({
  name: Yup.string().required('Se requiere un titulo del libro'),
  autor: Yup.string().required('Se requiere un autor'),
  categoria: Yup.string().required('Se requiere una categoria del libro'),
  numerocopias: Yup.number().required('Se requiere un numero de copias'), // Cambiado a tipo número
  description: Yup.string()
    .max(500, 'No escribir mas de 500 caracteres')
    .required('Se requiere una descripción del libro'),
  isbn: Yup.string()
    .max(13, 'No escribir mas de 13 caracteres')
    .required('Se requiere un isbn del libro'),
});
 
const getbook = (req) => {
  const { name, autor, categoria, isbn, numerocopias, description } = req.body; // Se agregan todas las variables
  log.info(
    `Se extraen datos de la petición: name ${name}, autor ${autor}, categoria ${categoria}, isbn ${isbn}, numero_copias ${numerocopias}, description: ${description}`,
  );
  return {
    name,
    autor,
    categoria,
    isbn,
    numerocopias,
    description,
  };
}; 
export default {
  bookSchema,
  getbook,
};
