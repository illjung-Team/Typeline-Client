import { create } from "zustand";

interface IWindowState {
  userid: string;
  getId: (data: string) => void;
  resetId: (data: string) => void;
}

export const useIdStore = create<IWindowState>((set) => ({
  userid: "",
  getId: (id) => set(() => ({ userid: id })),
  resetId: (id) => set(() => ({ userid: "" })),
}));
