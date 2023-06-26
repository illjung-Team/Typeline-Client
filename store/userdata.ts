import { create } from "zustand";

interface IWindowState {
  userdata: any;
  getData: (data: any) => void;
  addData: (data: any) => void;
  deleteData: (id: any) => void;
  updatedata: (id: any) => void;
}

export const useDataStore = create<IWindowState>((set) => ({
  userdata: [],
  getData: (data) => set(() => ({ userdata: data })),
  addData: (data) => set(({ userdata }) => ({ userdata: [...userdata, data] })),
  deleteData: (id) =>
    set(({ userdata }) => ({ userdata: userdata.filter((e) => e.id !== id) })),
  updatedata: (id) =>
    set(({ userdata }) => ({ userdata: userdata.filter((e) => e.id !== id) })),
}));
