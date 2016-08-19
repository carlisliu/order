'use strict';

import mongoose from 'mongoose';
import uid from 'uid';
import idValidator from 'mongoose-id-validator';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  id: {
    type: String,
    unique: true,
    required: true,
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
}, {
  versionKey: false,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  toJSON: {
    transform(doc, ret) {
      //delete ret._id;
      delete ret.hashed_secret;
    },
  },
});

productSchema.plugin(idValidator);

productSchema.pre('validate', function preSave(next) {
  if (this.isNew) {
    if (!this.id) {
      this.id = uid(16);
    }
  }
  next();
});

export default mongoose.model('Product', productSchema);