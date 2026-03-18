import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Shadows, FontSize, Spacing, Corners } from '../constants/theme';
import { usePetContext } from '../context/PetContext';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from '../utils/responsive';
import { hayvanGorseliGetir, ruhHaliHesapla } from '../utils/petHelpers';
import { HayvanTuru } from '../types';

const { width } = Dimensions.get('window');

// Hayvan türüne göre uyku öğeleri
const UYKU_SESLERI: { [key: string]: string } = {
  kedi: 'Mırıl mırıl uyuyor... 🐱',
  kopek: 'Huzurla uyuyor... 🐕',
  tavsan: 'Yuvasında uyuyor... 🐰',
  ejderha: 'Tüneğinde uyuyor... 🐦',
};

export const DinlenmeScreen = () => {
  const { hayvan, aksiyonlar } = usePetContext();
  const navigation = useNavigation<any>();
  const [uyuyor, setUyuyor] = useState(true);
  const [lambacik, setLambacik] = useState(false);
  const [ortulu, setOrtulu] = useState(false);
  const [ninniBasti, setNinniBasti] = useState(false);
  const [enerjiDoldu, setEnerjiDoldu] = useState(false);
  const [enerjiPct, setEnerjiPct] = useState(0);

  const ruhHali = ruhHaliHesapla(hayvan.istatistikler);
  const hayvanEmoji = hayvanGorseliGetir(hayvan.tur, ruhHali, hayvan.seviye);

  // Animasyon değerleri
  const z1 = useRef(new Animated.Value(0)).current;
  const z2 = useRef(new Animated.Value(0)).current;
  const z3 = useRef(new Animated.Value(0)).current;
  const petScale = useRef(new Animated.Value(1)).current;
  const bgOpacity = useRef(new Animated.Value(1)).current;
  const starTwinkle = useRef(new Animated.Value(0.3)).current;
  const moonFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Nefes alma animasyonu
    Animated.loop(
      Animated.sequence([
        Animated.timing(petScale, { toValue: 1.06, duration: 2200, useNativeDriver: true }),
        Animated.timing(petScale, { toValue: 1, duration: 2200, useNativeDriver: true }),
      ])
    ).start();

    // Zzz animasyonları
    const animateZ = (val: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, { toValue: 1, duration: 3000, useNativeDriver: true }),
          Animated.timing(val, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      ).start();
    };
    animateZ(z1, 0);
    animateZ(z2, 1000);
    animateZ(z3, 2000);

    // Yıldız parlaması
    Animated.loop(
      Animated.sequence([
        Animated.timing(starTwinkle, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(starTwinkle, { toValue: 0.3, duration: 1200, useNativeDriver: true }),
      ])
    ).start();

    // Ay sallanması
    Animated.loop(
      Animated.sequence([
        Animated.timing(moonFloat, { toValue: -6, duration: 2500, useNativeDriver: true }),
        Animated.timing(moonFloat, { toValue: 6, duration: 2500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Enerji dolma progress
  useEffect(() => {
    const interval = setInterval(() => {
      setEnerjiPct(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // 5 saniye sonra uyandır
  useEffect(() => {
    const timer = setTimeout(() => {
      setUyuyor(false);
      setEnerjiDoldu(true);
      aksiyonlar.dinlen();
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Ortü ve lamba hızlandırma bonusu
  const handleLamba = () => {
    setLambacik(!lambacik);
    Animated.timing(bgOpacity, {
      toValue: lambacik ? 1 : 0.6,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const renderZ = (val: Animated.Value, size: number) => (
    <Animated.Text
      style={[
        styles.z,
        {
          fontSize: size,
          opacity: val.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1, 0] }),
          transform: [
            { translateY: val.interpolate({ inputRange: [0, 1], outputRange: [0, -verticalScale(90)] }) },
            { translateX: val.interpolate({ inputRange: [0, 1], outputRange: [0, scale(25)] }) },
          ],
        },
      ]}
    >
      💤
    </Animated.Text>
  );

  return (
    <SafeAreaView style={styles.base} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" />

      {/* Gece arka planı */}
      <Animated.View style={[styles.nightOverlay, { opacity: bgOpacity }]} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🌙 {hayvan.isim} Dinleniyor</Text>
        <Text style={styles.sub}>{UYKU_SESLERI[hayvan.tur]}</Text>
      </View>

      {/* Yıldızlar */}
      <Animated.Text style={[styles.starIcon, { top: '12%', left: '15%', opacity: starTwinkle }]}>⭐</Animated.Text>
      <Animated.Text style={[styles.starIcon, { top: '8%', right: '20%', opacity: starTwinkle, fontSize: 14 }]}>✨</Animated.Text>
      <Animated.Text style={[styles.starIcon, { top: '18%', right: '35%', opacity: starTwinkle, fontSize: 10 }]}>⭐</Animated.Text>
      <Animated.Text style={[styles.starIcon, { top: '15%', left: '60%', opacity: starTwinkle, fontSize: 16 }]}>🌟</Animated.Text>

      {/* Ay */}
      <Animated.View style={[styles.moonContainer, { transform: [{ translateY: moonFloat }] }]}>
        <Text style={styles.moonEmoji}>🌙</Text>
      </Animated.View>

      {/* Sahne */}
      <View style={styles.alan}>
        <View style={styles.zK}>
          {renderZ(z1, 20)}
          {renderZ(z2, 28)}
          {renderZ(z3, 36)}
        </View>

        {/* Yatak */}
        <View style={styles.yatakContainer}>
          {/* Örtü */}
          {ortulu && (
            <View style={styles.ortu}>
              <Text style={styles.ortuEmoji}>🛏️</Text>
            </View>
          )}

          {/* Pet */}
          <Animated.View style={{ transform: [{ scale: petScale }] }}>
            <Text style={styles.petE}>
              {uyuyor ? '😴' : (enerjiDoldu ? hayvanEmoji : '😊')}
            </Text>
          </Animated.View>

          {/* Yastık */}
          <View style={styles.yastik}>
            <Text style={styles.yastikEmoji}>🛋️</Text>
          </View>
        </View>

        {/* Lamba efekti */}
        {lambacik && (
          <View style={styles.lambaIsik} />
        )}
      </View>

      {/* Kontrol butonları */}
      <View style={styles.kontrolBar}>
        <TouchableOpacity
          style={[styles.kontrolBtn, lambacik && styles.kontrolBtnActive]}
          onPress={handleLamba}
          activeOpacity={0.7}
        >
          <Text style={styles.kontrolIcon}>{lambacik ? '💡' : '🔦'}</Text>
          <Text style={[styles.kontrolText, lambacik && styles.kontrolTextActive]}>
            {lambacik ? 'Işık Açık' : 'Gece Lambası'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.kontrolBtn, ortulu && styles.kontrolBtnActive]}
          onPress={() => setOrtulu(!ortulu)}
          activeOpacity={0.7}
        >
          <Text style={styles.kontrolIcon}>{ortulu ? '🛏️' : '🧸'}</Text>
          <Text style={[styles.kontrolText, ortulu && styles.kontrolTextActive]}>
            {ortulu ? 'Örtülü' : 'Örtü Ört'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.kontrolBtn, ninniBasti && styles.kontrolBtnActive]}
          onPress={() => setNinniBasti(!ninniBasti)}
          activeOpacity={0.7}
        >
          <Text style={styles.kontrolIcon}>{ninniBasti ? '🎵' : '🎶'}</Text>
          <Text style={[styles.kontrolText, ninniBasti && styles.kontrolTextActive]}>
            {ninniBasti ? 'Ninni Çalıyor' : 'Ninni Çal'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Alt bar - enerji */}
      <View style={styles.footer}>
        <View style={styles.enerjiRow}>
          <Text style={styles.enerjiLabel}>⚡ Enerji Dolumu</Text>
          <Text style={styles.enerjiPct}>{Math.min(enerjiPct, 100)}%</Text>
        </View>
        <View style={styles.enerjiBarBg}>
          <View style={[styles.enerjiBarFill, { width: `${Math.min(enerjiPct, 100)}%` }]} />
        </View>

        {enerjiDoldu && (
          <TouchableOpacity
            style={styles.uyanBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.uyanBtnText}>🌅 Uyan ve Devam Et</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  base: { flex: 1, backgroundColor: '#0F0E2E' },
  nightOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1A1A3E',
    zIndex: -1,
  },
  header: {
    paddingTop: verticalScale(15),
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '900',
    color: '#E8E0FF',
  },
  sub: {
    fontSize: 13,
    color: '#A29BFE',
    marginTop: 5,
    fontWeight: '600',
  },
  starIcon: {
    position: 'absolute',
    fontSize: 18,
    zIndex: 2,
  },
  moonContainer: {
    position: 'absolute',
    top: '10%',
    right: scale(30),
    zIndex: 2,
  },
  moonEmoji: { fontSize: 42 },
  alan: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zK: {
    position: 'absolute',
    top: '25%',
    right: '22%',
    height: 150,
  },
  z: {
    fontWeight: '900',
    position: 'absolute',
  },
  yatakContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  ortu: {
    position: 'absolute',
    bottom: -15,
    zIndex: 5,
  },
  ortuEmoji: { fontSize: 50 },
  petE: {
    fontSize: scale(100),
  },
  yastik: {
    marginTop: -verticalScale(15),
    opacity: 0.5,
  },
  yastikEmoji: { fontSize: 50 },
  lambaIsik: {
    position: 'absolute',
    width: scale(200),
    height: scale(200),
    borderRadius: scale(100),
    backgroundColor: 'rgba(255, 214, 10, 0.08)',
    top: '20%',
  },
  kontrolBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: scale(10),
    paddingHorizontal: Spacing.md,
    marginBottom: verticalScale(15),
  },
  kontrolBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: Corners.md,
    paddingVertical: verticalScale(10),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  kontrolBtnActive: {
    backgroundColor: 'rgba(162, 155, 254, 0.25)',
    borderColor: '#A29BFE',
  },
  kontrolIcon: { fontSize: 22, marginBottom: 4 },
  kontrolText: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
  },
  kontrolTextActive: {
    color: '#E8E0FF',
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: verticalScale(30),
  },
  enerjiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  enerjiLabel: { fontSize: 13, fontWeight: '700', color: '#A29BFE' },
  enerjiPct: { fontSize: 13, fontWeight: '800', color: '#6BCF7F' },
  enerjiBarBg: {
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: verticalScale(14),
  },
  enerjiBarFill: {
    height: '100%',
    backgroundColor: '#6BCF7F',
    borderRadius: 6,
  },
  uyanBtn: {
    backgroundColor: '#A29BFE',
    paddingVertical: verticalScale(14),
    borderRadius: Corners.lg,
    alignItems: 'center',
    ...Shadows.medium,
  },
  uyanBtnText: {
    fontSize: FontSize.md,
    fontWeight: '900',
    color: 'white',
  },
});
