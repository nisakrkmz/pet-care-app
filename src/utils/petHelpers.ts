import { HayvanIstatistikleri, RuhHali, HayvanTuru } from '../types';

export const ruhHaliHesapla = (stat: HayvanIstatistikleri): RuhHali => {
  if (stat.saglik < 30) return 'Halsiz';
  if (stat.enerji < 20) return 'Yorgun';
  if (stat.aclik < 20) return 'Uzgun';
  if (stat.mutluluk < 40) return 'Uzgun';
  if (stat.mutluluk > 80 && stat.aclik > 70) return 'Cok Mutlu';
  return 'Normal';
};

export const ruhHaliDetayGetir = (ruh: RuhHali): { emoji: string; renk: string } => {
  switch (ruh) {
    case 'Cok Mutlu': return { emoji: '🤩', renk: '#00B894' };
    case 'Mutlu': return { emoji: '😊', renk: '#55E6C1' };
    case 'Normal': return { emoji: '😐', renk: '#636E72' };
    case 'Yorgun': return { emoji: '😴', renk: '#F1C40F' };
    case 'Uzgun': return { emoji: '😢', renk: '#FF7675' };
    case 'Halsiz': return { emoji: '🤒', renk: '#D63031' };
    default: return { emoji: '😐', renk: '#636E72' };
  }
};

export const hayvanGorseliGetir = (tur: HayvanTuru, ruh: RuhHali, seviye: number = 1): string => {
  // Her hayvan türü için seviye bazında evrim sistemi
  const seviyeEmojileri: Record<number, Record<HayvanTuru, Record<string, string>>> = {
    1: { // Baby
      'kedi': { 'Cok Mutlu': '🐱', 'Halsiz': '😿', 'Yorgun': '😴', 'Uzgun': '😿', 'default': '🐱' },
      'kopek': { 'Cok Mutlu': '🐕', 'Halsiz': '🐕', 'Yorgun': '😴', 'Uzgun': '🐕', 'default': '🐕' },
      'tavsan': { 'Cok Mutlu': '🐰', 'Halsiz': '🐰', 'Yorgun': '😴', 'Uzgun': '🐰', 'default': '🐰' },
      'ejderha': { 'Cok Mutlu': '🐦', 'Halsiz': '🐦', 'Yorgun': '😴', 'Uzgun': '🐦', 'default': '🐦' }
    },
    5: { // Young
      'kedi': { 'Cok Mutlu': '😸', 'Halsiz': '😺', 'Yorgun': '😸', 'Uzgun': '😺', 'default': '😺' },
      'kopek': { 'Cok Mutlu': '🐕', 'Halsiz': '🐕', 'Yorgun': '🐕', 'Uzgun': '🐕', 'default': '🐕' },
      'tavsan': { 'Cok Mutlu': '🐰', 'Halsiz': '🐰', 'Yorgun': '🐰', 'Uzgun': '🐰', 'default': '🐰' },
      'ejderha': { 'Cok Mutlu': '🐦', 'Halsiz': '🐦', 'Yorgun': '🐦', 'Uzgun': '🐦', 'default': '🐦' }
    },
    10: { // Adult
      'kedi': { 'Cok Mutlu': '😻', 'Halsiz': '😸', 'Yorgun': '😺', 'Uzgun': '😺', 'default': '😻' },
      'kopek': { 'Cok Mutlu': '🐕', 'Halsiz': '🐕', 'Yorgun': '🐕', 'Uzgun': '🐕', 'default': '🐕' },
      'tavsan': { 'Cok Mutlu': '🐰', 'Halsiz': '🐰', 'Yorgun': '🐰', 'Uzgun': '🐰', 'default': '🐰' },
      'ejderha': { 'Cok Mutlu': '🐦', 'Halsiz': '🐦', 'Yorgun': '🐦', 'Uzgun': '🐦', 'default': '🐦' }
    },
    15: { // Epic
      'kedi': { 'Cok Mutlu': '🦁', 'Halsiz': '🐯', 'Yorgun': '🦁', 'Uzgun': '🐯', 'default': '🦁' },
      'kopek': { 'Cok Mutlu': '🐺', 'Halsiz': '🐺', 'Yorgun': '🐺', 'Uzgun': '🐺', 'default': '🐺' },
      'tavsan': { 'Cok Mutlu': '🦌', 'Halsiz': '🦌', 'Yorgun': '🦌', 'Uzgun': '🦌', 'default': '🐰' },
      'ejderha': { 'Cok Mutlu': '🦢', 'Halsiz': '🦢', 'Yorgun': '🦢', 'Uzgun': '🦢', 'default': '🦢' }
    },
    20: { // Legendary
      'kedi': { 'Cok Mutlu': '🐉', 'Halsiz': '🦄', 'Yorgun': '🐉', 'Uzgun': '🐉', 'default': '🐉' },
      'kopek': { 'Cok Mutlu': '🐉', 'Halsiz': '🦄', 'Yorgun': '🐉', 'Uzgun': '🦄', 'default': '🐉' },
      'tavsan': { 'Cok Mutlu': '🦄', 'Halsiz': '🦄', 'Yorgun': '🦄', 'Uzgun': '🦄', 'default': '🦄' },
      'ejderha': { 'Cok Mutlu': '🐉', 'Halsiz': '🦄', 'Yorgun': '🐉', 'Uzgun': '🐉', 'default': '🐉' }
    }
  };

  // En uygun seviyeyi bul
  const seviyeler = Object.keys(seviyeEmojileri).map(Number).sort((a, b) => b - a);
  const uygunSeviye = seviyeler.find(s => seviye >= s) || 1;
  const seviyeGorselleri = seviyeEmojileri[uygunSeviye];
  const turGorselleri = seviyeGorselleri[tur] || seviyeGorselleri['kedi'];
  
  return turGorselleri[ruh] || turGorselleri.default;
};

export const clamp = (deger: number, min: number, max: number): number => {
  return Math.min(Math.max(deger, min), max);
};

export const seviyeRengiGetir = (seviye: number): string => {
  if (seviye >= 20) return '#FFD700'; // Gold - Legendary
  if (seviye >= 15) return '#9B59B6'; // Purple - Epic
  if (seviye >= 10) return '#3498DB'; // Blue - Adult
  if (seviye >= 5) return '#2ECC71'; // Green - Young
  return '#95A5A6'; // Gray - Baby
};

export const seviyeParlatmaEfektiGetir = (seviye: number): string => {
  if (seviye >= 20) return 'linear-gradient(45deg, #FFD700, #FFA500, #FFD700)';
  if (seviye >= 15) return 'linear-gradient(45deg, #9B59B6, #8E44AD, #9B59B6)';
  if (seviye >= 10) return 'linear-gradient(45deg, #3498DB, #2980B9, #3498DB)';
  if (seviye >= 5) return 'linear-gradient(45deg, #2ECC71, #27AE60, #2ECC71)';
  return 'linear-gradient(45deg, #95A5A6, #7F8C8D, #95A5A6)';
};

export const sonrakiSeviyeXPHesapla = (seviye: number): number => {
  return Math.floor(100 * Math.pow(1.5, seviye - 1));
};
