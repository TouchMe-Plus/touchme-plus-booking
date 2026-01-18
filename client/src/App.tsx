import { useState } from 'react';
import BookingSearch from './components/BookingSearch';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import BookingForm from './components/BookingForm';
import { LayoutDashboard, Search, LogIn, LogOut, User as UserIcon, Moon, Sun } from 'lucide-react';

function App() {
  const [view, setView] = useState<'USER' | 'ADMIN' | 'LOGIN' | 'BOOKING_FORM'>('USER');
  const [user, setUser] = useState<{ id: string, role: string, name: string } | null>(null);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  
  // --- DARK MODE STATE ---
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle Function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    // THEME WRAPPER
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen transition-colors duration-300`}>
      
      {/* Navbar */}
      <nav className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b px-6 py-4 flex justify-between items-center mb-8 transition-colors duration-300`}>
        
        {/* LOGO SECTION */}
        <div className="flex items-center gap-3">
          <img 
            src={isDarkMode ? "/logo-dark.png" : "/logo-light.png"} 
            alt="TouchMe+ Logo" 
            className="h-12 w-auto object-contain"
          />
          <h1 className={`text-xl font-bold tracking-tight hidden md:block ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            TouchMe<span className="text-yellow-400">+</span>
          </h1>
        </div>
        
        <div className="flex gap-4 items-center">
          
          {/* THEME TOGGLE BUTTON */}
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all ${isDarkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* PUBLIC BOOKING BUTTON */}
          <button
            onClick={() => setView('USER')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all 
              ${view === 'USER' 
                ? 'bg-yellow-400 text-black shadow-md transform scale-105' 
                : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black' 
              }`}
          >
            <Search size={18} /> Booking
          </button>

          {/* LOGIN / ACCOUNT */}
          {user ? (
            <>
              <button
                onClick={() => setView('ADMIN')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${view === 'ADMIN' ? 'bg-yellow-100 text-yellow-700' : isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
              >
                <LayoutDashboard size={18} /> Dashboard
              </button>

              <div className="flex items-center gap-3 pl-4 border-l border-gray-500 ml-2">
                <span className={`text-sm font-bold flex items-center gap-1 hidden md:flex ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <UserIcon size={16} /> {user.name}
                </span>
                <button 
                  onClick={() => { setUser(null); setView('USER'); }} 
                  className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition-all text-sm"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => setView('LOGIN')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${view === 'LOGIN' ? 'bg-yellow-400 text-black' : isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'}`}
            >
              <LogIn size={18} /> Owner Login
            </button>
          )}

        </div>
      </nav>

      {/* Main Content Area */}
      <div className="px-4">
        {view === 'USER' && (
          <>
            <div className="text-center mb-10">
              <h2 className={`text-4xl font-extrabold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Find Your Perfect Space
              </h2>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Weddings, Events, and Luxury Stays
              </p>
            </div>
            
            <BookingSearch 
               isDarkMode={isDarkMode} 
               onBookRequest={(resource) => {
                 setSelectedResource(resource);
                 setView('BOOKING_FORM');
               }} 
            />
          </>
        )}

        {view === 'LOGIN' && (
          <AdminLogin onLogin={(userData: any) => {
            setUser(userData);
            setView('ADMIN');
          }} 
          isDarkMode={isDarkMode}
          />
        )}

        {view === 'ADMIN' && user && (
          <AdminDashboard user={user} isDarkMode={isDarkMode}/>
        )}

        {view === 'BOOKING_FORM' && selectedResource && (
          <BookingForm 
            resource={selectedResource}
            searchDetails={{ date: "2026-01-25" }}
            onCancel={() => setView('USER')}
            onSuccess={() => { setSelectedResource(null); setView('USER'); }}
            isDarkMode={isDarkMode}  // <--- THIS WAS MISSING!
          />
        )}
      </div>
    </div>
  );
}

export default App;