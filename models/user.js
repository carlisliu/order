'use strict';

import mongoose from 'mongoose';
import uid from 'uid';
import idValidator from 'mongoose-id-validator';

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    unique: true,
    required: true,
  },
  admin: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true,
  },
  email: String,
  description: String
}, {
  versionKey: false,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  toJSON: {
    transform(doc, ret) {
      delete ret._id;
      delete ret.hashed_secret;
    },
  },
});

userSchema.plugin(idValidator);

userSchema.pre('validate', function preSave(next) {
  if (this.isNew) {
    if (!this.id) {
      this.id = uid(16);
    }
  }
  next();
});

export default mongoose.model('User', userSchema);