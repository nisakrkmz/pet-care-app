# 🐾 Pet Care App

Evcil hayvan bakım oyunu mobil uygulaması. Kediler, köpekler, tavşanlar ve kuşlar için interaktif bakım deneyimi.

## 🔗 Demo ve APK

- 🎥 [YouTube Demo](https://youtube.com/shorts/DYAF-TJheM8?si=YuPtwWexGjm7lbBx)
- 📦 [APK Dosyası](https://expo.dev/artifacts/eas/ukczaJWhuez3UR6K67WEbL.apk)

## 📱 Özellikler

- **🎮 Oyunlar**: Top Yakala, Hızlı Dokun, Hafıza Eşleştirme
- **🍖 Besleme**: Evcil hayvanınızı doyurun ve mutlu edin
- **😴 Dinlenme**: Hayvanınızın enerjisini yenileyin
- **🏆 Başarımlar**: Hedefleri tamamlayın ve rozetler kazanın
- **📊 İstatistikler**: İlerlemenizi takip edin
- **🎨 Temalar**: Kişiselleştirilebilir arayüz

## 🏗️ Proje Yapısı

```
src/
├── components/          # UI Bileşenleri
│   ├── Button.tsx      # Genel buton bileşeni
│   ├── ActionButton.tsx # İkonlu buton
│   ├── Input.tsx       # Form girişi
│   ├── Card.tsx        # Kart bileşeni
│   ├── PetCard.tsx     # Evcil hayvan kartı
│   ├── StatBar.tsx     # İstatistik çubuğu
│   ├── AchievementBadge.tsx # Başım rozeti
│   └── LevelCard.tsx   # Seviye kartı
├── screens/            # Ekranlar
│   ├── LoginScreen.tsx # Giriş ekranı
│   ├── HomeScreen.tsx  # Ana ekran
│   ├── HaydiBesleScreen.tsx # Besleme oyunu
│   ├── OyunSecScreen.tsx # Oyun seçimi
│   ├── TopYakalaScreen.tsx # Top yakalama oyunu
│   ├── HizliDokunScreen.tsx # Hızlı dokunma oyunu
│   ├── HafizaEslestirmeScreen.tsx # Hafıza oyunu
│   ├── DinlenmeScreen.tsx # Dinlenme ekranı
│   ├── AchievementsScreen.tsx # Başarımlar
│   └── ProfileScreen.tsx # Profil
├── navigation/         # Navigasyon
│   └── AppNavigator.tsx # Ana navigasyon
├── context/           # Context API
│   └── PetContext.tsx # Evcil hayvan durumu
├── constants/         # Sabitler
│   ├── theme.ts       # Tema renkleri ve stiller
│   └── gameConfig.ts  # Oyun ayarları
├── utils/             # Yardımcı fonksiyonlar
│   ├── responsive.ts  # Responsive tasarım
│   └── petHelpers.ts  # Pet hesaplamaları
└── types/             # TypeScript tipleri
    └── index.ts       # Ana tipler
```

## 🎨 Tema Sistemi

Uygulama, tutarlı ve responsive bir tasarım için merkezi tema sistemi kullanır:

- **Renkler**: `Colors.primary`, `Colors.success`, `Colors.error` vb.
- **Boşluklar**: `Spacing.sm`, `Spacing.md`, `Spacing.lg` vb.
- **Fontlar**: `FontSize.xs`, `FontSize.md`, `FontSize.lg` vb.
- **Köşeler**: `Corners.sm`, `Corners.md`, `Corners.lg` vb.
- **Gölgeler**: `Shadows.soft`, `Shadows.medium`, `Shadows.premium`

## 📱 Responsive Tasarım

Tüm bileşenler farklı ekran boyutlarına otomatik uyum sağlar:

- `scale()`: Genişlik bazlı ölçeklendirme
- `verticalScale()`: Yükseklik bazlı ölçeklendirme  
- `moderateScale()`: Fontlar için hassas ölçeklendirme

## 🚀 Başlarken

### Gereksinimler

- Node.js 16+
- Expo CLI
- React Native geliştirme ortamı

### Kurulum

```bash
# Depoyu klonlayın
git clone <repository-url>
cd pet

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm start
```

### Çalıştırma

```bash
# Expo Go ile
npm start

# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## 🎮 Oyunlar

### Haydi Besle
- Evcil hayvanınızı besleyin
- Açlık seviyesini yönetin
- Mutluluk puanı kazanın

### Top Yakala
- Ekrana gelen topları yakalayın
- Hız ve refleks geliştirin
- Puan toplayın

### Hafıza Eşleştirme
- Kartları eşleştirin
- Hafızanızı test edin
- Seviye atlayın

### Hızlı Dokun
- Hedeflere hızlıca dokunun
- Zamanla yarışın
- Reaksiyon sürenizi geliştirin

## 🏆 Başarımlar

Sistem şu başarımları içerir:
- **Bakım Başarımları**: Besleme, oyun, dinlenme
- **Seviye Başarımları**: Hayvan seviyesi atlamaları
- **Seri Başarımları**: Günlük aktiviteler
- **Oyun Başarımları**: Oyun içi hedefler

## 🎯 Temel Prensipler

- **Clean Code**: Anlaşılır, modüler kod yapısı
- **Responsive**: Tüm ekran boyutlarına uyum
- **Theme System**: Merkezi stil yönetimi
- **TypeScript**: Tip güvenliği
- **Component-Based**: Yeniden kullanılabilir bileşenler

## 📝 Lisans

Bu proje geliştirme amaçlıdır.

---

**Pet Care App** - Evcil hayvanınızın dijital arkadaşı 🐾
