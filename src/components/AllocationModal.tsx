// import { useEffect, useMemo, useState } from "react";
// import api from "../service/api";

// export default function AllocationModal({ 
//   onClose, 
//   onAdd, 
//   suggestions = [], 
//   currentRemaining = 0,
//   accountId
// }:{ 
//   onClose: () => void; 
//   onAdd: (name: string, budget: number) => void; 
//   suggestions?: string[]; 
//   currentRemaining?: number;
//   accountId?:string;
// }) {

//   const [selected, setSelected] = useState<string>(""); 
//   const [newName, setNewName] = useState("");
//   const [amount, setAmount] = useState<number | "">("");
//   const [localSuggestions, setLocalSuggestions] = useState<string[]>(suggestions);

//   useEffect(() => setLocalSuggestions(suggestions), [suggestions]);

//   const canAdd = () => {
//     const am = typeof amount === "number" ? amount : 0;
//     return (selected || newName.trim()) && am > 0 && am <= (currentRemaining + am); // allow adding up to remaining
//   };



//   const handleAdd = async () => {
//   const name = selected || newName.trim();
//   const budget = Number(amount);
//   if (!name || !budget || budget <= 0) return alert("Invalid");

 

//   if (!accountId) {
//     return alert("Account ID missing – cannot save category");
//   }

//   try {
//     await api.post("/category/saveCategory", { accountId, name });
//   } catch (err) {
//     console.error("Failed to create global category", err);
//   }

//   onAdd(name, budget);

//   setSelected("");
//   setNewName("");
//   setAmount("");
// };


//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//       <div className="bg-white w-full max-w-xl rounded-lg p-6">
//         <div className="flex justify-between items-center">
//           <h3 className="text-lg font-semibold">Add allocation</h3>
//           <button onClick={onClose} className="text-slate-500">Close</button>
//         </div>

//         <div className="mt-4 grid grid-cols-1 gap-3">
//           <label className="text-sm text-slate-600">Choose existing category</label>
//           <select value={selected} onChange={(e) => { setSelected(e.target.value); setNewName(""); }} className="border rounded px-3 py-2">
//             <option value="">-- select --</option>
//             {localSuggestions.map((s) => <option key={s} value={s}>{s}</option>)}
//           </select>

//           <div className="text-sm text-slate-500 text-center">or</div>

//           <label className="text-sm text-slate-600">New category name</label>
//           <input value={newName} onChange={(e) => setNewName(e.target.value)} className="border rounded px-3 py-2" placeholder="e.g. Electricity" />

//           <label className="text-sm text-slate-600">Amount</label>
//           <input value={amount} onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))} type="number" className="border rounded px-3 py-2" />

//         </div>

//         <div className="mt-4 flex justify-between items-center">
//           <div className="text-sm text-slate-600">Remaining after add: <strong>{currentRemaining - (typeof amount === "number" ? amount : 0)}</strong></div>
//           <div>
//             <button onClick={handleAdd} disabled={!canAdd()} className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50">Add</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useMemo, useState } from "react";
import api from "../service/api";
import { X, Plus, AlertCircle } from "lucide-react";

export default function AllocationModal({ 
  onClose, 
  onAdd, 
  suggestions = [], 
  currentRemaining = 0,
  accountId,
  currency 
}:{ 
  onClose: () => void; 
  onAdd: (name: string, budget: number) => void; 
  suggestions?: string[]; 
  currentRemaining?: number;
  accountId?: string;
  currency: string; 
}) {

  const [selected, setSelected] = useState<string>(""); 
  const [newName, setNewName] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [localSuggestions, setLocalSuggestions] = useState<string[]>(suggestions);

  useEffect(() => setLocalSuggestions(suggestions), [suggestions]);

  const canAdd = () => {
    const am = typeof amount === "number" ? amount : 0;
    // Basic validation: name must exist, amount > 0, and not exceeding current pool
    return (selected || newName.trim()) && am > 0 && am <= currentRemaining;
  };

  const handleAdd = async () => {
    const name = selected || newName.trim();
    const budget = Number(amount);
    
    if (!name || !budget || budget <= 0) return;

    if (!accountId) {
      console.error("Account ID missing");
      return;
    }

    // Save category to backend if it's a new name
    if (newName.trim()) {
      try {
        await api.post("/category/saveCategory", { accountId, name });
      } catch (err) {
        console.error("Failed to create global category", err);
      }
    }

    onAdd(name, budget);
    onClose();
  };

  const remainingAfter = currentRemaining - (typeof amount === "number" ? amount : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Add Allocation</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Existing Categories */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Choose existing category
              </label>
              <select 
                value={selected} 
                onChange={(e) => { setSelected(e.target.value); setNewName(""); }} 
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
              >
                <option value="">-- select --</option>
                {localSuggestions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="flex-shrink mx-4 text-xs font-bold text-slate-300 uppercase">Or</span>
                <div className="flex-grow border-t border-slate-100"></div>
            </div>

            {/* New Category Input */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                New category name
              </label>
              <input 
                value={newName} 
                onChange={(e) => { setNewName(e.target.value); setSelected(""); }} 
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all" 
                placeholder="e.g. Electricity" 
              />
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Amount ({currency})
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">{currency}</span>
                <input 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))} 
                  type="number" 
                  className="w-full bg-slate-50 border-none rounded-2xl pl-16 pr-5 py-3 text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 transition-all" 
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Footer Summary */}
          <div className="mt-8 pt-6 border-t border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm">
              <span className="text-slate-400 font-medium">Remaining: </span>
              <span className={`font-bold ${remainingAfter < 0 ? 'text-rose-500' : 'text-slate-700'}`}>
                {remainingAfter.toLocaleString()} {currency}
              </span>
            </div>
            
            <button 
              onClick={handleAdd} 
              disabled={!canAdd()} 
              className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" /> Add to Budget
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}