import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Corners, Shadows, FontSize } from '../constants/theme';
import { usePetContext } from '../context/PetContext';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from '../utils/responsive';
import { METINLER } from '../constants/gameConfig';
import { hayvanGorseliGetir, ruhHaliHesapla } from '../utils/petHelpers';
import { HayvanTuru } from '../types';

const { width } = Dimensions.get('window');

// Hayvan türüne göre yemek emojileri
const YEMEKLER: { [key: string]: string[] } = {
  kedi: ['🐟', '🥛', '🍗', '🐟'],
  kopek: ['🦴', '🍖', '🥩', '🦴'],
  tavsan: ['🥕', '🥬', '🍎', '🥕'],
  ejderha: ['🌾', '🌻', '🫘', '🌾'],
};

export const HaydiBesleScreen = () => {
  const { hayvan, aksiyonlar } = usePetContext();
  const navigation = useNavigation<any>();
  const [kapSeviyesi, setKapSeviyesi] = useState(0);
  const [bitti, setBitti] = useState(false);
  const [yiyorAnimasyon, setYiyorAnimasyon] = useState(false);

  const ruhHali = ruhHaliHesapla(hayvan.istatistikler);
  const hayvanEmoji = hayvanGorseliGetir(hayvan.tur, ruhHali, hayvan.seviye);
  const yemekler = YEMEKLER[hayvan.tur] || YEMEKLER.kedi;

  // Animasyonlar
  const petBounce = useRef(new Animated.Value(0)).current;
  const petScale = useRef(new Animated.Value(1)).current;
  const kapShake = useRef(new Animated.Value(0)).current;
  const yemekOpacity = useRef(new Animated.Value(0)).current;
  const sparkleScale = useRef(new Animated.Value(0)).current;

  // Düşen yemek parçacıkları
  const [dusenYemekler, setDusenYemekler] = useState<{id: number, x: number, emoji: string, anim: Animated.Value}[]>([]);

  // Pet nefes alma animasyonu
  useEffect(() => {
    const breath = Animated.loop(
      Animated.sequence([
        Animated.timing(petBounce, { toValue: -8, duration: 1500, useNativeDriver: true }),
        Animated.timing(petBounce, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    );
    breath.start();
    return () => breath.stop();
  }, []);

  const dokun = () => {
    if (bitti) return;
    const yeniSeviye = Math.min(kapSeviyesi + 25, 100);
    setKapSeviyesi(yeniSeviye);

    // Kap sallanma
    Animated.sequence([
      Animated.timing(kapShake, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(kapShake, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(kapShake, { toValue: 4, duration: 60, useNativeDriver: true }),
      Animated.timing(kapShake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();

    // Pet mutlu zıplama
    Animated.sequence([
      Animated.timing(petScale, { toValue: 1.2, duration: 150, useNativeDriver: true }),
      Animated.timing(petScale, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    // Yemek parçacığı düşür
    const id = Date.now();
    const emoji = yemekler[Math.floor(Math.random() * yemekler.length)];
    const x = Math.random() * (width * 0.5) + width * 0.25;
    const anim = new Animated.Value(0);
    setDusenYemekler(prev => [...prev, { id, x, emoji, anim }]);

    Animated.timing(anim, { toValue: 1, duration: 800, useNativeDriver: true }).start(() => {
      setDusenYemekler(prev => prev.filter(y => y.id !== id));
    });
  };

  useEffect(() => {
    if (kapSeviyesi >= 100 && !bitti) {
      setBitti(true);
      setYiyorAnimasyon(true);

      // Sparkle efekti
      Animated.loop(
        Animated.sequence([
          Animated.timing(sparkleScale, { toValue: 1.3, duration: 400, useNativeDriver: true }),
          Animated.timing(sparkleScale, { toValue: 1, duration: 400, useNativeDriver: true }),
        ])
      ).start();

      // Yemek yeme animasyonu
      Animated.sequence([
        Animated.timing(petScale, { toValue: 1.15, duration: 300, useNativeDriver: true }),
        Animated.timing(petScale, { toValue: 0.95, duration: 200, useNativeDriver: true }),
        Animated.timing(petScale, { toValue: 1.1, duration: 300, useNativeDriver: true }),
        Animated.timing(petScale, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();

      setTimeout(() => {
        aksiyonlar.besle();
        navigation.goBack();
      }, 1800);
    }
  }, [kapSeviyesi, bitti]);

  const kapRenk = kapSeviyesi < 50 ? '#FFD93D' : kapSeviyesi < 100 ? '#FF9F43' : '#10B981';

  return (
    <SafeAreaView style={styles.base} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backT}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🍽️ {hayvan.isim}'ı Besle</Text>
      </View>

      {/* Sahne */}
      <View style={styles.sahne}>
        {/* Arka plan dekor */}
        <View style={styles.dekor}>
          <Text style={styles.dekorEmoji}>🏠</Text>
        </View>

        {/* Düşen yemek parçacıkları */}
        {dusenYemekler.map(y => (
          <Animated.Text
            key={y.id}
            style={[styles.dusenYemek, {
              left: y.x,
              opacity: y.anim.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] }),
              transform: [{
                translateY: y.anim.interpolate({ inputRange: [0, 1], outputRange: [-50, 80] })
              }, {
                rotate: y.anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] })
              }]
            }]}
          >
            {y.emoji}
          </Animated.Text>
        ))}

        {/* Sparkle efektler */}
        {bitti && (
          <>
            <Animated.Text style={[styles.sparkle, { left: '20%', top: '30%', transform: [{ scale: sparkleScale }] }]}>✨</Animated.Text>
            <Animated.Text style={[styles.sparkle, { right: '20%', top: '25%', transform: [{ scale: sparkleScale }] }]}>🌟</Animated.Text>
            <Animated.Text style={[styles.sparkle, { left: '35%', top: '20%', transform: [{ scale: sparkleScale }] }]}>⭐</Animated.Text>
          </>
        )}

        {/* Evcil hayvan */}
        <Animated.View style={[styles.petContainer, { transform: [{ translateY: petBounce }, { scale: petScale }] }]}>
          <Text style={styles.petE}>
            {yiyorAnimasyon ? '😋' : hayvanEmoji}
          </Text>
        </Animated.View>

        {/* Yemek kabı */}
        <Animated.View style={[styles.kapWrapper, { transform: [{ translateX: kapShake }] }]}>
          <View style={styles.kapOuter}>
            <View style={styles.kap}>
              <View style={[styles.yemek, { height: `${kapSeviyesi}%`, backgroundColor: kapRenk }]} />
            </View>
            {/* Kap yemek ikonları */}
            {kapSeviyesi > 0 && (
              <View style={styles.kapYemekRow}>
                {yemekler.slice(0, Math.ceil(kapSeviyesi / 25)).map((y, i) => (
                  <Text key={i} style={styles.kapYemekIcon}>{y}</Text>
                ))}
              </View>
            )}
          </View>
          <Text style={styles.kapLabel}>Mama Kabı</Text>
        </Animated.View>
      </View>

      {/* Alt alan */}
      <View style={styles.alt}>
        {/* Progress bar */}
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>🍽️ Doygunluk</Text>
          <Text style={styles.progressPct}>{kapSeviyesi}%</Text>
        </View>
        <View style={styles.bar}>
          <View style={[styles.fill, { width: `${kapSeviyesi}%`, backgroundColor: kapRenk }]} />
        </View>

        {/* Besle butonu */}
        {!bitti ? (
          <TouchableOpacity style={styles.besleBtn} onPress={dokun} activeOpacity={0.8}>
            <Text style={styles.besleBtnIcon}>{yemekler[0]}</Text>
            <Text style={styles.besleBtnText}>Yemek Ver</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.bittiCard}>
            <Text style={styles.bittiEmoji}>😋</Text>
            <Text style={styles.bittiText}>{hayvan.isim} afiyetle yiyor!</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  base: { flex: 1, backgroundColor: '#FFF8F0' },
  header: {
    paddingTop: verticalScale(5),
    paddingBottom: verticalScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  back: {
    position: 'absolute',
    left: Spacing.lg,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.soft,
  },
  backT: { fontSize: 18, color: Colors.textSecondary },
  title: { fontSize: FontSize.lg, fontWeight: '900', color: '#2D1B69' },
  sahne: { flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  dekor: {
    position: 'absolute',
    top: verticalScale(10),
    right: scale(20),
    opacity: 0.15,
  },
  dekorEmoji: { fontSize: 60 },
  dusenYemek: {
    position: 'absolute',
    fontSize: 28,
    zIndex: 10,
  },
  sparkle: {
    position: 'absolute',
    fontSize: 24,
    zIndex: 5,
  },
  petContainer: {
    marginBottom: verticalScale(20),
  },
  petE: { fontSize: scale(90) },
  kapWrapper: { alignItems: 'center' },
  kapOuter: {
    width: scale(130),
    height: scale(65),
    position: 'relative',
  },
  kap: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F0E6D3',
    borderBottomLeftRadius: scale(65),
    borderBottomRightRadius: scale(65),
    borderTopLeftRadius: scale(10),
    borderTopRightRadius: scale(10),
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#D4C4A8',
  },
  yemek: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: scale(60),
    borderBottomRightRadius: scale(60),
  },
  kapYemekRow: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  kapYemekIcon: { fontSize: 16 },
  kapLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
    color: '#A0896C',
  },
  alt: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: verticalScale(30),
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: { fontSize: 13, fontWeight: '700', color: '#2D1B69' },
  progressPct: { fontSize: 13, fontWeight: '800', color: '#F59E0B' },
  bar: {
    height: 14,
    backgroundColor: '#FFF0DB',
    borderRadius: 7,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FFE0B2',
    marginBottom: verticalScale(16),
  },
  fill: { height: '100%', borderRadius: 7 },
  besleBtn: {
    backgroundColor: '#FF9F43',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(14),
    borderRadius: Corners.lg,
    gap: 10,
    ...Shadows.medium,
  },
  besleBtnIcon: { fontSize: 24 },
  besleBtnText: { fontSize: FontSize.md, fontWeight: '900', color: 'white' },
  bittiCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: Corners.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#A5D6A7',
  },
  bittiEmoji: { fontSize: 28 },
  bittiText: { fontSize: FontSize.md, fontWeight: '800', color: '#2E7D32' },
});
