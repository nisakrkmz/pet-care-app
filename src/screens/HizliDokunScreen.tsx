import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Corners, Shadows, FontSize } from '../constants/theme';
import { usePetContext } from '../context/PetContext';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale, moderateScale } from '../utils/responsive';
import { hayvanGorseliGetir, ruhHaliHesapla } from '../utils/petHelpers';

export const HizliDokunScreen = () => {
  const { hayvan, aksiyonlar } = usePetContext();
  const navigation = useNavigation<any>();

  const ruhHali = ruhHaliHesapla(hayvan.istatistikler);
  const hayvanEmoji = hayvanGorseliGetir(hayvan.tur, ruhHali, hayvan.seviye);
  
  const [durum, setDurum] = useState<'bekle' | 'simdi' | 'sonuc'>('bekle');
  const [baslamaZamani, setBaslamaZamani] = useState(0);
  const [tepkiSuresi, setTepkiSuresi] = useState(0);

  const scaleRef = useRef(new Animated.Value(1)).current;
  const pulseRef = useRef(new Animated.Value(1)).current;
  const petBounce = useRef(new Animated.Value(0)).current;

  // Pet animasyonu
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(petBounce, { toValue: -6, duration: 1200, useNativeDriver: true }),
        Animated.timing(petBounce, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // "Şimdi" durumunda darbe animasyonu
  useEffect(() => {
    if (durum === 'simdi') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseRef, { toValue: 1.15, duration: 300, useNativeDriver: true }),
          Animated.timing(pulseRef, { toValue: 1, duration: 300, useNativeDriver: true }),
        ])
      ).start();
    }
    return () => pulseRef.setValue(1);
  }, [durum]);

  useEffect(() => {
    let timer: any;
    if (durum === 'bekle') {
      const gecikme = Math.random() * 2000 + 1500;
      timer = setTimeout(() => {
        setDurum('simdi');
        setBaslamaZamani(Date.now());
      }, gecikme);
    }
    return () => clearTimeout(timer);
  }, [durum]);

  const dokun = () => {
    if (durum === 'simdi') {
      const bitis = Date.now();
      const sure = bitis - baslamaZamani;
      setTepkiSuresi(sure);
      setDurum('sonuc');
      
      Animated.sequence([
        Animated.spring(scaleRef, { toValue: 1.5, useNativeDriver: true }),
        Animated.spring(scaleRef, { toValue: 1, useNativeDriver: true }),
      ]).start();
    } else if (durum === 'bekle') {
      setTepkiSuresi(999);
      setDurum('sonuc');
    }
  };

  const bitir = () => {
    let carpan = 1;
    if (tepkiSuresi < 300) carpan = 1.5;
    else if (tepkiSuresi < 600) carpan = 1;
    else if (tepkiSuresi === 999) carpan = 0.2;
    else carpan = 0.5;

    aksiyonlar.oyna(carpan);
    navigation.goBack();
  };

  const getResultLabel = () => {
    if (tepkiSuresi === 999) return 'Çok Erken!';
    if (tepkiSuresi < 300) return 'Muhteşem Refleks! 🌟';
    if (tepkiSuresi < 500) return 'Harika! ⚡';
    if (tepkiSuresi < 800) return 'İyi Deneme!';
    return 'Daha Hızlı Olabilirsin!';
  };

  const bgColor = durum === 'simdi' ? '#10B981' : '#6C5CE7';

  return (
    <SafeAreaView 
      style={[styles.base, { backgroundColor: bgColor }]} 
      edges={['top', 'left', 'right', 'bottom']}
    >
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>⚡ Hızlı Dokun!</Text>
        <Text style={styles.headerSub}>{hayvan.isim} seninle oynuyor</Text>
      </View>

      {/* Pet */}
      <Animated.View style={[styles.petArea, { transform: [{ translateY: petBounce }] }]}>
        <Text style={styles.petEmoji}>{hayvanEmoji}</Text>
      </Animated.View>

      {/* Ana alan */}
      <TouchableOpacity 
        activeOpacity={1} 
        style={styles.anaAlan} 
        onPress={dokun}
        disabled={durum === 'sonuc'}
      >
        {durum === 'bekle' && (
          <View style={styles.bekleContainer}>
            <Text style={styles.mesaj}>Hazır Ol...</Text>
            <Text style={styles.mesajSub}>Renk yeşile dönünce hemen dokun!</Text>
          </View>
        )}
        {durum === 'simdi' && (
          <Animated.View style={[styles.simdiContainer, { transform: [{ scale: pulseRef }] }]}>
            <Text style={styles.aksiyonIcon}>👆</Text>
            <Text style={styles.aksiyonT}>ŞİMDİ DOKUN!</Text>
          </Animated.View>
        )}
        {durum === 'sonuc' && (
          <View style={styles.modal}>
            <Text style={styles.mPet}>{hayvanEmoji}</Text>
            <Animated.Text style={[styles.resT, { transform: [{ scale: scaleRef }] }]}>
              {tepkiSuresi === 999 ? '😅' : `${tepkiSuresi}ms`}
            </Animated.Text>
            <Text style={styles.resSub}>{getResultLabel()}</Text>
            <Text style={styles.resPet}>{hayvan.isim} {tepkiSuresi < 500 ? 'çok beğendi!' : 'tekrar deneyelim!'}</Text>
            <TouchableOpacity 
              style={styles.btn} 
              onPress={bitir}
              activeOpacity={0.8}
            >
              <Text style={styles.btnT}>🎮 Devam Et</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  base: { flex: 1 },
  header: { 
    paddingTop: verticalScale(12), 
    alignItems: 'center',
  },
  title: { 
    color: 'white', 
    fontSize: FontSize.lg, 
    fontWeight: '900',
  },
  headerSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 3,
  },
  petArea: {
    alignItems: 'center',
    marginTop: verticalScale(15),
  },
  petEmoji: { fontSize: scale(60) },
  anaAlan: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  bekleContainer: { alignItems: 'center' },
  mesaj: { 
    color: 'white', 
    fontSize: moderateScale(32), 
    fontWeight: '900', 
    opacity: 0.8,
  },
  mesajSub: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
  },
  simdiContainer: { alignItems: 'center' },
  aksiyonIcon: { fontSize: 60, marginBottom: 10 },
  aksiyonT: { 
    color: 'white', 
    fontSize: moderateScale(38), 
    fontWeight: '900',
    letterSpacing: 2,
  },
  modal: { 
    backgroundColor: 'white', 
    padding: Spacing.xl, 
    borderRadius: Corners.xl, 
    alignItems: 'center', 
    width: '85%',
    ...Shadows.premium,
  },
  mPet: { fontSize: 42, marginBottom: 8 },
  resT: { 
    fontSize: FontSize.xxl, 
    fontWeight: '900', 
    color: '#2D1B69',
  },
  resSub: { 
    fontSize: FontSize.md, 
    color: Colors.textSecondary, 
    marginTop: 8, 
    fontWeight: '700',
  },
  resPet: {
    fontSize: FontSize.sm,
    color: '#8B5CF6',
    marginTop: 4,
    marginBottom: 20,
    fontWeight: '600',
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
