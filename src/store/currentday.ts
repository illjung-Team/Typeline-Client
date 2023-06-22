import { create } from "zustand";

interface IWindowState {
  selectedDay: Date;
  dayChange: (date: Date) => void;
  getdayparams: any;
}

export const useDayStore = create<IWindowState>((set, get) => ({
  selectedDay: new Date(),
  dayChange: (date) => set((state) => ({ selectedDay: date })),
  getdayparams: () => {
    const selectedDay = get().selectedDay;
    return {
      yyyy: String(selectedDay.getFullYear()),
      mm: String(selectedDay.getMonth() + 1),
      dd: String(selectedDay.getDate()),
    };
  },
}));
