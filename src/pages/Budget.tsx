import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import CategoryInput from "../components/CategoryInput";
import api from "../service/api";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useAuth } from "../context/authContext";

interface Category {
  _id: string;
  name: string;
  budget: number;
  spent: number;
}

export default function Budget() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [income, setIncome] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [remainingBalance, setRemainingBalance] = useState<number>(0);
  const [allocationId, setAllocationId] = useState<string>("");

  const { user } = useAuth();

  const userId = user?._id;
  const accountId = user?.accounts?.[0]?._id;

  // Fetch current month allocation
  useEffect(() => {
    if (!userId || !accountId) return;

    const fetchData = async () => {
      const month = selectedDate.getMonth() + 1;
      const year = selectedDate.getFullYear();

      try {
        const res = await api.get(`/budget/${userId}/${accountId}/${month}/${year}`);

        if (res.data.allocation) {
          const alloc = res.data.allocation;

          setIncome(alloc.totalAllocated + alloc.remainingBalance);
          setRemainingBalance(alloc.remainingBalance);
          setCategories(res.data.categories);
          setAllocationId(alloc._id);
        } else {
          setCategories([]);
          setAllocationId("");
          setRemainingBalance(0);
        }
      } catch (err) {
        console.log("No allocation yet for this month.");
        setCategories([]);
        setAllocationId("");
        setRemainingBalance(0);
      }
    };

    fetchData();
  }, [selectedDate, userId, accountId]);

  // Add category handler
  const handleAddCategory = async (name: string, budget: number) => {
    if (!allocationId) return;

    try {
      const res = await api.post("/budget/category", {
        monthlyAllocationId: allocationId,
        name,
        budget,
      });

      setCategories([...categories, res.data]);
      setRemainingBalance((prev) => prev - budget);
    } catch (err) {
      console.error("Failed to add category", err);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-4xl font-extrabold text-slate-800 mb-8">
        Budget Planner
      </h1>

      {/* Calendar */}
      <div className="bg-white p-6 rounded-2xl shadow-xl mb-8 max-w-md mx-auto">
        <Calendar
          value={selectedDate}
          onChange={(date: Date) => setSelectedDate(date)}
        />
      </div>

      {/* Income & Remaining Balance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-indigo-600 text-white rounded-2xl shadow-lg">
          <p className="font-semibold text-lg">Monthly Income</p>
        
          <input
            type="number"
            value={income}
            onChange={(e) => {
              const newIncome = Number(e.target.value);
              setIncome(newIncome);

  
              if (categories.length === 0 || remainingBalance === 0) {
                setRemainingBalance(newIncome);
              }
            }}
            className="mt-2 w-full p-2 rounded-lg text-black font-bold"
          />
        </div>

      
        <div className="p-6 rounded-2xl shadow-lg bg-white">
        <p className="font-semibold text-lg">Remaining Balance</p>
        <p className="text-3xl font-bold mt-2">
          {remainingBalance.toLocaleString()} LKR
        </p>

        {/* Progress Bar */}
        <div
          className={`h-4 rounded-full ${
            remainingBalance < income * 0.2
              ? "bg-red-500"
              : remainingBalance < income * 0.5
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
          style={{ width: `${Math.min((remainingBalance / income) * 100, 100)}%` }}
        ></div>

        {/* Warning/Info Text */}
        {remainingBalance / income < 0.2 ? (
          <p className="mt-2 text-sm font-medium text-red-600">
            ⚠️ Remaining balance below 20% of income!
          </p>
        ) : remainingBalance / income < 0.5 ? (
          <p className="mt-2 text-sm font-medium text-yellow-600">
            ⚠️ Less than half of your income remains.
          </p>
        ) : (
          <p className="mt-2 text-sm font-medium text-green-600">
            💡 Your remaining balance is healthy.
          </p>
        )}
      </div>
    </div>

      {/* Add Category */}
      <div className="max-w-2xl mx-auto mb-10">
        <h2 className="text-2xl font-bold mb-4">Categories</h2>

        <CategoryInput onAddCategory={handleAddCategory} />

        {/* Category List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {categories.map((cat) => {
            const pct = cat.budget ? (cat.spent / cat.budget) * 100 : 0;

            return (
              <div key={cat._id} className="p-4 bg-white shadow rounded-2xl">
                <p className="font-semibold text-lg">{cat.name}</p>
                <p className="text-sm text-gray-600">
                  Budget: {cat.budget.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  Spent: {cat.spent.toLocaleString()}
                </p>

                <div className="w-full h-2 bg-gray-200 mt-2 rounded-full">
                  <div
                    className={`h-2 rounded-full ${pct > 80 ? "bg-red-500" : "bg-green-500"}`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
