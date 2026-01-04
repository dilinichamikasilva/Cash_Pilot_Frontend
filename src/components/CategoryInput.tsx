import { useState } from "react";

type Props = {
  onAddCategory: (name: string, budget: number) => void;
};

export default function CategoryInput({ onAddCategory }: Props) {
  const [name, setName] = useState("");
  const [budget, setBudget] = useState<number>(0);

  const handleAdd = () => {
    if (name && budget > 0) {
      onAddCategory(name, budget);
      setName("");
      setBudget(0);
    }
  };

  return (
    <div className="flex gap-2 mt-4">
      <input
        type="text"
        placeholder="Category Name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="border px-2 py-1 rounded"
      />
      <input
        type="number"
        placeholder="Amount"
        value={budget}
        onChange={e => setBudget(Number(e.target.value))}
        className="border px-2 py-1 rounded"
      />
      <button onClick={handleAdd} className="bg-indigo-500 text-white px-4 rounded">
        Add
      </button>
    </div>
  );
}
