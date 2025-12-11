import api from "./api"; 

export interface CategoryItem {
  id: string;
  name: string;
  budget: number;
  spent: number;
}

export interface MonthlyAllocationResponse {
  allocation: {
    _id: string;
    month: number;
    year: number;
    totalAllocated: number;
    remainingBalance: number;
  };
  categories: CategoryItem[];
  totals: {
    allocatedSum: number;
    remaining: number;
  };
}

export const getMonthlyAllocation = async (
  accountId: string,
  month: number,
  year: number
) => {
  const res = await api.get<MonthlyAllocationResponse>(
    `/budget/view-monthly-allocations?accountId=${accountId}&month=${month}&year=${year}`
  );
  return res.data;
};
