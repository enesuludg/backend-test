import { model, Schema, Document } from 'mongoose';
import { User } from '@/interfaces/users.interface';

const userSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  token: { 
    type: String
   },
});

const userModel = model<User & Document>('User', userSchema);

export default userModel;
