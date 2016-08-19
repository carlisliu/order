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
    street: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    },
    country: {
      type: String,
      default: ''
    }
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
  }
});

organizationSchema.plugin(idValidator);

organizationSchema.pre('validate', function preSave(next) {
  if (this.isNew) {
    if (!this.id) {
      this.id = uid(16);
    }
  }
  next();
});

organizationSchema.vritual('address.full').get(function() {
  var address = this.address;
  var full = [address.street, address.city, address.country];
  full = full.filter(function (address) {
    return !!address;
  });
  return full.join(', ');
});

organizationSchema.vritual('address.full').set(function(address) {
  var addr = address.split('(\\s+)?,(\\s+)?');
  this.address.street = addr[0] || '';
  this.address.city = addr[1] || '';
  this.address.country = addr[2] || '';
});

export default mongoose.model('Organization', organizationSchema);