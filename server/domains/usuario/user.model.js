import mongoose from 'mongoose';
import validator from 'validator';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import uniqueValidator from 'mongoose-unique-validator';

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastname: { type: String, required: true },
    grade: { type: String, required: true },
    section: { type: String, required: true },
    mail: {
      type: String,
      unique: true,
      required: [true, 'Es necesario ingresar email'],
      validate: {
        validator: (mail) => validator.isEmail(mail),
        message: '{VALUE} no es un email válido',
      },
    },
    password: {
      type: String,
      required: [true, 'Es necesario ingresar password'],
      trim: true,
      minLength: [6, 'El password debe tener al menos 6 caracteres'],
      // Resto de la validación...
    },
    code: {
      type: String,
      required: [true, 'Es necesario ingresar un código de estudiante'],
      trim: true,
      minLength: [
        9,
        'El código de estudiante debe tener al menos 9 caracteres',
      ],
      // Resto de la validación...
    },
    emailConfirmationToken: String,
    emailConfirmationAt: Date,
  },
  { timestamps: true },
);

UserSchema.plugin(uniqueValidator);

UserSchema.methods = {
  hashPassword() {
    return bcrypt.hashSync(this.password, 10);
  },
  generateConfirmationToken() {
    return crypto.randomBytes(64).toString('hex');
  },
  toJSON() {
    return {
      id: this._id,
      firstName: this.firstName,
      lastname: this.lastName,
      grade: this.grade,
      code: this.code,
      section: this.section,
      mail: this.mail,
      password: this.password,
      emailConfirmationToken: this.generateConfirmationToken(),
      emailConfirmationAt: this.emailConfirmationAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  },
};

UserSchema.pre('save', function presave(next) {
  if (this.isModified('password')) {
    this.password = this.hashPassword();
  }
  return next();
});

export default mongoose.model('User', UserSchema);
