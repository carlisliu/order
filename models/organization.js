'use strict';

import mongoose from 'mongoose';
import uid from 'uid';
import idValidator from 'mongoose-id-validator';

const organizationSchema = new mongoose.Schema({
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
  tel: String,
  cell: String,
  address: {
    street: String,
    city: String,
    country: String
  },
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
    }
  },
});

organizationSchema.plugin(idValidator);

organizationSchema.pre('validate', function preSave(next) {
  if (this.isNew) {
    if (!this.id) this.id = uid(16);
  }
  next();
});

export default mongoose.model('Organization', organizationSchema);