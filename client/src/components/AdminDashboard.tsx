import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Building2, Trash2, RefreshCw, X, UserPlus, Users } from 'lucide-react';

interface AdminDashboardProps {
  user: { name: string; id: string; role: string };
  isDarkMode?: boolean;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, isDarkMode = false }) => {
  // Data State
  const [myResources, setMyResources] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // UI State
  const [showModal, setShowModal] = useState(false);
  const [createOwnerMode, setCreateOwnerMode] = useState(false);

  // Form State
  const [newProp, setNewProp] = useState({ name: '', type: 'HALL', price: 0, image: '', isAC: true });
  const [selectedOwner, setSelectedOwner] = useState('');
  const [newOwner, setNewOwner] = useState({ name: '', username: '', password: '' });

  // --- FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Resources
      const res = await fetch(`http://localhost:5000/api/my-resources?userId=${user.id}`);
      const data = await res.json();
      if (data.success) setMyResources(data.data);

      // 2. Bookings
      const bookRes = await fetch(`http://localhost:5000/api/bookings?userId=${user.id}&role=${user.role}`);
      const bookData = await bookRes.json();
      if (bookData.success) setBookings(bookData.data);

      // 3. Owners (Only if Super Admin)
      if (user.role === 'SUPER_ADMIN') {
        const ownerRes = await fetch('http://localhost:5000/api/owners');
        const ownerData = await ownerRes.json();
        if (ownerData.success) setOwners(ownerData.data);
      }
      
    } catch (error) {
      console.error("Fetch Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [user]);

  // --- HANDLER: ADD PROPERTY ---
  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalOwnerId = selectedOwner;

    // A. If Creating New Owner First
    if (createOwnerMode) {
      try {
        const userRes = await fetch('http://localhost:5000/api/register-owner', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(newOwner)
        });
        const userData = await userRes.json();
        if (!userData.success) return alert("Failed to create user: " + userData.message);
        finalOwnerId = userData.user._id;
      } catch (err) { return alert("Network Error creating user"); }
    }

    if (!finalOwnerId) return alert("Please select or create an owner!");

    // B. Create Property
    try {
      const payload = {
        ...newProp,
        ownerId: finalOwnerId,
        price: newProp.type === 'HALL' ? { morning: newProp.price } : { perNight: newProp.price }
      };

      await fetch('http://localhost:5000/api/resources', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });
      
      alert("✅ Property Added Successfully!");
      setShowModal(false);
      fetchData(); // Refresh list
    } catch (err) { alert("Failed to add property"); }
  };

  // --- STYLES ---
  const textMain = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSub = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const modalBg = isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
  const inputClass = isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black';

  return (
    <div className="max-w-6xl mx-auto mt-8 mb-20">
      
      {/* HEADER */}
      <div className="flex justify-between items-end mb-10 border-b pb-6 border-gray-200 dark:border-gray-700">
        <div>
          <h2 className={`text-4xl font-extrabold tracking-tight ${textMain}`}>
            {user.role === 'SUPER_ADMIN' ? 'Super Admin Dashboard' : `Welcome, ${user.name}`}
          </h2>
          <p className={`mt-2 ${textSub}`}>Manage your properties and bookings</p>
        </div>
        <div className="flex gap-3">
            <button onClick={fetchData} className={`p-3 rounded-xl transition ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600'}`}>
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            
            {/* ONLY SHOW FOR SUPER ADMIN */}
            {user.role === 'SUPER_ADMIN' && (
              <button 
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold transition shadow-lg transform hover:-translate-y-1"
              >
                <Plus size={20} /> Add New Property
              </button>
            )}
        </div>
      </div>

      {/* --- RECENT BOOKINGS --- */}
      <div className="mb-12">
        <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${textMain}`}><Calendar className="text-yellow-400" size={24} /> Recent Bookings</h3>
        <div className={`rounded-xl overflow-hidden border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
           {bookings.length === 0 ? <div className={`p-8 text-center ${textSub}`}>No bookings yet.</div> : (
             <table className="w-full text-left">
               <thead className={isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}>
                 <tr><th className="p-4">Customer</th><th className="p-4">Property</th><th className="p-4">Status</th></tr>
               </thead>
               <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                 {bookings.map((b:any) => (
                   <tr key={b._id}><td className={`p-4 ${textMain}`}>{b.customerName}</td><td className={`p-4 ${textSub}`}>{b.resourceId?.name}</td><td className="p-4"><span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">CONFIRMED</span></td></tr>
                 ))}
               </tbody>
             </table>
           )}
        </div>
      </div>

      {/* --- INVENTORY --- */}
      <div>
        <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${textMain}`}><Building2 className="text-yellow-400" size={24} /> Inventory</h3>
        <div className={`rounded-xl overflow-hidden border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
           {myResources.length === 0 ? <div className={`p-8 text-center ${textSub}`}>Inventory Empty.</div> : (
             <table className="w-full text-left">
               <thead className={isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}>
                 <tr><th className="p-4">Name</th><th className="p-4">Type</th><th className="p-4">Price</th></tr>
               </thead>
               <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                 {myResources.map((r:any) => (
                   <tr key={r._id}>
                     <td className={`p-4 font-bold ${textMain}`}>{r.name}</td>
                     <td className={`p-4 ${textSub}`}>{r.type}</td>
                     <td className={`p-4 font-mono ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>${r.price?.morning || r.price?.perNight || 0}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           )}
        </div>
      </div>

      {/* --- MODAL: ADD PROPERTY --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
          <div className={`w-full max-w-2xl rounded-2xl shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto ${modalBg}`}>
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><X size={24}/></button>
            
            <h2 className="text-2xl font-bold mb-6">Add New Property</h2>
            
            <form onSubmit={handleAddProperty} className="space-y-6">
              
              {/* 1. PROPERTY DETAILS */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Property Name</label>
                  <input required type="text" className={`w-full p-3 rounded-lg border ${inputClass}`} value={newProp.name} onChange={e=>setNewProp({...newProp, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Type</label>
                  <select className={`w-full p-3 rounded-lg border ${inputClass}`} value={newProp.type} onChange={e=>setNewProp({...newProp, type: e.target.value})}>
                    <option value="HALL">Hall</option><option value="VILLA">Villa</option><option value="ROOM">Room</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Price ($)</label>
                  <input required type="number" className={`w-full p-3 rounded-lg border ${inputClass}`} value={newProp.price} onChange={e=>setNewProp({...newProp, price: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Image URL</label>
                  <input type="text" placeholder="https://..." className={`w-full p-3 rounded-lg border ${inputClass}`} value={newProp.image} onChange={e=>setNewProp({...newProp, image: e.target.value})} />
                </div>
              </div>

              {/* 2. OWNER SELECTION (The Magic Part) */}
              <div className={`p-4 rounded-xl border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex gap-4 mb-4 border-b border-gray-500 pb-2">
                  <button type="button" onClick={() => setCreateOwnerMode(false)} className={`flex items-center gap-2 pb-2 ${!createOwnerMode ? 'text-yellow-400 border-b-2 border-yellow-400 font-bold' : 'text-gray-400'}`}>
                    <Users size={18}/> Select Existing Owner
                  </button>
                  <button type="button" onClick={() => setCreateOwnerMode(true)} className={`flex items-center gap-2 pb-2 ${createOwnerMode ? 'text-yellow-400 border-b-2 border-yellow-400 font-bold' : 'text-gray-400'}`}>
                    <UserPlus size={18}/> Create New Owner
                  </button>
                </div>

                {!createOwnerMode ? (
                  <div>
                    <label className="block text-sm font-bold mb-2">Assign to Owner</label>
                    <select className={`w-full p-3 rounded-lg border ${inputClass}`} value={selectedOwner} onChange={e=>setSelectedOwner(e.target.value)}>
                      <option value="">-- Select Owner --</option>
                      {owners.map((o:any) => <option key={o._id} value={o._id}>{o.name} (@{o.username})</option>)}
                    </select>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input placeholder="Owner Full Name" className={`p-3 rounded-lg border ${inputClass}`} value={newOwner.name} onChange={e=>setNewOwner({...newOwner, name: e.target.value})} />
                    <input placeholder="Username" className={`p-3 rounded-lg border ${inputClass}`} value={newOwner.username} onChange={e=>setNewOwner({...newOwner, username: e.target.value})} />
                    <input type="password" placeholder="Password" className={`p-3 rounded-lg border ${inputClass}`} value={newOwner.password} onChange={e=>setNewOwner({...newOwner, password: e.target.value})} />
                    <div className="flex items-center text-xs text-yellow-500 font-bold">New user will be created instantly.</div>
                  </div>
                )}
              </div>

              <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 rounded-xl shadow-lg transition">
                {createOwnerMode ? 'Create Owner & Add Property' : 'Add Property'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;