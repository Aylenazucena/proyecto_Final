// importando mongoose
import mongoose from 'mongoose';
// Desestructurando la funcion Schema Special
const { Schema } = mongoose;
 
// Construir un Schema
const bookSchema = new Schema({
  // titulo
  name: {
    type: String,
    // siempre se ocupa que no quieras un espacio vacio
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  autor: {
    type: String,
    // siempre se ocupa que no quieras un espacio vacio
    required: true,
  },
  categoria: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    // siempre se ocupa que no quieras un espacio vacio
    required: true,
  },
  numerocopias: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
 
// Compilando el esquema para
// generar un modelo
export default mongoose.model('book', bookSchema);