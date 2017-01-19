'use strict';

import mongoose from 'mongoose';
import uid from 'uid';
import idValidator from 'mongoose-id-validator';

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    //unique: true,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  price: {
    type: Number,
    required: true
  },
  unit: String,
  hot: {
    type: Boolean,
    default: false
  }
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
  this.count({
    category: this.category,
    name: this.name
  }, function(error, count) {
    if (error) {
      return next(error);
    }
    if (count > 0) {
      return next(new Error('Product exists under the same category.'));
    }
    next();
  });
  //next();
});

export default mongoose.model('Product', productSchema);