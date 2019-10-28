/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema(
  {
    nome: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    senha: {
      type: String,
      required: true,
    },
    ultimo_login: {
      type: Date,
      required: true,
    },
    telefones: [{ ddd: String, numero: String }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

UserSchema.pre('save', async function(next) {
  if (this.senha) {
    this.senha = await bcrypt.hash(this.senha, 8);
  }
  next();
});

UserSchema.methods.checkPassword = function(senha) {
  return bcrypt.compare(senha, this.senha);
};

UserSchema.methods.toJson = function(token) {
  const user = this.toObject();

  user.id = user._id;
  delete user._id;

  user.data_criacao = user.createdAt;
  delete user.createdAt;

  user.data_atualizacao = user.updatedAt;
  delete user.updatedAt;

  user.telefones.map(telefone => {
    delete telefone._id;
    return telefone;
  });

  delete user.senha;

  user.token = token;

  return user;
};

export default model('User', UserSchema);
