const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  serialNumber: {
    type: Number,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  inputImageUrls: [{
    type: String,
    required: true
  }],
  outputImageUrls: [{
    type: String
  }],
  requestId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);