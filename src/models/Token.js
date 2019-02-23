import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import logger from '../logger';

let mongooseHidden = require('mongoose-hidden')();

const { Schema } = mongoose;

const tokenSchema = new Schema({
  appId: {
    type: String,
    required: true
  },
  appSecret: {
    type: String,
    required: true
  },
  provider: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

// This will add `id` in toJSON
tokenSchema.set('toJSON', {
  virtuals: true
});

tokenSchema.virtual('password').set(v => {
  this.passwordHash = bcrypt.hashSync(v, 12);
});

// This will remove `_id` and `__v`
tokenSchema.plugin(mongooseHidden);

export default mongoose.model('Token', tokenSchema);
