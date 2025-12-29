import { useEffect, useState } from "react";
import { History } from "lucide-react";
import { getTransactionHistory, deleteTransaction } from "../service/budgetService";
import { TransactionItem } from "./TransactionItem";

interface Props {
  allocationCategoryId: string;
  refreshTrigger: number;
  onBudgetUpdate: () => void;
}

export const TransactionHistory = ({ allocationCategoryId, refreshTrigger, onBudgetUpdate }: Props) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getTransactionHistory(allocationCategoryId);
      setHistory(data.transactions || []);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchHistory(); 
  }, [allocationCategoryId, refreshTrigger]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this transaction and refund the budget?")) return;
    
    try {
     
      await deleteTransaction(id); 
      
      setHistory((prev) => prev.filter((tx) => tx._id !== id));
      
      if (onBudgetUpdate) {
        onBudgetUpdate(); 
      }
    } catch (err) {
      alert("Delete failed. Please try again.");
    }
  };

  if (loading) return <div className="p-8 text-center text-xs animate-pulse text-slate-400 font-bold uppercase tracking-widest">Fetching Proofs...</div>;

  return (
    <div className="mt-6 pt-6 border-t-2 border-dashed border-slate-100 space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <History size={12} /> Transaction Proofs
        </h4>
        <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-2 py-0.5 rounded-md">
          {history.length} {history.length === 1 ? 'Entry' : 'Entries'}
        </span>
      </div>

      {history.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dotted border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-400 font-medium italic">
          No receipts uploaded.
        </div>
      ) : (
        <div className="grid gap-3">
          {history.map((tx) => (
            <TransactionItem key={tx._id} tx={tx} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};