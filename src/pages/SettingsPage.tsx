// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   User, 
//   Globe, 
//   Phone, 
//   Camera, 
//   CreditCard, 
//   Save, 
//   Loader2, 
//   ArrowLeft,
//   Mail
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import api from '../service/api'; 

// const SettingsPage = () => {
//   const navigate = useNavigate();
//   const fileInputRef = useRef<HTMLInputElement>(null);
  
//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(true);
  
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '', 
//     country: '',
//     mobile: '',
//     picture: '',
//     accountName: ''
//   });

//   // 1. Fetch data on load
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const res = await api.get('/auth/me'); 
//         const userData = res.data?.user || {};
//         const accountData = res.data?.account || {};

//         setFormData({
//           name: userData.name || '',
//           email: userData.email || '',
//           country: userData.country || '',
//           mobile: userData.mobile || '',
//           picture: userData.picture || '',
//           accountName: accountData.name || ''
//         });
//       } catch (err) {
//         console.error("Error fetching user data:", err);
//       } finally {
//         setFetching(false);
//       }
//     };
//     fetchUserData();
//   }, []);

//   // 2. Handle File Input (Optimized)
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       // Check if file is actually an image
//       if (!file.type.startsWith('image/')) {
//         alert("Please upload an image file.");
//         return;
//       }

//       // Limit to 2MB to avoid server payload errors
//       if (file.size > 2 * 1024 * 1024) {
//         alert("Image is too large. Please select a file under 2MB.");
//         return;
//       }

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData((prev) => ({ ...prev, picture: reader.result as string }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // 3. Handle Form Submission
//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       // Ensure the endpoint matches your backend route
//       await api.put('/auth/settings', formData);
//       alert("Profile updated successfully!");
//     } catch (err: any) {
//       console.error("Update error:", err);
//       if (err.response?.status === 413) {
//         alert("The image is too large for the server. Try a smaller photo.");
//       } else {
//         alert("Could not update profile. Check server console for CORS/Payload errors.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (fetching) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen">
//         <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
//         <p className="text-slate-500 font-medium">Fetching your profile data...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50/50 py-10 px-4">
//       <div className="max-w-4xl mx-auto">
//         <button 
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 group"
//         >
//           <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
//           <span className="font-semibold text-sm">Back to Dashboard</span>
//         </button>

//         <div className="bg-white shadow-xl shadow-slate-200/50 rounded-[32px] border border-slate-100 overflow-hidden">
//           <div className="p-8 md:p-12">
//             <h2 className="text-3xl font-black text-slate-800 mb-2">Account Settings</h2>
//             <p className="text-slate-500 mb-10">Manage your profile and business information.</p>

//             <form onSubmit={handleUpdate} className="space-y-10">
              
//               {/* Profile Picture Section */}
//               <div className="flex flex-col md:flex-row items-center gap-8 bg-indigo-50/50 p-8 rounded-[24px] border border-indigo-100/50">
//                 <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
//                   <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
//                     {formData.picture ? (
//                       <img 
//                         src={formData.picture} 
//                         className="w-full h-full object-cover"
//                         alt="Profile"
//                       />
//                     ) : (
//                       <div className="w-full h-full bg-indigo-500 flex items-center justify-center text-white text-4xl font-black">
//                         {formData.name?.charAt(0) || <User size={40} />}
//                       </div>
//                     )}
//                   </div>
//                   <div className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
//                     <Camera className="text-white" size={32} />
//                   </div>
//                   <input 
//                     type="file" 
//                     ref={fileInputRef} 
//                     className="hidden" 
//                     accept="image/*" 
//                     onChange={handleImageChange} 
//                   />
//                 </div>
                
//                 <div className="text-center md:text-left">
//                   <h4 className="text-xl font-bold text-slate-800">{formData.name || 'Set Name'}</h4>
//                   <p className="text-slate-500 mb-4">{formData.email}</p>
//                   <button 
//                     type="button"
//                     onClick={() => fileInputRef.current?.click()}
//                     className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
//                   >
//                     Change Photo
//                   </button>
//                 </div>
//               </div>

//               {/* Form Grid */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
//                 <div className="space-y-2">
//                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
//                   <div className="relative">
//                     <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
//                     <input 
//                       type="text" 
//                       className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium"
//                       value={formData.name}
//                       onChange={(e) => setFormData({...formData, name: e.target.value})}
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email (Locked)</label>
//                   <div className="relative">
//                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
//                     <input 
//                       type="email" 
//                       disabled
//                       className="w-full pl-12 pr-4 py-4 bg-slate-100 border border-slate-200 rounded-2xl text-slate-400 cursor-not-allowed font-medium"
//                       value={formData.email}
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Business/Account Name</label>
//                   <div className="relative">
//                     <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
//                     <input 
//                       type="text" 
//                       className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium"
//                       value={formData.accountName}
//                       onChange={(e) => setFormData({...formData, accountName: e.target.value})}
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
//                   <div className="relative">
//                     <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
//                     <input 
//                       type="text" 
//                       className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium"
//                       value={formData.mobile}
//                       onChange={(e) => setFormData({...formData, mobile: e.target.value})}
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2 md:col-span-2">
//                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Country</label>
//                   <div className="relative">
//                     <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
//                     <input 
//                       type="text" 
//                       className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium"
//                       value={formData.country}
//                       onChange={(e) => setFormData({...formData, country: e.target.value})}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-100">
//                 <button 
//                   type="button"
//                   onClick={() => navigate(-1)}
//                   className="px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   type="submit" 
//                   disabled={loading}
//                   className="flex items-center gap-2 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
//                 >
//                   {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
//                   Save Changes
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SettingsPage;

import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Globe, 
  Phone, 
  Camera, 
  CreditCard, 
  Save, 
  Loader2, 
  ArrowLeft,
  Mail,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../service/api'; 
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '', 
    country: '',
    mobile: '',
    picture: '',
    accountName: ''
  });

  // --- Beautiful Custom Toast Styling ---
  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border-l-4 ${
        type === 'success' ? 'border-emerald-500' : type === 'error' ? 'border-rose-500' : 'border-amber-500'
      }`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              {type === 'success' && <CheckCircle2 className="h-10 w-10 text-emerald-500" />}
              {type === 'error' && <AlertCircle className="h-10 w-10 text-rose-500" />}
              {type === 'warning' && <AlertCircle className="h-10 w-10 text-amber-500" />}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-bold text-slate-900">
                {type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Notice'}
              </p>
              <p className="mt-1 text-sm text-slate-500 font-medium">{message}</p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-slate-100">
          <button onClick={() => toast.dismiss(t.id)} className="w-full p-4 text-sm font-bold text-slate-400 hover:text-slate-600 focus:outline-none">Close</button>
        </div>
      </div>
    ), { duration: 4000 });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.get('/auth/me'); 
        const userData = res.data?.user || {};
        const accountData = res.data?.account || {};

        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          country: userData.country || '',
          mobile: userData.mobile || '',
          picture: userData.picture || '',
          accountName: accountData.name || ''
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
        showToast("Could not load profile data.", "error");
      } finally {
        setFetching(false);
      }
    };
    fetchUserData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast("Please upload a valid image file.", "warning");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        showToast("Image is too heavy. Please use a file under 2MB.", "warning");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, picture: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/auth/settings', formData);
  
      showToast("Profile settings updated successfully! ✨", "success");

      setTimeout(() => {
        window.location.href = '/dashboard'; 
      }, 1500);

    } catch (err: any) {
      console.error("Update error:", err);
      if (err.response?.status === 413) {
        showToast("Server rejected the image size. Try a smaller photo.", "error");
      } else {
        showToast("Update failed. Please try again later.", "error");
      }
      setLoading(false); // Only stop loading if there is an error
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
        <p className="text-slate-500 font-medium tracking-tight">Syncing your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">Back to Dashboard</span>
        </button>

        <div className="bg-white shadow-xl shadow-slate-200/50 rounded-[32px] border border-slate-100 overflow-hidden">
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-black text-slate-800 mb-2">Account Settings</h2>
            <p className="text-slate-500 mb-10">Manage your profile and business information.</p>

            <form onSubmit={handleUpdate} className="space-y-10">
              
              {/* Profile Picture Section */}
              <div className="flex flex-col md:flex-row items-center gap-8 bg-indigo-50/50 p-8 rounded-[24px] border border-indigo-100/50">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
                    {formData.picture ? (
                      <img 
                        src={formData.picture} 
                        className="w-full h-full object-cover"
                        alt="Profile"
                      />
                    ) : (
                      <div className="w-full h-full bg-indigo-500 flex items-center justify-center text-white text-4xl font-black">
                        {formData.name?.charAt(0) || <User size={40} />}
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <Camera className="text-white" size={32} />
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                  />
                </div>
                
                <div className="text-center md:text-left">
                  <h4 className="text-xl font-bold text-slate-800">{formData.name || 'Set Name'}</h4>
                  <p className="text-slate-500 mb-4">{formData.email}</p>
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    Change Photo
                  </button>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="text" 
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email (Locked)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input 
                      type="email" 
                      disabled
                      className="w-full pl-12 pr-4 py-4 bg-slate-100 border border-slate-200 rounded-2xl text-slate-400 cursor-not-allowed font-medium"
                      value={formData.email}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Business/Account Name</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="text" 
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium"
                      value={formData.accountName}
                      onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="text" 
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium"
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Country</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="text" 
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium"
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;