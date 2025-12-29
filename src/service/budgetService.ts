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

export interface UpdateSpendingPayload {
  allocationCategoryId: string;
  actualAmount: number;
}


export interface UpdateSpendingResponse {
  message: string;
  data: {
    categoryName: string;
    budget: number;
    actualSpent: number;
    difference: number;
    status: "OVERSPENT" | "WITHIN_BUDGET";
    alertGenerated: boolean;
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

export const updateCategorySpending = async (payload: UpdateSpendingPayload) => {
  const res = await api.post<UpdateSpendingResponse>(
    "/budget/update-spending", 
    payload
  );
  return res.data;
};

export const addTransaction = async (formData: FormData) => {
  const response = await api.post("/transaction/add-expense", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};


export const getTransactionHistory = async (allocationCategoryId: string) => {
  const response = await api.get(`/transaction/history/${allocationCategoryId}`);
  return response.data;
};


export const deleteTransaction = async (id: string) => {
  const response = await api.delete(`/transaction/delete/${id}`);
  return response.data;
};