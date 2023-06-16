import { create } from "zustand";

interface IWindowState {
  selectedDay: Date;
  dayChange: (date: Date) => void;
}

export const useDayStore = create<IWindowState>((set) => ({
  selectedDay: new Date(),
  dayChange: (date) => set((state) => ({ selectedDay: date })),
}));
