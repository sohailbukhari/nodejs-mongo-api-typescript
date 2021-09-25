import mongoose from 'mongoose';
import * as common from '../utils/common';
import options from './options';
import mongoosePaginate from 'mongoose-paginate-v2';
import { UserIF } from 'src/types/UserIF';

const SCOPES = ['user', 'admin'];

const userSchema = new mongoose.Schema<UserIF>(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: { type: String, required: true, set: common.hash },
    phone: { type: String, required: false, default: null },
    role: { type: String, default: 'user', enum: SCOPES },
    verified_email: { type: Boolean, default: false },
  },
  options
);

userSchema.methods.toJSON = function () {
  var obj: any = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.methods.checkPassword = async function (password) {
  const context: any = this;
  if (common.hash(password) === context.password) {
    console.log(this);
    return this;
  }
  throw { status: 401 };
};

userSchema.plugin(mongoosePaginate);

export default mongoose.model('User', userSchema);
