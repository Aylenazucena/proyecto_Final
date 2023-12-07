import * as Yup from 'yup';
import log from '../../config/winston';

// Crear schema de validacion
const signUpSchema = Yup.object().shape({
  firstName: Yup.string().required('Se requiere ingresar un nombre'),
  lastname: Yup.string().required('Se requiere ingresa un apellido'),
  mail: Yup.string().email().required('Se requiere ingresar un correo valido'),
  password: Yup.string()
    .min(6)
    .required('Se requiere ingresar un password de al menos 6 caracteres'),
  cpassword: Yup.string().oneOf(
    [Yup.ref('password')],
    'El password de confirmación no coincide',
  ),
  code: Yup.string()
    .max(9, 'No escribir mas de 9 caracteres')
    .required('Se requiere codigo de estudiante'),
  grade: Yup.string().required('Se requiere ingresar un grado'),
  section: Yup.string().required('Se requiere ingresar la seccion'),
});

const sigUpGetter = (req) => {
  const {
    firstName,
    lastname,
    mail,
    password,
    cpassword,
    code,
    grade,
    section,
  } = req.body; // Se agregan todas las variables
  log.info(
    `Se extraen datos de la petición: name ${firstName}, apellido ${lastname}, correo ${mail}, password${password}, cpassword${cpassword}, codigo ${code}, grado: ${grade},seccion ${section}`,
  );
  return {
    firstName,
    lastname,
    mail,
    password,
    cpassword,
    code,
    grade,
    section,
  };
};

// Crear un esquema de validación para token de confirmación
const tokenSchema = Yup.object().shape({
  token: Yup.string().length(64).required(),
});

// Middleware de extracción para token de confirmación
const getToken = (req) => {
  // Desestructuramos la informacion
  const { token } = req.params;
  // Se regresa el objeto signup
  return {
    token,
  };
};

const token = {
  schema: tokenSchema,
  getObject: getToken,
};

const signUp = {
  schema: signUpSchema,
  getObject: sigUpGetter,
};

export default { signUp, token };
