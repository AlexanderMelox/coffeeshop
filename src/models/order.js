import { Schema, model } from 'mongoose';
import validator from 'validator';

const orderSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    validate: [v => validator.isEmail(v), 'Not a valid Email']
  },
  size: {
    type: String,
    required: true,
    enum: ['SHORT', 'TALL', 'GRANDE']
  },
  flavor: {
    type: String,
    enum: ['CARAMEL', 'ALMOND', 'MOCHA']
  }
});

export const Order = model('Order', orderSchema);
