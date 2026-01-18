import React, { useState } from 'react';
import { Calendar, Clock, Users, Home, Building2, BedDouble, Search } from 'lucide-react';
import ResourceCard from './ResourceCard';

// --- INTERFACE FIX: Allows App.tsx to send these props ---
interface BookingSearchProps {
  onBookRequest: (resource: any) => void;
  isDarkMode: boolean;
}

const BookingSearch: React.FC<BookingSearchProps> = ({ onBookRequest, isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<'HALL' | 'VILLA' | 'ROOM'>('HALL');
  const [date, setDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [guests, setGuests] = useState(1);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const searchData = { activeTab, date, endDate, startTime, endTime, guests };

    try {
      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchData),
      });

      const result = await response.json();
      if (result.success) {
        setResults(result.data);
      }
    } catch (error) {
      console.error("Error connecting to server:", error);
      alert("Failed to connect to the backend.");
    }
  };

  const handleBooking = (resource: any) => {
    // Pass the selected resource up to App.tsx
    onBookRequest(resource);
  };

  // --- STYLES FOR DARK/LIGHT MODE ---
  const containerClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';
  const textClass = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  const inputClass = isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900';
  const tabActive = 'text-yellow-500 border-b-2 border-yellow-400';
  const tabInactive = isDarkMode ? 'text-gray-400 hover:text-yellow-400' : 'text-gray-500 hover:text-yellow-600';

  return (
    <div className={`max-w-4xl mx-auto mt-10 p-6 rounded-xl shadow-xl border ${containerClass} transition-colors duration-300`}>
      
      {/* TABS */}
      <div className={`flex justify-center mb-8 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <button onClick={() => setActiveTab('HALL')} className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${activeTab === 'HALL' ? tabActive : tabInactive}`}>
          <Building2 size={20} /> Hall
        </button>
        <button onClick={() => setActiveTab('VILLA')} className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${activeTab === 'VILLA' ? tabActive : tabInactive}`}>
          <Home size={20} /> Villa
        </button>
        <button onClick={() => setActiveTab('ROOM')} className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${activeTab === 'ROOM' ? tabActive : tabInactive}`}>
          <BedDouble size={20} /> Room
        </button>
      </div>

      {/* FORM */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="flex flex-col gap-1">
          <label className={`text-sm font-semibold ${textClass}`}>
            {activeTab === 'HALL' ? 'Event Date' : 'Check-in'}
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
            <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none ${inputClass}`} />
          </div>
        </div>

        {activeTab === 'HALL' ? (
          <>
            <div className="flex flex-col gap-1">
              <label className={`text-sm font-semibold ${textClass}`}>Start Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none ${inputClass}`} />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className={`text-sm font-semibold ${textClass}`}>End Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)} className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none ${inputClass}`} />
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-1">
            <label className={`text-sm font-semibold ${textClass}`}>Check-out</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
              <input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none ${inputClass}`} />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label className={`text-sm font-semibold ${textClass}`}>Guests</label>
          <div className="relative">
            <Users className="absolute left-3 top-3 text-gray-400" size={18} />
            <input type="number" min="1" value={guests} onChange={(e) => setGuests(parseInt(e.target.value))} className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none ${inputClass}`} />
          </div>
        </div>

        <div className="md:col-span-2 lg:col-span-4 mt-2">
          <button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md">
            <Search size={20} /> Check Availability
          </button>
        </div>
      </form>

      {/* RESULTS */}
      <div className="mt-10">
        {results.length > 0 && (
          <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Available Options</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map((item) => (
            <ResourceCard 
              key={item._id} 
              data={item} 
              onBook={() => handleBooking(item)} 
              isDarkMode={isDarkMode} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingSearch;