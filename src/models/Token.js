import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import logger from '../logger';

let mongooseHidden = require('mongoose-hidden')();

const { Schema } = mongoose;

const tokenSchema = new Schema({
  provider: {
    type: String,
    required: true
  },
  name: {
    unique: true,
    type: String,
    required: true
  },
  authToken: {
    type: String
  },
  username: {
    type: String
  },
  password: {
    type: String
  },
  appId: {
    type: String
  },
  appSecret: {
    type: String
  }
});

// This will add `id` in toJSON
tokenSchema.set('toJSON', {
  virtuals: true
});

// This will remove `_id` and `__v`
tokenSchema.plugin(mongooseHidden);

export default mongoose.model('Token', tokenSchema);
