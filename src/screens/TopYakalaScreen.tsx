import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, PanResponder, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, Corners, Shadows } from '../constants/theme';
import { usePetContext } from '../context/PetContext';
import { scale, verticalScale } from '../utils/responsive';
import { useNavigation } from '@react-navigation/native';
import { METINLER } from '../constants/gameConfig';
import { hayvanGorseliGetir, ruhHaliHesapla } from '../utils/petHelpers';

const { width, height } = Dimensions.get('window');
const OYUN_SURESI = 10; 
const OBJE_BOYUTU = scale(32); // 40 -> 32 (küçültüldü)

export const TopYakalaScreen = () => {
  const { hayvan, aksiyonlar } = usePetContext();
  const navigation = useNavigation<any>();
  
  const [skor, setSkor] = useState(0);
  const [kalanSure, setKalanSure] = useState(OYUN_SURESI);
  const [objeler, setObjeler] = useState<{id: number, x: number, y: Animated.Value, currentY: number}[]>([]);
  const [oyunBitti, setOyunBitti] = useState(false);
  
  const petX = useRef(new Animated.Value(width / 2 - scale(35))).current;
  const petXPos = useRef(width / 2 - scale(35));
  const activeObjeler = useRef<{id: number, x: number, y: Animated.Value, currentY: number}[]>([]);
  const oyunAktif = useRef(true);

  useEffect(() => {
    const sub = petX.addListener(({value}) => petXPos.current = value);
    return () => petX.removeListener(sub);
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        const yeniX = gesture.moveX - scale(35);
        if (yeniX > 5 && yeniX < width - scale(75)) {
          petX.setValue(yeniX);
        }
      },
    })
  ).current;

  // Zamanlayıcı
  useEffect(() => {
    const timer = setInterval(() => {
      setKalanSure(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          oyunAktif.current = false;
          setOyunBitti(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Obje oluşturma
  useEffect(() => {
    if (!oyunAktif.current) return;
    const interval = setInterval(() => {
      const id = Date.now();
      const x = Math.random() * (width - OBJE_BOYUTU - 20) + 10;
      const y = new Animated.Value(-OBJE_BOYUTU);
      
      const yeniObje = { id, x, y, currentY: -OBJE_BOYUTU };
      
      y.addListener(({ value }) => {
        yeniObje.currentY = value;
      });

      setObjeler(prev => [...prev, yeniObje]);
      activeObjeler.current = [...activeObjeler.current, yeniObje];

      Animated.timing(y, {
        toValue: height + 50,
        duration: 3000,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          y.removeAllListeners();
          setObjeler(prev => prev.filter(o => o.id !== id));
          activeObjeler.current = activeObjeler.current.filter(o => o.id !== id);
        }
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Çarpışma kontrolü
  useEffect(() => {
    const loop = setInterval(() => {
      if (!oyunAktif.current) return;
      activeObjeler.current.forEach(obj => {
        const valY = obj.currentY || -OBJE_BOYUTU;
        // Pet alt hizası verticalScale(100) olduğu için çarpışma alanını daralttım
        if (valY > height - verticalScale(180) && valY < height - verticalScale(120)) {
          if (obj.x > petXPos.current - 15 && obj.x < petXPos.current + scale(60)) {
            setSkor(s => s + 1);
            obj.y.removeAllListeners();
            setObjeler(prev => prev.filter(o => o.id !== obj.id));
            activeObjeler.current = activeObjeler.current.filter(o => o.id !== obj.id);
          }
        }
      });
    }, 100);
    return () => clearInterval(loop);
  }, []);

  const bitir = () => {
    const carpan = skor > 15 ? 1.5 : (skor > 8 ? 1 : 0.5);
    aksiyonlar.oyna(carpan);
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={styles.base} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" />
      <View style={styles.stats}>
        <View style={styles.statBox}><Text style={styles.sL}>SKOR</Text><Text style={styles.sV}>{skor}</Text></View>
        <View style={styles.statBox}><Text style={styles.sL}>SÜRE</Text><Text style={styles.sV}>{kalanSure}s</Text></View>
      </View>

      <View style={styles.area} {...panResponder.panHandlers}>
        {objeler.map(o => (
          <Animated.View key={o.id} style={[styles.obj, { transform: [{translateX: o.x}, {translateY: o.y}] }]}>
            <Text style={styles.objE}>🧶</Text>
          </Animated.View>
        ))}
        <Animated.View style={[styles.pet, { transform: [{translateX: petX}] }]}>
          <Text style={styles.petE}>{hayvanGorseliGetir(hayvan.tur, ruhHaliHesapla(hayvan.istatistikler), hayvan.seviye)}</Text>
        </Animated.View>
      </View>

      {oyunBitti && (
        <View style={styles.over}>
          <View style={styles.modal}>
            <Text style={styles.mT}>{METINLER.OYUN.SONUC}</Text>
            <Text style={styles.mS}>{skor} Yün Topladın!</Text>
            <TouchableOpacity style={styles.btn} onPress={bitir}>
              <Text style={styles.btnT}>Harika! Devam Et</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  base: { flex: 1, backgroundColor: '#6C5CE7' },
  stats: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: Spacing.md,
    marginTop: verticalScale(5) 
  },
  statBox: { 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    padding: 8, 
    borderRadius: 12, 
    alignItems: 'center', 
    minWidth: 70 
  },
  sL: { color: 'white', fontSize: 9, fontWeight: '800' },
  sV: { color: 'white', fontSize: 18, fontWeight: '900' },
  area: { flex: 1 },
  pet: { 
    position: 'absolute', 
    bottom: verticalScale(100), 
    width: 70, 
    height: 70, 
    alignItems: 'center' 
  },
  petE: { fontSize: 50 },
  obj: { position: 'absolute' },
  objE: { fontSize: 26 },
  over: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: 'white', padding: Spacing.xl, borderRadius: Corners.lg, alignItems: 'center', width: '80%' },
  mT: { fontSize: FontSize.xl, fontWeight: '900', marginBottom: 5, color: Colors.text },
  mS: { fontSize: 14, color: Colors.textSecondary, marginBottom: 20 },
  btn: { backgroundColor: '#6C5CE7', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 12 },
  btnT: { color: 'white', fontWeight: '800' }
});
