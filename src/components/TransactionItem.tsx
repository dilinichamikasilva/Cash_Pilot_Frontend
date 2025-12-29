import { Eye, Trash2, Wallet, Landmark, CreditCard, Receipt } from "lucide-react";

interface Props {
  tx: any;
  onDelete: (id: string) => void;
}

const getMethodIcon = (method: string) => {
  switch (method) {
    case "CASH": return <Wallet size={14} />;
    case "DEBIT_CARD": return <Landmark size={14} />;
    case "CREDIT_CARD": return <CreditCard size={14} />;
    default: return <Receipt size={14} />;
  }
};

export const TransactionItem = ({ tx, onDelete }: Props) => (
  <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-100 transition-colors">
    <div className="flex items-center gap-3">
      {tx.billImage ? (
        <div className="relative group">
          <img src={tx.billImage} alt="bill" className="w-14 h-14 rounded-xl object-cover border-2 border-slate-50 shadow-sm" />
          <a href={tx.billImage} target="_blank" rel="noreferrer" className="absolute inset-0 bg-indigo-600/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-all duration-300">
            <Eye size={16} className="text-white" />
          </a>
        </div>
      ) : (
        <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-slate-300 border-2 border-slate-50"><Receipt size={20} /></div>
      )}
      <div>
        <p className="text-sm font-black text-slate-800 tracking-tight">Rs. {tx.amount.toLocaleString()}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="flex items-center gap-1 text-[9px] font-black text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded uppercase">
            {getMethodIcon(tx.paymentMethod)} {tx.paymentMethod.replace('_', ' ')}
          </span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
            {new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>
    </div>
    
    <div className="flex items-center gap-4">
      {tx.description && (
        <div className="hidden md:block bg-slate-50 px-3 py-1.5 rounded-lg max-w-[150px]">
          <p className="text-[10px] text-slate-500 italic truncate">{tx.description}</p>
        </div>
      )}
      <button 
        onClick={() => onDelete(tx._id)}
        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
      >
        <Trash2 size={16} />
      </button>
    </div>
  </div>
);
