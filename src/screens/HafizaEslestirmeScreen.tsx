import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Corners, Shadows, FontSize } from '../constants/theme';
import { usePetContext } from '../context/PetContext';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from '../utils/responsive';
import { hayvanGorseliGetir, ruhHaliHesapla } from '../utils/petHelpers';
import { HayvanTuru } from '../types';

// Hayvan türüne göre hafıza kartı emojileri
const KART_EMOJILERI: { [key: string]: string[] } = {
  kedi: ['🐱', '🧶', '🐟', '🥛', '🐾', '😺'],
  kopek: ['🐕', '🦴', '🍖', '🎾', '🐾', '🐶'],
  tavsan: ['🐰', '🥕', '🥬', '🌸', '🐾', '🍀'],
  ejderha: ['🐦', '🌻', '🌾', '🪺', '🐾', '🌿'],
};

export const HafizaEslestirmeScreen = () => {
  const { hayvan, aksiyonlar } = usePetContext();
  const navigation = useNavigation<any>();
  const ruhHali = ruhHaliHesapla(hayvan.istatistikler);
  const hayvanEmoji = hayvanGorseliGetir(hayvan.tur, ruhHali, hayvan.seviye);

  const emojiler = KART_EMOJILERI[hayvan.tur] || KART_EMOJILERI.kedi;

  const [kartlar, setKartlar] = useState<string[]>([]);
  const [acikKartlar, setAcikKartlar] = useState<number[]>([]);
  const [eslesmisler, setEslesmisler] = useState<number[]>([]);
  const [hamleSayisi, setHamleSayisi] = useState(0);

  // Flip animasyonu
  const flipAnims = useRef<Animated.Value[]>([]).current;

  useEffect(() => {
    const shuffle = [...emojiler, ...emojiler].sort(() => Math.random() - 0.5);
    setKartlar(shuffle);
    // Animasyon değerleri her kart için
    flipAnims.length = 0;
    shuffle.forEach(() => flipAnims.push(new Animated.Value(0)));
  }, []);

  const kartSec = (index: number) => {
    if (acikKartlar.length === 2 || acikKartlar.includes(index) || eslesmisler.includes(index)) return;

    // Kart açma animasyonu
    if (flipAnims[index]) {
      Animated.spring(flipAnims[index], { toValue: 1, useNativeDriver: true, speed: 20 }).start();
    }

    const yeniAcik = [...acikKartlar, index];
    setAcikKartlar(yeniAcik);

    if (yeniAcik.length === 2) {
      setHamleSayisi(h => h + 1);
      const [ilk, ikinci] = yeniAcik;
      if (kartlar[ilk] === kartlar[ikinci]) {
        setEslesmisler([...eslesmisler, ilk, ikinci]);
        setAcikKartlar([]);
      } else {
        setTimeout(() => {
          // Kapatma animasyonu
          if (flipAnims[ilk]) Animated.timing(flipAnims[ilk], { toValue: 0, duration: 200, useNativeDriver: true }).start();
          if (flipAnims[ikinci]) Animated.timing(flipAnims[ikinci], { toValue: 0, duration: 200, useNativeDriver: true }).start();
          setAcikKartlar([]);
        }, 800);
      }
    }
  };

  const bitir = () => {
    const carpan = hamleSayisi < 10 ? 1.5 : (hamleSayisi < 15 ? 1 : 0.6);
    aksiyonlar.oyna(carpan);
    navigation.goBack();
  };

  const oyunBitti = eslesmisler.length === kartlar.length && kartlar.length > 0;

  return (
    <SafeAreaView style={styles.base} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>✕</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>🧩 Hafıza Eşleştirme</Text>
          <Text style={styles.sub}>{hayvanEmoji} {hayvan.isim} ile oyna</Text>
        </View>
        <View style={styles.hamleBadge}>
          <Text style={styles.hamleText}>{hamleSayisi}</Text>
          <Text style={styles.hamleLabel}>Hamle</Text>
        </View>
      </View>

      <View style={styles.gridContainer}>
        <View style={styles.grid}>
          {kartlar.map((item: string, index: number) => {
            const acik = acikKartlar.includes(index) || eslesmisler.includes(index);
            const eslesmis = eslesmisler.includes(index);
            const animScale = flipAnims[index] ? flipAnims[index].interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.05]
            }) : 1;

            return (
              <Animated.View
                key={index}
                style={{ transform: [{ scale: animScale }] }}
              >
                <TouchableOpacity
                  style={[
                    styles.kart,
                    acik && styles.kartAcik,
                    eslesmis && styles.kartEslesmis,
                  ]}
                  onPress={() => kartSec(index)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.kartT, acik && styles.kartTAcik]}>
                    {acik ? item : '❓'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(eslesmisler.length / (kartlar.length || 1)) * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>
        {eslesmisler.length / 2} / {kartlar.length / 2} eşleşme
      </Text>

      {oyunBitti && (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.mEmoji}>🎉</Text>
            <Text style={styles.mTitle}>Süper Hafıza!</Text>
            <Text style={styles.mSub}>{hamleSayisi} hamlede tamamladın!</Text>
            <Text style={styles.mPet}>{hayvanEmoji} {hayvan.isim} çok sevindi!</Text>
            <TouchableOpacity style={styles.btn} onPress={bitir} activeOpacity={0.8}>
              <Text style={styles.btnT}>🎮 Devam Et</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  base: { flex: 1, backgroundColor: '#FFF8F3' },
  header: {
    paddingTop: verticalScale(8),
    paddingBottom: verticalScale(10),
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.soft,
  },
  backIcon: { fontSize: 18, color: Colors.textSecondary },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '900',
    color: '#2D1B69',
  },
  sub: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
    fontWeight: '600',
  },
  hamleBadge: {
    backgroundColor: '#F0EDFF',
    borderRadius: Corners.md,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  hamleText: { fontSize: FontSize.md, fontWeight: '900', color: '#7C3AED' },
  hamleLabel: { fontSize: 8, fontWeight: '700', color: '#A78BFA' },
  gridContainer: { flex: 1, justifyContent: 'center', padding: Spacing.sm },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: scale(8),
  },
  kart: {
    width: scale(68),
    height: scale(68),
    backgroundColor: '#8B5CF6',
    borderRadius: Corners.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.soft,
  },
  kartAcik: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#DDD6FE',
  },
  kartEslesmis: {
    backgroundColor: '#E8F5E9',
    borderColor: '#81C784',
  },
  kartT: {
    fontSize: scale(26),
    color: 'rgba(255,255,255,0.5)',
  },
  kartTAcik: {
    color: Colors.text,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F0EDFF',
    borderRadius: 4,
    marginHorizontal: Spacing.xl,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: '#A78BFA',
    marginTop: 6,
    marginBottom: verticalScale(20),
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: Spacing.xl,
    borderRadius: Corners.xl,
    alignItems: 'center',
    width: '82%',
    ...Shadows.premium,
  },
  mEmoji: { fontSize: 48, marginBottom: 8 },
  mTitle: {
    fontSize: FontSize.xl,
    fontWeight: '900',
    color: '#2D1B69',
  },
  mSub: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 6,
    fontWeight: '600',
  },
  mPet: {
    fontSize: FontSize.sm,
    color: '#7C3AED',
    marginTop: 4,
    marginBottom: 20,
    fontWeight: '700',
  },
  btn: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: Corners.md,
    ...Shadows.soft,
  },
  btnT: { color: 'white', fontWeight: '900', fontSize: FontSize.md },
});
