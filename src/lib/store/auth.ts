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
  checkAuthOnLoad: () => Promise<void>; 
}

export const useAuth = create<AuthState & AuthActionState>((set) => ({
  isAuthenticated: null,
  isLoading: true,
  setLoading: () => set({ isLoading: true }),
  resetLoading: () => set({ isLoading: false }),

  fetchUser: async () => {

    try {
      const res = await fetchWithCsrf(`${MeURL}`);
      if (!res.ok) throw new Error("Not logged in");
      const data = await res.json();
      set({ isAuthenticated: data.successMessage, isLoading: false });
      sessionStorage.setItem("successMessage", JSON.stringify(data.successMessage)); 
    } catch {
      set({ isAuthenticated: null, isLoading: false });
      sessionStorage.removeItem("successMessage");
    }
  },

  checkAuthOnLoad: async () => {
    try {
      // first check sessionStorage for quick restore
      const stored = sessionStorage.getItem("successMessage");
      if (stored) {
        const parsed = JSON.parse(stored);
        set({ isAuthenticated: parsed, isLoading: false });
        return; // if we have sessionStorage, use it
      }

      // If no sessionStorage, verify with server using cookies
      const res = await fetchWithCsrf(`${MeURL}`);
      if (res.ok) {
        const data = await res.json();
        set({ isAuthenticated: data.successMessage, isLoading: false });
        sessionStorage.setItem("successMessage", JSON.stringify(data.successMessage));
      } else {
        throw new Error("Not authenticated");
      }
    } catch {
      set({ isAuthenticated: null, isLoading: false });
      sessionStorage.removeItem("successMessage");
    }
  },

  setAuthUser: (message) => {
    set({ isAuthenticated: message, isLoading: false });
    if (message) {
      sessionStorage.setItem("successMessage", JSON.stringify(message));
    } else {
      sessionStorage.removeItem("successMessage");
    }
  },

  setClearAuthUser: () => {
    set({ isAuthenticated: null, isLoading: false });
    sessionStorage.removeItem("successMessage");
  },
}));