import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SupportedLanguage = 'en' | 'hi';

interface LanguageState {
  language: SupportedLanguage;
  hasChosenLanguage: boolean;
  isLanguageModalOpen: boolean;
  setLanguage: (lang: SupportedLanguage) => void;
  openLanguageModal: () => void;
  closeLanguageModal: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      hasChosenLanguage: true,
      isLanguageModalOpen: false,
      setLanguage: (lang: SupportedLanguage) =>
        set({
          language: lang,
          hasChosenLanguage: true,
          isLanguageModalOpen: false,
        }),
      openLanguageModal: () => set({ isLanguageModalOpen: true }),
      closeLanguageModal: () => set({ isLanguageModalOpen: false }),
    }),
    {
      name: 'carwash_language_preference',
    }
  )
);
