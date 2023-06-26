import { create } from "zustand";

interface IWindowState {
  selectedMonth: Date;
  monthChange: (date: Date) => void;
  getmonthparams: any;
}

export const useMonthStore = create<IWindowState>((set, get) => ({
  selectedMonth: new Date(),
  monthChange: (date) => set((state) => ({ selectedMonth: date })),
  getmonthparams: () => {
    const selectedMonth = get().selectedMonth;
    return {
      yyyy: String(selectedMonth.getFullYear()),
      mm: String(selectedMonth.getMonth() + 1),
    };
  },
}));
