const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['HALL', 'VILLA', 'ROOM'], required: true },
  price: { type: Object, required: true }, // { morning: 50000, perNight: 2000 }
  isAC: { type: Boolean, default: false },
  image: { type: String },
  address: { type: String },
  
  // --- NEW FIELD ---
  ownerId: { type: String, required: true } // Links property to a specific user
});

module.exports = mongoose.model('Resource', resourceSchema);