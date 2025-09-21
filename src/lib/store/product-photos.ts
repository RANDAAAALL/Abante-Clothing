import { create } from "zustand";

type PhotoPropstate = {
    isOpen: boolean;
}

type PhotoPropsActions = {
    openPhotoModal: () => void;
    closePhotoModal: () => void;
}

export const usePhotoModal = create<PhotoPropstate & PhotoPropsActions>((set) => ({
    isOpen: false,
    openPhotoModal: () => set({ isOpen: true }),
    closePhotoModal: () => set({ isOpen: false }),
}))