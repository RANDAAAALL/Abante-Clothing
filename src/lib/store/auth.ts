"use client";
import { create } from "zustand";
import { fetchWithCsrf } from "../helper/custom-fetch";
import { MeURL } from "../config";
import { QueryClient } from "@tanstack/react-query";
import { queryClient } from "@/context/client-providers";

type AuthState = {
  isAuthenticated: string | null;
  isLoading: boolean; 
}

type AuthActionState = {
  setLoading: () => void;
  resetLoading: () => void;
  setAuthUser: (message: string) => void;
  setClearAuthUser: () => void;
  checkAuthOnLoad: () => Promise<void>; 
}

export const useAuth = create<AuthState & AuthActionState>((set) => ({
  isAuthenticated: null,
  isLoading: true,
  setLoading: () => set({ isLoading: true }),
  resetLoading: () => set({ isLoading: false }),

  checkAuthOnLoad: async () => {
    try {
      // first check localStorage for quick restore
      const stored = localStorage.getItem("successMessage");
      if (stored) {
        const parsed = JSON.parse(stored);
        set({ isAuthenticated: parsed, isLoading: false });
        return; // if we have localStorage, use it
      }
      
      // If no localStorage, verify with server using cookies
      const res = await fetchWithCsrf(`${MeURL}`);
      if (res.ok) {
        const data = await res.json();
        set({ isAuthenticated: data.successMessage, isLoading: false });
        localStorage.setItem("successMessage", JSON.stringify(data.successMessage));
        queryClient.invalidateQueries({ queryKey: ["get-cart"] });
      } else {
        throw new Error("Not authenticated");
      }
    } catch {
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