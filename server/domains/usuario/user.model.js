import mongoose from 'mongoose';
import validator from 'validator';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import uniqueValidator from 'mongoose-unique-validator';

import log from '../../config/winston';
import configKeys from '../../config/configKeys';
import MailSender from '../../services/mailSender';

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true, lowercase: true },
    lastname: { type: String, required: true, lowercase: true },
    grade: { type: String, required: true, lowercase: true },
    section: { type: String, required: true, lowercase: true },
    mail: {
      type: String,
      unique: true,
      lowercase: true,
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
      lowercase: true,
      trim: true,
      minLength: [
        9,
        'El código de estudiante debe tener al menos 9 caracteres',
      ],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      message: '{VALUE} no es un rol valido',
      default: 'user',
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
    return crypto.randomBytes(32).toString('hex');
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
      role: this.role,
      password: this.password,
      emailConfirmationToken: this.generateConfirmationToken(),
      emailConfirmationAt: this.emailConfirmationAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  },
  // Metodo para activar el usuario
  async activate() {
    await this.updateOne({
      emailConfirmationToken: null,
      // updatedAt: new Date(),
      emailConfirmationAt: new Date(),
    }).exec();
  },
  // Verifica el password
  authenticateUser(password) {
    return bcrypt.compareSync(password, this.password);
  },
};

UserSchema.pre('save', function presave(next) {
  if (this.isModified('password')) {
    this.password = this.hashPassword();
  }
  // Se crea el token de confirmacion
  this.emailConfirmationToken = this.generateConfirmationToken();
  return next();
});

UserSchema.post('save', async function sendConfirmationMail() {
  // Creating Mail options
  const options = {
    host: configKeys.SMTP_HOST,
    port: configKeys.SMTP_PORT,
    secure: false,
    auth: {
      user: configKeys.MAIL_USERNAME,
      pass: configKeys.MAIL_PASSWORD,
    },
  };

  const mailSender = new MailSender(options);

  // Configuring mail data
  mailSender.mail = {
    from: 'bere.sr@gamadero.tecnm.mx',
    to: this.mail,
    subject: 'Account confirmation',
  };

  try {
    const info = await mailSender.sendMail(
      'confirmation',
      {
        user: this.firstName,
        lastname: this.lastname,
        mail: this.mail,
        token: this.emailConfirmationToken,
        host: configKeys.APP_URL,
      },
      `
      Estimado ${this.firstName} ${this.lastname}  
      hemos enviado un correo de confirmación a ${this.mail}  
      favor de hacer clic en enlace de dicho correo`,
    );

    if (!info) return log.info('😭 No se pudo enviar el correo');
    log.info('🎉 Correo enviado con exito');
    return info;
  } catch (error) {
    log.error(`🚨 ERROR al enviar correo: ${error.message}`);
    return null;
  }
});

// Statics Methods
UserSchema.statics.findByToken = async function findByToken(token) {
  // "this" hace referencia al modelo es decir
  // a todo el conjunto de documentos
  return this.findOne({ emailConfirmationToken: token });
};

export default mongoose.model('User', UserSchema);
