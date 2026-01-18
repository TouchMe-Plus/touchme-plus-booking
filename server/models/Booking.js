const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
  
  // 1. Customer Details (New)
  customerDetails: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    cnic: String // Optional: Good for Pakistani hotels/security
  },

  // 2. Payment Info (New)
  paymentStatus: { 
    type: String, 
    enum: ['PENDING', 'PAID', 'REFUNDED'], 
    default: 'PENDING' 
  },
  totalAmount: { type: Number, required: true },
  transactionId: String, // ID from Stripe/JazzCash

  // 3. Standard Info
  type: { type: String, required: true },
  date: { type: String, required: true },
  startTime: String,
  endTime: String,
  endDate: String,
  
  status: { type: String, default: 'CONFIRMED' },

  // 4. Critical for Cancellation: When was this booking made?
  createdAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('Booking', BookingSchema);