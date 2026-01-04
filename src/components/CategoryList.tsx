
type Props = {
  categories: any[];
  remainingBalance: number;
};

export default function CategoryList({ categories, remainingBalance }: Props) {
  const totalAllocated = categories.reduce((acc, c) => acc + c.budget, 0);
  const percentage = totalAllocated / (totalAllocated + remainingBalance);

  return (
    <div className="mt-6">
      <h2 className="font-semibold mb-2">Expenses</h2>
      <ul className="space-y-2">
        {categories.map(c => (
          <li key={c._id} className="flex justify-between border p-2 rounded">
            <span>{c.name}</span>
            <span>{c.budget.toLocaleString()} LKR</span>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <p>Remaining Balance: {remainingBalance.toLocaleString()} LKR</p>
        {percentage > 0.8 ? (
          <p className="text-red-600 font-bold">⚠️ Budget over 80%! Be careful.</p>
        ) : (
          <p className="text-green-600 font-bold">💡 You can save this extra for next month!</p>
        )}
      </div>
    </div>
  );
}
