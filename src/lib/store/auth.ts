"use client";
import { create } from "zustand";
import { fetchWithCsrf } from "../helper/custom-fetch";
import { MeURL } from "../config";

type AuthState = {
  isAuthenticated: string | null;
  isLoading: boolean; 
}

type AuthActionState = {
  setLoading: () => void;
  resetLoading: () => void;
  fetchUser: () => Promise<void>;
  setAuthUser: (message: string) => void;
  setClearAuthUser: () => void;
}

export const useAuth = create<AuthState & AuthActionState>((set) => ({
  isAuthenticated: null,
  isLoading: false,
  setLoading: () => set({ isLoading: true }),
  resetLoading: () => set({ isLoading: false }),

  fetchUser: async () => {
    try {
      const res = await fetchWithCsrf(`${MeURL}`);
      if (!res.ok) throw new Error("Not logged in");
      const data = await res.json();
      set({ isAuthenticated: data.successMessage});
      sessionStorage.setItem("successMessage", JSON.stringify(data.successMessage)); 
    } catch {
      set({ isAuthenticated: null });
      sessionStorage.removeItem("successMessage");
    }
  },

  setAuthUser: (message) => {
    set({ isAuthenticated: message });
    sessionStorage.setItem("successMessage", JSON.stringify(message));
  },

  setClearAuthUser: () => {
    set({ isAuthenticated: null });
    sessionStorage.removeItem("successMessage");
  },
}));
