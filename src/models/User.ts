import mongoose from 'mongoose';
import * as common from '../utils/common';
import options from './options';
import mongoosePaginate from 'mongoose-paginate-v2';
import { Role, Gender, UserIF } from '../types/UserIF';

const userSchema = new mongoose.Schema<UserIF>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true, set: common.hash },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    zip: { type: Number, required: true },
    gender: { type: String, enum: Gender },
    role: { type: String, default: Role.USER, enum: Role },
    verified_email: { type: Boolean, default: false },
  },
  options
);

userSchema.index({ name: 'text' });

userSchema.methods.toJSON = function () {
  var obj: any = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.methods.checkPassword = async function (password: string) {
  const context: any = this;
  if (common.hash(password) === context.password) {
    console.log(this);
    return this;
  }
  throw { status: 401 };
};

userSchema.plugin(mongoosePaginate);

export default mongoose.model('User', userSchema);
