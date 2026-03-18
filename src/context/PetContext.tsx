import React, { createContext, useContext, ReactNode } from 'react';
import { useHayvan } from '../hooks/usePet';
import { Hayvan, KullaniciIstatistikleri, Basarim, HayvanTuru } from '../types';

interface PetContextType {
  hayvan: Hayvan;
  stats: KullaniciIstatistikleri;
  basarimlar: Basarim[];
  aksiyonlar: {
    besle: () => void;
    oyna: (sonuc?: number) => void;
    dinlen: () => void;
  };
  createNewPetData: (isim: string, tur: HayvanTuru) => void;
  isLoading: boolean;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export const PetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const petData = useHayvan();
  return (
    <PetContext.Provider value={petData}>
      {children}
    </PetContext.Provider>
  );
};

export const usePetContext = () => {
  const context = useContext(PetContext);
  if (!context) {
    // Uygulamanın çökmesini (mavi ekran) engellemek için güvenli varsayılan değerler
    return {
      hayvan: { istatistikler: { aclik: 50, mutluluk: 50, enerji: 50, saglik: 50 }, isim: 'Duman', seviye: 1, tecrube: 0 } as any,
      stats: { toplamPuan: 0, bestSeri: 1, toplamBesleme: 0, toplamOyun: 0 } as any,
      basarimlar: [],
      aksiyonlar: { besle: () => {}, oyna: () => {}, dinlen: () => {} },
      createNewPetData: () => {},
      isLoading: false
    };
  }
  return context;
};
