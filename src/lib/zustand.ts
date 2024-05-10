// TODO improve naming

import { create } from "zustand";
import { type TCreateFormSchema } from "./utils";

type TCreateFormStore = {
  data: Partial<TCreateFormSchema>;
  setData: (newData: Partial<TCreateFormSchema>) => void;
};

export const createFormStore = create<TCreateFormStore>((set, get) => ({
  data: {},
  setData: (newData) => {
    set({ data: newData });
  },
}));
