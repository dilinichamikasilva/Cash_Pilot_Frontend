// import { useEffect, useState } from "react";
// import { useAuth } from "../context/authContext";
// import { getMonthlyAllocation } from "../service/budgetService";

// const ViewMonthlyBudget = () => {
//   const { user , loading: authLoading } = useAuth();
//   const accountId = user?.accountId;

//   const [month] = useState(new Date().getMonth() + 1);
//   const [year] = useState(new Date().getFullYear());
//   const [data, setData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if(authLoading) return
//     if (!accountId) {
//         setLoading(false)
//         return
//     }
//     fetchData();
//   }, [accountId , authLoading]);

//   const fetchData = async () => {
//   if (!accountId) return;

//   setLoading(true);
//   try {
//     const response = await getMonthlyAllocation(accountId, month, year);
//     setData(response);
//   } catch (err) {
//     console.error("Fetch monthly allocation error:", err);
//     setData(null);
//   } finally {
//     setLoading(false);
//   }
// };

//   if (!accountId) return <p>No account found.</p>;
//   if (loading) return <p>Loading...</p>;
//   if (!data) return <p>No allocation found.</p>;

//   const { allocation, categories, totals } = data;

//   return (
//     <div className="p-4 max-w-xl mx-auto">
//       <h2 className="text-xl font-bold mb-4">
//         Monthly Budget – {allocation.month}/{allocation.year}
//       </h2>

//       <div className="bg-gray-100 p-4 rounded mb-4">
//         <p><strong>Total Allocated:</strong> Rs. {allocation.totalAllocated}</p>
//         <p><strong>Total Budget Used:</strong> Rs. {totals.allocatedSum}</p>
//         <p><strong>Remaining:</strong> Rs. {totals.remaining}</p>
//       </div>

//       <h3 className="text-lg font-semibold mb-2">Categories</h3>

//       <div className="space-y-3">
//         {categories.map((cat: any) => (
//           <div key={cat.id} className="p-3 border rounded bg-white shadow-sm">
//             <p className="font-medium">{cat.name}</p>
//             <p>Budget: Rs. {cat.budget}</p>
//             <p>Spent: Rs. {cat.spent}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ViewMonthlyBudget;


import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { getMonthlyAllocation } from "../service/budgetService";
import { useSearchParams } from "react-router-dom";

const ViewMonthlyBudget = () => {
  const { user, loading: authLoading } = useAuth();
  const accountId = user?.accountId;

  const [searchParams] = useSearchParams();

  // Read month/year from URL or default
  const initialMonth = Number(searchParams.get("month")) || new Date().getMonth() + 1;
  const initialYear = Number(searchParams.get("year")) || new Date().getFullYear();

  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!accountId) {
      setLoading(false);
      return;
    }
    fetchData(month, year);
  }, [accountId, authLoading]);

  const fetchData = async (m: number, y: number) => {
    if (!accountId) return;
    setLoading(true);
    try {
      const res = await getMonthlyAllocation(accountId, m, y);
      setData(res);
    } catch (err) {
      console.error(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleView = () => {
    fetchData(month, year);
  };

  if (authLoading || loading) return <p>Loading...</p>;
  if (!accountId) return <p>No account found.</p>;
  if (!data) return <p>No allocation found for {month}/{year}</p>;

  const { allocation, categories, totals } = data;

  return (
    <div className="p-4 max-w-xl mx-auto">

      {/* Select Month & Year */}
      <div className="flex gap-3 mb-4">
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="border px-3 py-2 rounded"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border px-3 py-2 rounded"
        >
          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <button
          onClick={handleView}
          className="bg-blue-600 text-white px-4 rounded"
        >
          View
        </button>
      </div>

      {/* Budget Header */}
      <h2 className="text-xl font-bold mb-4">
        Monthly Budget – {allocation.month}/{allocation.year}
      </h2>

      {/* Summary */}
      <div className="bg-gray-100 p-4 rounded mb-4">
        <p><strong>Total Allocated:</strong> Rs. {allocation.totalAllocated}</p>
        <p><strong>Total Spent:</strong> Rs. {totals.allocatedSum}</p>
        <p><strong>Remaining:</strong> Rs. {totals.remaining}</p>
      </div>

      <h3 className="text-lg font-semibold mb-2">Categories</h3>

      <div className="space-y-3">
        {categories.map((cat: any) => (
          <div key={cat.id} className="p-3 border rounded bg-white shadow-sm">
            <p className="font-medium">{cat.name}</p>
            <p>Budget: Rs. {cat.budget}</p>
            <p>Spent: Rs. {cat.spent}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewMonthlyBudget;
