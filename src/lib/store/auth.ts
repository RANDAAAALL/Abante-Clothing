"use client";
import { create } from "zustand";
import { queryClient } from "@/context/client-providers";

type isAuthenticatedProps = {
  successMessage: string 
}

type AuthState = {
  isAuthenticated: isAuthenticatedProps | null;
  isLoading: boolean; 
}

type AuthActionState = {
  setLoading: () => void;
  resetLoading: () => void;
  setAuthUser: (message: isAuthenticatedProps) => void;
  setClearAuthUser: () => void;
  checkAuthOnLoad: () => Promise<void>; 
}

export const useAuth = create<AuthState & AuthActionState>((set) => ({
  isAuthenticated: null,
  isLoading: true,
  setLoading: () => set({ isLoading: true }),
  resetLoading: () => set({ isLoading: false }),

  checkAuthOnLoad: async () => {
    // first check localStorage for quick restore
    const stored = localStorage.getItem("successMessage");
    if (stored) {
      const parsed = JSON.parse(stored);
      set({ isAuthenticated: parsed, isLoading: false });
      queryClient.invalidateQueries({ queryKey: ['get-cart'] });
      return; // if we have localStorage, use it
    } else {
      set({ isAuthenticated: null, isLoading: false });
      localStorage.removeItem("successMessage");
    }
  },

  setAuthUser: (message) => {
    set({ isAuthenticated: message, isLoading: false });
    if (message) {
      localStorage.setItem("successMessage", JSON.stringify(message));
    } else {
      localStorage.removeItem("successMessage");
    }
  },

    setClearAuthUser: () => {
      set({ isAuthenticated: null, isLoading: false });
      localStorage.removeItem("successMessage");
    },
}));
