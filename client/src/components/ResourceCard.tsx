import React from 'react';
import { MapPin, Wind, Zap } from 'lucide-react';

interface ResourceProps {
  data: {
    _id: string;
    name: string;
    type: string;
    price: any;
    isAC: boolean;
    image?: string;
    address?: string;
  };
  onBook: () => void;
  isDarkMode?: boolean; 
}

const ResourceCard: React.FC<ResourceProps> = ({ data, onBook, isDarkMode = false }) => {
  
  // DYNAMIC STYLES
  const cardBg = isDarkMode ? 'bg-gray-800 border-gray-700 shadow-xl' : 'bg-white border-gray-100 shadow-lg';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const subText = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  // --- SMART PRICE FINDER ---
  // Checks Morning -> Evening -> FullDay -> PerNight. Returns 0 if all missing.
  const displayPrice = data.price?.morning || data.price?.evening || data.price?.fullDay || data.price?.perNight || 0;

  return (
    <div className={`rounded-xl overflow-hidden border hover:shadow-2xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1 ${cardBg}`}>
      
      {/* IMAGE SECTION */}
      <div className="h-56 w-full relative group">
        <img 
          src={data.image || "https://via.placeholder.com/400"} 
          alt={data.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* BADGES */}
        <div className="absolute top-3 right-3 flex gap-2">
            {data.isAC ? (
                <span className="px-2 py-1 text-xs font-bold text-black bg-cyan-400 rounded-md shadow-sm flex items-center gap-1">
                  <Wind size={12} /> AC
                </span>
            ) : (
                <span className="px-2 py-1 text-xs font-bold text-white bg-orange-500 rounded-md shadow-sm flex items-center gap-1">
                  <Zap size={12} /> Non-AC
                </span>
            )}
        </div>
        <div className="absolute bottom-3 left-3">
           <span className="px-3 py-1 text-xs font-bold text-black bg-yellow-400 rounded-full shadow-sm uppercase tracking-wider">
              {data.type}
           </span>
        </div>
      </div>

      {/* DETAILS SECTION */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className={`text-xl font-bold leading-tight ${textColor}`}>{data.name}</h3>
        </div>

        {/* Address */}
        {data.address && (
          <p className={`text-sm mb-4 flex items-center gap-1 ${subText}`}>
             <MapPin size={16} className="text-yellow-500" /> {data.address}
          </p>
        )}

        {/* PRICE & ACTION */}
        <div className={`mt-auto pt-4 border-t flex items-center justify-between ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div>
            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Starting from</p>
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-yellow-400' : 'text-blue-600'}`}>
              {/* USE THE SMART PRICE HERE */}
              ${displayPrice}
              <span className="text-xs font-normal text-gray-400">
                {data.type === 'HALL' ? '/slot' : '/night'}
              </span>
            </p>
          </div>
          
          <button 
            onClick={onBook}
            className="px-6 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors shadow-md"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;