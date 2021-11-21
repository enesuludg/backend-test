import { model, Schema, Document } from 'mongoose';
import { Token } from '@/interfaces/tokenVerify.interface';

const tokenSchema = new Schema({
  _userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  token: { type: String, required: true },
  expireAt: { type: Date, default: Date.now, index: { expires: 86400000 } }
});
const tokenModel = model<Token & Document>('Token', tokenSchema);

export default tokenModel;
