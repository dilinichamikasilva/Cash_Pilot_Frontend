import React from "react";

type Props = {
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
};

export default function BudgetCalendar({ selectedDate, setSelectedDate }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(e.target.value));
  };

  return (
    <div>
      <label className="font-semibold mr-2">Select Date:</label>
      <input
        type="date"
        value={selectedDate.toISOString().substring(0, 10)}
        onChange={handleChange}
        className="border px-2 py-1 rounded"
      />
    </div>
  );
}
