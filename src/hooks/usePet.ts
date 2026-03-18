import { useState, useEffect, useCallback, useRef } from 'react';
import { Hayvan, KullaniciIstatistikleri, Basarim, HayvanTuru } from '../types';
import { OYUN_AYARLARI, BASARIMLAR_DATA } from '../constants/gameConfig';
import { sonrakiSeviyeXPHesapla, clamp } from '../utils/petHelpers';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ILK_HAYVAN: Hayvan = {
  id: 'duman-001',
  isim: OYUN_AYARLARI.VARSAYILAN_HAYVAN.isim,
  tur: OYUN_AYARLARI.VARSAYILAN_HAYVAN.tur,
  seviye: 1,
  tecrube: 0,
  istatistikler: OYUN_AYARLARI.BASLANGIC_ISTATISTIKLERI,
  seri: 1,
};

const createNewPet = (isim: string, tur: HayvanTuru): Hayvan => {
  return {
    id: `${tur}-${Date.now()}`,
    isim,
    tur,
    seviye: 1,
    tecrube: 0,
    istatistikler: OYUN_AYARLARI.BASLANGIC_ISTATISTIKLERI,
    seri: 1,
  };
};

const ILK_ISTATISTIKLER: KullaniciIstatistikleri = {
  toplamBesleme: 0,
  toplamOyun: 0,
  toplamDinlenme: 0,
  toplamPuan: 0,
  bestSeri: 1,
};

export const useHayvan = () => {
  const [hayvan, setHayvan] = useState<Hayvan>(ILK_HAYVAN);
  const [stats, setStats] = useState<KullaniciIstatistikleri>(ILK_ISTATISTIKLER);
  const [basarimlar, setBasarimlar] = useState<Basarim[]>(BASARIMLAR_DATA);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved pet data on mount
  useEffect(() => {
    loadPetData();
  }, []);

  const loadPetData = async () => {
    try {
      const savedPetData = await AsyncStorage.getItem('petData');
      if (savedPetData) {
        const { hayvan: savedHayvan, stats: savedStats } = JSON.parse(savedPetData);
        setHayvan(savedHayvan);
        setStats(savedStats);
      }
    } catch (error) {
      console.log('No saved pet data found, using default');
    } finally {
      setIsLoading(false);
    }
  };

  const savePetData = async (newHayvan: Hayvan, newStats: KullaniciIstatistikleri) => {
    try {
      await AsyncStorage.setItem('petData', JSON.stringify({
        hayvan: newHayvan,
        stats: newStats
      }));
    } catch (error) {
      console.log('Error saving pet data:', error);
    }
  };

  const createNewPetData = useCallback((isim: string, tur: HayvanTuru) => {
    const newHayvan = createNewPet(isim, tur);
    setHayvan(newHayvan);
    savePetData(newHayvan, ILK_ISTATISTIKLER);
  }, []);

  // Zamanla stat düşüşü
  useEffect(() => {
    const interval = setInterval(() => {
      setHayvan(prev => ({
        ...prev,
        istatistikler: {
          aclik: clamp(prev.istatistikler.aclik + OYUN_AYARLARI.DUSUS_ORANLARI.aclik, 0, 100),
          mutluluk: clamp(prev.istatistikler.mutluluk + OYUN_AYARLARI.DUSUS_ORANLARI.mutluluk, 0, 100),
          enerji: clamp(prev.istatistikler.enerji + OYUN_AYARLARI.DUSUS_ORANLARI.enerji, 0, 100),
          saglik: prev.istatistikler.aclik < 15 || prev.istatistikler.enerji < 15 
            ? clamp(prev.istatistikler.saglik - 3, 0, 100) 
            : clamp(prev.istatistikler.saglik + 1, 0, 100),
        }
      }));
    }, OYUN_AYARLARI.TICK_SURESI);
    return () => clearInterval(interval);
  }, []);

  const tecrubeKazan = useCallback((miktar: number) => {
    setHayvan(prev => {
      let yeniXP = prev.tecrube + miktar;
      let yeniSeviye = prev.seviye;
      let gerekXP = sonrakiSeviyeXPHesapla(yeniSeviye);

      while (yeniXP >= gerekXP) {
        yeniXP -= gerekXP;
        yeniSeviye += 1;
        gerekXP = sonrakiSeviyeXPHesapla(yeniSeviye);
      }

      const newHayvan = { ...prev, tecrube: yeniXP, seviye: yeniSeviye };
      return newHayvan;
    });
    setStats(prev => {
      const newStats = { ...prev, toplamPuan: prev.toplamPuan + miktar };
      return newStats;
    });
  }, []);

  const basarimlariKontrolEt = useCallback((currentStats: KullaniciIstatistikleri, currentHayvan: Hayvan) => {
    setBasarimlar(prev => prev.map(b => {
      if (b.acildi) return b;
      
      let mev = 0;
      switch (b.tur) {
        case 'bakim':
          if (b.id === '1') mev = currentStats.toplamBesleme;
          if (b.id === '3') mev = currentHayvan.istatistikler.mutluluk;
          if (b.id === '4') mev = currentStats.toplamBesleme + currentStats.toplamDinlenme;
          break;
        case 'oyun':
          mev = currentStats.toplamOyun;
          break;
        case 'seviye':
          mev = currentHayvan.seviye;
          break;
        case 'seri':
          mev = currentHayvan.seri;
          break;
      }

      const acildi = mev >= b.hedefDeger;
      return { ...b, mevcutDeger: mev, acildi };
    }));
  }, []);

  const besle = useCallback(() => {
    const etki = OYUN_AYARLARI.AKSIYONLAR.BESLE;
    setHayvan(prev => {
      const newHayvan = {
        ...prev,
        istatistikler: {
          ...prev.istatistikler,
          aclik: clamp(prev.istatistikler.aclik + etki.aclik, 0, 100),
          mutluluk: clamp(prev.istatistikler.mutluluk + etki.mutluluk, 0, 100),
          saglik: clamp(prev.istatistikler.saglik + etki.saglik, 0, 100),
        }
      };
      return newHayvan;
    });
    tecrubeKazan(etki.xp);
    setStats(prev => {
      const newStats = { ...prev, toplamBesleme: prev.toplamBesleme + 1 };
      return newStats;
    });
  }, [tecrubeKazan]);

  const oyna = useCallback((sonucMiktari = 1) => {
    // Oyun sonucuna göre değişken ödül
    const xpRef = 20 * sonucMiktari;
    const mutlulukRef = 15 * sonucMiktari;
    
    setHayvan(prev => {
      const newHayvan = {
        ...prev,
        istatistikler: {
          ...prev.istatistikler,
          mutluluk: clamp(prev.istatistikler.mutluluk + mutlulukRef, 0, 100),
          enerji: clamp(prev.istatistikler.enerji - 15, 0, 100),
          aclik: clamp(prev.istatistikler.aclik - 5, 0, 100),
        }
      };
      return newHayvan;
    });
    tecrubeKazan(xpRef);
    setStats(prev => {
      const newStats = { ...prev, toplamOyun: prev.toplamOyun + 1 };
      return newStats;
    });
  }, [tecrubeKazan]);

  const dinlen = useCallback(() => {
    const etki = OYUN_AYARLARI.AKSIYONLAR.DINLEN;
    setHayvan(prev => {
      const newHayvan = {
        ...prev,
        istatistikler: {
          ...prev.istatistikler,
          enerji: clamp(prev.istatistikler.enerji + etki.enerji, 0, 100),
          saglik: clamp(prev.istatistikler.saglik + etki.saglik, 0, 100),
          mutluluk: clamp(prev.istatistikler.mutluluk + etki.mutluluk, 0, 100),
        }
      };
      return newHayvan;
    });
    tecrubeKazan(etki.xp);
    setStats(prev => {
      const newStats = { ...prev, toplamDinlenme: prev.toplamDinlenme + 1 };
      return newStats;
    });
  }, [tecrubeKazan]);

  useEffect(() => {
    basarimlariKontrolEt(stats, hayvan);
  }, [stats, hayvan, basarimlariKontrolEt]);

  // Save data whenever it changes
  useEffect(() => {
    if (!isLoading) {
      savePetData(hayvan, stats);
    }
  }, [hayvan, stats, isLoading]);

  return { hayvan, stats, basarimlar, aksiyonlar: { besle, oyna, dinlen }, createNewPetData, isLoading };
};
