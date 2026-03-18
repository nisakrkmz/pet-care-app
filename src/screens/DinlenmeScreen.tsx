import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Shadows, FontSize, Spacing } from '../constants/theme';
import { usePetContext } from '../context/PetContext';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from '../utils/responsive';
import { hayvanGorseliGetir, ruhHaliHesapla } from '../utils/petHelpers';

export const DinlenmeScreen = () => {
  const { hayvan, aksiyonlar } = usePetContext();
  const navigation = useNavigation<any>();
  const [uyuyor, setUyuyor] = useState(true);
  
  const ruhHali = ruhHaliHesapla(hayvan.istatistikler);
  const hayvanEmoji = hayvanGorseliGetir(hayvan.tur, ruhHali, hayvan.seviye);

  // Animasyon değerleri
  const z1 = useRef(new Animated.Value(0)).current;
  const z2 = useRef(new Animated.Value(0)).current;
  const z3 = useRef(new Animated.Value(0)).current;
  const petScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Nefes alma animasyonu
    Animated.loop(
      Animated.sequence([
        Animated.timing(petScale, { toValue: 1.05, duration: 2000, useNativeDriver: true }),
        Animated.timing(petScale, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    // Zzz animasyon döngüsü
    const animateZ = (val: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(val, { toValue: 1, duration: 3000, useNativeDriver: true }),
          ]),
          Animated.timing(val, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      ).start();
    };

    animateZ(z1, 0);
    animateZ(z2, 1000);
    animateZ(z3, 2000);

    // 5 saniye sonra otomatik dinlen ve geri dön
    const timer = setTimeout(() => {
      setUyuyor(false);
      aksiyonlar.dinlen();
      setTimeout(() => navigation.goBack(), 1000);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const renderZ = (val: Animated.Value, size: number) => (
    <Animated.Text
      style={[
        styles.z,
        {
          fontSize: size,
          opacity: val.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 1, 0] }),
          transform: [
            { translateY: val.interpolate({ inputRange: [0, 1], outputRange: [0, -verticalScale(100)] }) },
            { translateX: val.interpolate({ inputRange: [0, 1], outputRange: [0, scale(30)] }) },
          ],
        },
      ]}
    >
      Z
    </Animated.Text>
  );

  return (
    <SafeAreaView style={styles.base} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>{hayvan.isim} Dinleniyor</Text>
        <Text style={styles.sub}>Huzurlu bir uyku çekiyor...</Text>
      </View>

      <View style={styles.alan}>
        <View style={styles.zK}>
          {renderZ(z1, 24)}
          {renderZ(z2, 34)}
          {renderZ(z3, 44)}
        </View>

        <Animated.View style={{ transform: [{ scale: petScale }] }}>
          <Text style={styles.petE}>{uyuyor ? '😴' : hayvanEmoji}</Text>
        </Animated.View>

        <View style={styles.stars}>
          <Text style={styles.star}>✨</Text>
          <Text style={[styles.star, { top: -40, right: -60 }]}>🌟</Text>
          <Text style={[styles.star, { top: 30, left: -70 }]}>✨</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.moonK}>
          <Text style={styles.moon}>🌙</Text>
        </View>
        <Text style={styles.info}>Enerji doluyor...</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  base: { flex: 1, backgroundColor: '#1A1A2E' }, // Gece mavisi
  header: { 
    paddingTop: verticalScale(20), 
    alignItems: 'center' 
  },
  title: { 
    fontSize: FontSize.lg, 
    fontWeight: '900', 
    color: '#E0E0FF' 
  },
  sub: { 
    fontSize: 13, 
    color: '#A0A0FF', 
    marginTop: 5,
    fontWeight: '600'
  },
  alan: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  zK: { 
    position: 'absolute', 
    top: '30%', 
    right: '25%', 
    height: 150 
  },
  z: { 
    color: '#A29BFE', 
    fontWeight: '900', 
    position: 'absolute' 
  },
  petE: { 
    fontSize: scale(100),
    ...Shadows.soft 
  },
  stars: { 
    position: 'absolute', 
    width: '100%', 
    height: '100%', 
    justifyContent: 'center', 
    alignItems: 'center',
    zIndex: -1
  },
  star: { 
    fontSize: 20, 
    position: 'absolute' 
  },
  footer: { 
    paddingBottom: verticalScale(50), 
    alignItems: 'center' 
  },
  moonK: { 
    width: 60, 
    height: 60, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  moon: { fontSize: 40 },
  info: { 
    color: '#A29BFE', 
    fontWeight: '800', 
    fontSize: 14, 
    marginTop: 10 
  }
});
