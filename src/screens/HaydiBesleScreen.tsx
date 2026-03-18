import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Corners, Shadows, FontSize } from '../constants/theme';
import { usePetContext } from '../context/PetContext';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from '../utils/responsive';
import { METINLER } from '../constants/gameConfig';
import { hayvanGorseliGetir, ruhHaliHesapla } from '../utils/petHelpers';

export const HaydiBesleScreen = () => {
  const { hayvan, aksiyonlar } = usePetContext();
  const navigation = useNavigation<any>();
  const [kapSeviyesi, setKapSeviyesi] = useState(0);
  const [bitti, setBitti] = useState(false);
  const scaleRef = useState(new Animated.Value(1))[0];
  
  const ruhHali = ruhHaliHesapla(hayvan.istatistikler);
  const hayvanEmoji = hayvanGorseliGetir(hayvan.tur, ruhHali, hayvan.seviye);

  const dokun = () => {
    if (kapSeviyesi < 100) {
      setKapSeviyesi(prev => prev + 25);
      Animated.sequence([
        Animated.spring(scaleRef, { toValue: 1.2, useNativeDriver: true }),
        Animated.spring(scaleRef, { toValue: 1, useNativeDriver: true }),
      ]).start();
    }
  };

  useEffect(() => {
    if (kapSeviyesi >= 100 && !bitti) {
      setBitti(true);
      setTimeout(() => {
        aksiyonlar.besle();
        navigation.goBack();
      }, 1200);
    }
  }, [kapSeviyesi, bitti]);

  return (
    <SafeAreaView style={styles.base} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backT}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{hayvan.isim}'ı Besle</Text>
      </View>

      <View style={styles.alan}>
        <Animated.View style={{ transform: [{ scale: scaleRef }] }}>
          <Text style={styles.petE}>{kapSeviyesi >= 100 ? '😋' : hayvanEmoji}</Text>
        </Animated.View>

        <TouchableOpacity 
          activeOpacity={0.8} 
          onPress={dokun} 
          style={styles.kapAlan}
          disabled={bitti}
        >
          <View style={styles.kap}>
            <View style={[styles.yemek, { height: `${kapSeviyesi}%` }]} />
          </View>
          <Text style={styles.ipucu}>
            {kapSeviyesi < 100 ? 'Kabı doldurmak için dokun!' : 'Duman afiyetle yiyor!'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.alt}>
        <View style={styles.bar}>
          <View style={[styles.fill, { width: `${kapSeviyesi}%` }]} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  base: { flex: 1, backgroundColor: Colors.background },
  header: { 
    paddingTop: verticalScale(5),
    paddingBottom: verticalScale(10),
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg
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
    ...Shadows.soft 
  },
  backT: { fontSize: 18, color: Colors.textSecondary },
  title: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.text },
  alan: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  petE: { fontSize: scale(80), marginBottom: verticalScale(40) },
  kapAlan: { alignItems: 'center' },
  kap: { 
    width: scale(100), 
    height: scale(50), 
    backgroundColor: '#EEE', 
    borderBottomLeftRadius: scale(50), 
    borderBottomRightRadius: scale(50), 
    overflow: 'hidden', 
    borderWidth: 2, 
    borderColor: '#DDD' 
  },
  yemek: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#E17055' },
  ipucu: { marginTop: verticalScale(15), fontSize: 13, fontWeight: '700', color: Colors.primary },
  alt: { 
    paddingHorizontal: Spacing.xl, 
    paddingBottom: verticalScale(30) 
  },
  bar: { height: 12, backgroundColor: '#EEE', borderRadius: 6, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: Colors.success }
});
