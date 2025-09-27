import { create } from "zustand";

type MenuBarPropsState = {
    isOpen: boolean;
}

type MenuBarPropsActions = {
    setIsOpen: (isOpen: boolean) => void;
}

export const useMenuBarStore = create<MenuBarPropsState & MenuBarPropsActions>((set) => ({
    isOpen: false,
    setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));