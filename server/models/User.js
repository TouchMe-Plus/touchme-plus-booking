const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // In real app, encrypt this!
  role: { type: String, enum: ['ADMIN', 'OWNER'], required: true },
  name: { type: String }
});

module.exports = mongoose.model('User', UserSchema);