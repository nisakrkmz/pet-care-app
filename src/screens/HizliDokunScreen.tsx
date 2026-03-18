import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Corners, Shadows, FontSize } from '../constants/theme';
import { usePetContext } from '../context/PetContext';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale, moderateScale } from '../utils/responsive';

export const HizliDokunScreen = () => {
  const { aksiyonlar } = usePetContext();
  const navigation = useNavigation<any>();
  
  const [durum, setDurum] = useState<'bekle' | 'simdi' | 'sonuc'>('bekle');
  const [baslamaZamani, setBaslamaZamani] = useState(0);
  const [tepkiSuresi, setTepkiSuresi] = useState(0);
  const scaleRef = useState(new Animated.Value(1))[0];

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
    navigation.popToTop();
  };

  const bgColor = durum === 'simdi' ? Colors.success : Colors.primary;

  return (
    <SafeAreaView 
      style={[styles.base, { backgroundColor: bgColor }]} 
      edges={['top', 'left', 'right', 'bottom']}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Hızlı Dokun!</Text>
      </View>

      <TouchableOpacity 
        activeOpacity={1} 
        style={styles.anaAlan} 
        onPress={dokun}
        disabled={durum === 'sonuc'}
      >
        {durum === 'bekle' && <Text style={styles.mesaj}>Hazır Ol...</Text>}
        {durum === 'simdi' && (
          <Animated.View style={{ transform: [{ scale: scaleRef }] }}>
            <Text style={styles.aksiyonT}>ŞİMDİ DOKUN!</Text>
          </Animated.View>
        )}
        {durum === 'sonuc' && (
          <View style={styles.modal}>
            <Text style={styles.resT}>
              {tepkiSuresi === 999 ? 'Çok Erken!' : `${tepkiSuresi}ms`}
            </Text>
            <Text style={styles.resSub}>
              {tepkiSuresi < 300 ? 'Muhteşem Refleks!' : 'Güzel Deneme!'}
            </Text>
            <TouchableOpacity 
              style={[styles.btn, { backgroundColor: Colors.primary }]} 
              onPress={bitir}
              activeOpacity={0.8}
            >
              <Text style={styles.btnT}>Devam Et</Text>
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
    paddingTop: verticalScale(10), 
    alignItems: 'center' 
  },
  title: { 
    color: 'white', 
    fontSize: FontSize.lg, 
    fontWeight: '900' 
  },
  anaAlan: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  mesaj: { 
    color: 'white', 
    fontSize: moderateScale(28), 
    fontWeight: '800', 
    opacity: 0.6 
  },
  aksiyonT: { 
    color: 'white', 
    fontSize: moderateScale(42), 
    fontWeight: '900' 
  },
  modal: { 
    backgroundColor: 'white', 
    padding: Spacing.xl, 
    borderRadius: Corners.lg, 
    alignItems: 'center', 
    width: '85%',
    ...Shadows.medium 
  },
  resT: { 
    fontSize: FontSize.xl, 
    fontWeight: '900', 
    color: Colors.text 
  },
  resSub: { 
    fontSize: FontSize.sm, 
    color: Colors.textSecondary, 
    marginTop: 10, 
    marginBottom: 20 
  },
  btn: { 
    paddingVertical: 12, 
    paddingHorizontal: 30, 
    borderRadius: 12 
  },
  btnT: { color: 'white', fontWeight: '800' }
});
