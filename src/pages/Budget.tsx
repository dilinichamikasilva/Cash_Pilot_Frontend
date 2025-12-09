import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/authContext";
import api from "../service/api";
import AllocationModal from "../components/AllocationModal";
import DashboardLayout from "../components/DashboardLayout";

type TempAlloc = { id: string; name: string; budget: number };

export default function BudgetPage() {
  const { user } = useAuth();

  const [monthYear, setMonthYear] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const [income, setIncome] = useState<number | "">("");
  const [showModal, setShowModal] = useState(false);
  const [tempAllocations, setTempAllocations] = useState<TempAlloc[]>([]);
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (!user?.accountId) return;

    api.get(`/category/getCategories?accountId=${user.accountId}`)
      .then((res) => setSuggestedCategories(res.data.categories || []))
      .catch(() => setSuggestedCategories([]));
  }, [user]);

  const totalAllocated = useMemo(
    () => tempAllocations.reduce((s, a) => s + a.budget, 0),
    [tempAllocations]
  );

  const remaining = typeof income === "number" ? income - totalAllocated : 0;

  const handleAddTemp = (name: string, budget: number) => {
    const id = Date.now().toString();
    setTempAllocations((s) => [...s, { id, name, budget }]);
  };

  const handleRemoveTemp = (id: string) =>
    setTempAllocations((s) => s.filter((x) => x.id !== id));

  const handleSubmit = async () => {
    if (!user?.accountId) return alert("User not loaded");
    const [year, month] = monthYear.split("-");

    if (!income || Number(income) <= 0)
      return alert("Income required");
    if (totalAllocated > Number(income))
      return alert("Allocated exceeds income");

    const payload = {
      month: Number(month),
      year: Number(year),
      totalAllocated: Number(income),
      categories: tempAllocations.map((t) => ({
        name: t.name,
        budget: t.budget,
      })),
    };

    try {
      await api.post("/budget/monthly-allocations", payload);
      alert("Allocations saved!");
      setTempAllocations([]);
      setShowModal(false);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Save failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen max-w-4xl mx-auto py-8 px-4">

        <h2 className="text-2xl font-semibold mb-4">
          Create Monthly Allocation
        </h2>

        {/* MONTH + INCOME */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm text-slate-600">Month</label>
            <input
              type="month"
              value={monthYear}
              onChange={(e) => setMonthYear(e.target.value)}
              className="mt-1 border rounded-md px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600">Income (LKR)</label>
            <input
              type="number"
              placeholder="150000"
              value={income}
              onChange={(e) =>
                setIncome(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="mt-1 border rounded-md px-3 py-2 w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md"
            >
              Proceed
            </button>

            <div className="text-sm text-slate-600">
              Income: <strong>{income || 0}</strong>
            </div>
          </div>
        </div>

        {/* ALLOCATION SUMMARY */}
        <div className="mt-6 bg-white p-4 rounded border">
          <div className="flex justify-between">
            <div>Total allocated: <strong>{totalAllocated}</strong></div>
            <div>Remaining: <strong>{remaining}</strong></div>
          </div>

          <ul className="mt-3 space-y-2">
            {tempAllocations.map((t) => (
              <li key={t.id} className="flex justify-between items-center border rounded p-2">
                <div>
                  <div className="font-medium">{t.name}</div>
                  <div className="text-sm text-slate-500">{t.budget}</div>
                </div>
                <button
                  className="text-red-600"
                  onClick={() => handleRemoveTemp(t.id)}
                >
                  Remove
                </button>
              </li>
            ))}

            {!tempAllocations.length && (
              <div className="text-sm text-slate-500">No categories added</div>
            )}
          </ul>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="px-3 py-1 border rounded"
            >
              Add category
            </button>

            <button
              onClick={handleSubmit}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Save allocations
            </button>
          </div>
        </div>

        {showModal && (
          <AllocationModal
            onClose={() => setShowModal(false)}
            onAdd={handleAddTemp}
            suggestions={suggestedCategories}
            currentRemaining={remaining}
            accountId={user?.accountId}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
