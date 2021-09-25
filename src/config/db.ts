import mongoose from 'mongoose';
import keys from './keys';

(async () => {
  try {
    await mongoose.connect(keys.mongodb);
    console.log('------------ Success: Mongodb ------------ ');
  } catch (err) {}
})();

export default mongoose.connection;
