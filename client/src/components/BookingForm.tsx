import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, User, Phone, DollarSign } from 'lucide-react';

interface Props {
  resource: any;       
  searchDetails: any;  
  onCancel: () => void;
  onSuccess: () => void;
  isDarkMode?: boolean; // <--- 1. UPDATED: Accepts Dark Mode Prop
}

const BookingForm: React.FC<Props> = ({ resource, searchDetails, onCancel, onSuccess, isDarkMode = false }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  // --- 2. UPDATED: SAFE PRICE CALCULATION (Fixes Validation Error) ---
  const getPrice = () => {
    if (!resource.price) return 5000; // Default fallback
    // Check for specific prices, otherwise fallback to any available price
    if (resource.type === 'HALL') return resource.price.morning || resource.price.fullDay || 10000;
    return resource.price.perNight || 5000;
  };
  
  const totalAmount = Number(getPrice()); 

  // --- 3. UPDATED: DARK MODE STYLES ---
  const containerClass = isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-100';
  const inputClass = isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';
  const cardClass = isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-100';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const bookingPayload = {
      resourceId: resource._id,
      type: resource.type,
      date: searchDetails?.date || new Date().toISOString().split('T')[0], 
      startTime: searchDetails?.startTime || "10:00",
      endTime: searchDetails?.endTime || "14:00",
      endDate: searchDetails?.endDate || searchDetails?.date, 
      
      customerDetails: {
        name: name,
        phone: phone
      },
      totalAmount: totalAmount, // Guaranteed to be a number now
      paymentStatus: 'PENDING'
    };

    try {
      const res = await fetch('http://localhost:5000/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
      });
      
      const data = await res.json();
      
      if (data.success) {
        alert("✅ Booking Success! We will contact you shortly.");
        onSuccess();
      } else {
        alert("❌ Failed: " + (data.message || "Unknown Error"));
        console.error("Backend Error:", data);
      }
    } catch (err) {
      alert("❌ Server Error: Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-2xl mx-auto mt-10 p-8 rounded-xl shadow-xl border ${containerClass} transition-colors duration-300`}>
      
      {/* Header */}
      <button onClick={onCancel} className={`flex items-center mb-6 hover:opacity-80 ${textMuted}`}>
        <ArrowLeft size={18} className="mr-1" /> Back to Search
      </button>

      <h2 className="text-3xl font-bold mb-2">Confirm Your Booking</h2>
      <p className={`mb-8 ${textMuted}`}>Please enter your details to finalize.</p>

      {/* Booking Summary Card */}
      <div className={`p-6 rounded-xl mb-8 border flex justify-between items-center ${cardClass}`}>
        <div>
          <h3 className={`font-bold text-lg ${isDarkMode ? 'text-yellow-400' : 'text-blue-900'}`}>{resource.name}</h3>
          <p className={isDarkMode ? 'text-gray-300' : 'text-blue-700'}>{searchDetails?.date || "Selected Date"}</p>
          <span className={`text-xs font-bold px-2 py-1 rounded mt-2 inline-block ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-blue-200 text-blue-800'}`}>
            {resource.type}
          </span>
        </div>
        <div className="text-right">
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-blue-600'}`}>Total Amount</p>
          <p className={`text-3xl font-bold flex items-center justify-end ${isDarkMode ? 'text-green-400' : 'text-blue-900'}`}>
             <DollarSign size={24}/>{totalAmount}
          </p>
        </div>
      </div>

      {/* The Form */}
      <form onSubmit={handleConfirm} className="space-y-6">
        <div>
          <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="text" required 
              className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none ${inputClass}`}
              placeholder="e.g. Ali Khan"
              value={name} onChange={e => setName(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="tel" required 
              className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none ${inputClass}`}
              placeholder="e.g. 0300-1234567"
              value={phone} onChange={e => setPhone(e.target.value)}
            />
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-yellow-400 text-black font-bold py-4 rounded-xl hover:bg-yellow-500 transition shadow-lg flex justify-center items-center gap-2"
        >
          {loading ? "Processing..." : <><CheckCircle /> Confirm & Pay Later</>}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;