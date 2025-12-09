import { useEffect, useMemo, useState } from "react";
import api from "../service/api";

export default function AllocationModal({ 
  onClose, 
  onAdd, 
  suggestions = [], 
  currentRemaining = 0,
  accountId
}:{ 
  onClose: () => void; 
  onAdd: (name: string, budget: number) => void; 
  suggestions?: string[]; 
  currentRemaining?: number;
  accountId?:string;
}) {

  const [selected, setSelected] = useState<string>(""); 
  const [newName, setNewName] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [localSuggestions, setLocalSuggestions] = useState<string[]>(suggestions);

  useEffect(() => setLocalSuggestions(suggestions), [suggestions]);

  const canAdd = () => {
    const am = typeof amount === "number" ? amount : 0;
    return (selected || newName.trim()) && am > 0 && am <= (currentRemaining + am); // allow adding up to remaining
  };



  const handleAdd = async () => {
  const name = selected || newName.trim();
  const budget = Number(amount);
  if (!name || !budget || budget <= 0) return alert("Invalid");

 

  if (!accountId) {
    return alert("Account ID missing – cannot save category");
  }

  try {
    await api.post("/category/saveCategory", { accountId, name });
  } catch (err) {
    console.error("Failed to create global category", err);
  }

  onAdd(name, budget);

  setSelected("");
  setNewName("");
  setAmount("");
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-xl rounded-lg p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Add allocation</h3>
          <button onClick={onClose} className="text-slate-500">Close</button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3">
          <label className="text-sm text-slate-600">Choose existing category</label>
          <select value={selected} onChange={(e) => { setSelected(e.target.value); setNewName(""); }} className="border rounded px-3 py-2">
            <option value="">-- select --</option>
            {localSuggestions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>

          <div className="text-sm text-slate-500 text-center">or</div>

          <label className="text-sm text-slate-600">New category name</label>
          <input value={newName} onChange={(e) => setNewName(e.target.value)} className="border rounded px-3 py-2" placeholder="e.g. Electricity" />

          <label className="text-sm text-slate-600">Amount</label>
          <input value={amount} onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))} type="number" className="border rounded px-3 py-2" />

        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-slate-600">Remaining after add: <strong>{currentRemaining - (typeof amount === "number" ? amount : 0)}</strong></div>
          <div>
            <button onClick={handleAdd} disabled={!canAdd()} className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50">Add</button>
          </div>
        </div>
      </div>
    </div>
  );
}
