import { Hayvan, Basarim } from '../types';

export const OYUN_AYARLARI = {
  VARSAYILAN_HAYVAN: {
    isim: 'Duman',
    tur: 'kedi' as const,
  },
  
  BASLANGIC_ISTATISTIKLERI: {
    aclik: 70,
    mutluluk: 80,
    enerji: 90,
    saglik: 100,
  },
  
  MAX_DEGER: 100,
  MIN_DEGER: 0,
  
  TECRUBE_BASINA_SEVIYE: 100,
  TECRUBE_CARPANI: 1.5,
  
  DUSUS_ORANLARI: {
    aclik: -1,
    mutluluk: -0.8,
    enerji: -1.2,
  },
  
  AKSIYONLAR: {
    BESLE: { aclik: 20, mutluluk: 5, saglik: 3, xp: 10, puan: 10 },
    DINLEN: { enerji: 20, saglik: 5, mutluluk: 4, xp: 8, puan: 8 },
  },
  
  TICK_SURESI: 15000, // 15 saniyede bir stat düşüşü
};

export const BASARIMLAR_DATA: Basarim[] = [
  {
    id: '1',
    baslik: 'İlk Öğün',
    aciklama: 'Dostunu ilk kez besledin!',
    ikon: '🍼',
    hedefDeger: 1,
    mevcutDeger: 0,
    acildi: false,
    tur: 'bakim',
  },
  {
    id: '2',
    baslik: 'Oyun Arkadaşı',
    aciklama: 'Mini oyunlardan birini tamamladın.',
    ikon: '🎮',
    hedefDeger: 1,
    mevcutDeger: 0,
    acildi: false,
    tur: 'oyun',
  },
  {
    id: '3',
    baslik: 'Mutluluk Ustası',
    aciklama: 'Mutluluk değerini 100\'e çıkardın!',
    ikon: '🌈',
    hedefDeger: 100,
    mevcutDeger: 0,
    acildi: false,
    tur: 'bakim',
  },
  {
    id: '4',
    baslik: 'Usta Bakıcı',
    aciklama: 'Toplam 50 bakım aksiyonu gerçekleştirdin.',
    ikon: '🏆',
    hedefDeger: 50,
    mevcutDeger: 0,
    acildi: false,
    tur: 'bakim',
  },
  {
    id: '5',
    baslik: 'Seviye Atlayan',
    aciklama: 'İlk kez seviye yükselttin!',
    ikon: '📈',
    hedefDeger: 2,
    mevcutDeger: 1,
    acildi: false,
    tur: 'seviye',
  }
];

export const METINLER = {
  ANA_SAYFA: {
    SELAMLAMA: 'Tekrar Hoş Geldin! 👋',
    DURUM_SORUSU: (isim: string) => `${isim} bugün nasıl hissediyor?`,
    HAYATI_DURUMLAR: 'Hayati Durumlar',
    IHTIYACLAR_SUB: 'Dostunun ihtiyaçlarını takip et',
    AKSIYONLAR: 'Aksiyonlar',
    AKSIYONLAR_SUB: 'Onunla ilgilen',
    BESLE: 'Besle',
    OYNA: 'Oyna',
    DINLEN: 'Dinlen',
    SEVIYE_ILERLEMESI: 'Seviye İlerlemesi',
    UYARI: (isim: string) => `⚠️ ${isim} pek iyi hissetmiyor! Onu dinlendir.`,
    SERI: (gun: number) => `${gun} Günlük Seri`,
  },
  BASARIMLAR: {
    BASLIK: 'Başarımlar',
    SUB: 'Rozet kazanmak için görevleri tamamla',
    ACILDI: 'Açıldı',
    TOPLAM: 'Toplam',
  },
  ISTATISTIKLER: {
    BASLIK: 'İstatistiklerin',
    SUB: 'Pet Bakım Uzmanlığı',
    TOPLAM_PUAN: 'Toplam Puan',
    BEST_SERI: 'En İyi Seri',
    TOPLAM_BESLEME: 'Toplam Besleme',
    TOPLAM_OYUN: 'Toplam Oyun',
    PET_SEVIYESI: 'Pet Seviyesi',
    IPUCU_BASLIK: 'Bakıcı İpucu 💡',
    IPUCU_METIN: 'Dostunun enerjisini %20\'nin üzerinde tutmaya çalış. Mutlu petler daha hızlı seviye atlar!',
  },
  FEEDBACK: {
    BESLE_BASARILI: (isim: string) => `${isim} karnını güzelce doyurdu.`,
    BESLE_TOK: 'Şu anda çok aç görünmüyor.',
    DINLEN_BASARILI: 'Güzelce dinlendi ve enerjisini topladı.',
  },
  OYUN: {
    SEC_BASLIK: 'Bir Oyun Seç',
    SEC_SUB: 'Evcil hayvanınla ne oynamak istersin?',
    TOP_YAKALA: 'Top Yakala',
    TOP_YAKALA_SUB: 'Hareket eden topa dokun, heyecanı artır!',
    HIZLI_DOKUN: 'Hızlı Dokun',
    HIZLI_DOKUN_SUB: 'İşaret çıkar çıkmaz dokun, refleksini göster.',
    HAFIZA: 'Hafıza Eşleştirme',
    HAFIZA_SUB: 'Kartları eşleştir, zihnini tazele.',
    SONUC: 'Oyun Bitti!',
    TEBRIKLER: 'Harika oynadınız!',
  }
};
