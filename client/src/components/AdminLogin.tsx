import React, { useState } from 'react';
import { User, Lock, ArrowRight } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (user: any) => void;
  isDarkMode?: boolean; // <--- 1. Accept Dark Mode Prop
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, isDarkMode = false }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        onLogin(data.user);
      } else {
        setError('Invalid Credentials');
      }
    } catch (err) {
      setError('Server Error. Is backend running?');
    } finally {
      setLoading(false);
    }
  };

  // --- DYNAMIC STYLES ---
  const cardClass = isDarkMode ? 'bg-gray-800 border-gray-700 shadow-xl' : 'bg-white border-gray-200 shadow-lg';
  const textTitle = isDarkMode ? 'text-white' : 'text-gray-900';
  const textLabel = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  const inputClass = isDarkMode 
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-yellow-400' 
    : 'bg-white border-gray-300 text-gray-900 focus:ring-yellow-500';

  return (
    <div className="flex justify-center items-center mt-10">
      <div className={`p-8 rounded-2xl w-full max-w-md border transition-colors duration-300 ${cardClass}`}>
        
        {/* ICON & TITLE */}
        <div className="text-center mb-8">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-yellow-100 text-yellow-600'}`}>
            <User size={40} />
          </div>
          <h2 className={`text-3xl font-bold ${textTitle}`}>Owner Login</h2>
          <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Manage your properties and bookings
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-center text-sm font-semibold border border-red-100">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className={`block text-sm font-bold mb-2 ${textLabel}`}>Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="text" 
                className={`w-full pl-10 p-3 rounded-lg border outline-none focus:ring-2 transition-all ${inputClass}`}
                placeholder="admin"
                value={username} onChange={e => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-bold mb-2 ${textLabel}`}>Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="password" 
                className={`w-full pl-10 p-3 rounded-lg border outline-none focus:ring-2 transition-all ${inputClass}`}
                placeholder="•••"
                value={password} onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* YELLOW SUBMIT BUTTON */}
          <button 
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-xl transition-transform transform active:scale-95 shadow-md flex justify-center items-center gap-2"
          >
            {loading ? 'Verifying...' : <>Access Dashboard <ArrowRight size={18} /></>}
          </button>
        </form>

      </div>
    </div>
  );
};

export default AdminLogin;