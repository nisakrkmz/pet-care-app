export type HayvanTuru = 'kedi' | 'kopek' | 'tavsan' | 'ejderha';

export type RuhHali = 'Cok Mutlu' | 'Mutlu' | 'Normal' | 'Yorgun' | 'Uzgun' | 'Halsiz';

export interface HayvanIstatistikleri {
  aclik: number;
  mutluluk: number;
  enerji: number;
  saglik: number;
}

export interface Hayvan {
  id: string;
  isim: string;
  tur: HayvanTuru;
  seviye: number;
  tecrube: number;
  istatistikler: HayvanIstatistikleri;
  seri: number; // Günlük seri
}

export interface Basarim {
  id: string;
  baslik: string;
  aciklama: string;
  ikon: string;
  acildi: boolean;
  hedefDeger: number;
  mevcutDeger: number;
  tur: 'bakim' | 'seviye' | 'oyun' | 'seri';
}

export interface KullaniciIstatistikleri {
  toplamBesleme: number;
  toplamOyun: number;
  toplamDinlenme: number;
  toplamPuan: number;
  bestSeri: number;
}

export type RootStackParamList = {
  PetSelection: undefined;
  AnaTab: undefined;
  HaydiBesle: undefined;
  OyunSec: undefined;
  TopYakala: undefined;
  HizliDokun: undefined;
  HafizaEslestirme: undefined;
  Dinlenme: undefined;
};

export type TabParamList = {
  AnaSayfa: undefined;
  Basarimlar: undefined;
  Istatistikler: undefined;
};
