import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, PanResponder, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, Corners, Shadows } from '../constants/theme';
import { usePetContext } from '../context/PetContext';
import { scale, verticalScale } from '../utils/responsive';
import { useNavigation } from '@react-navigation/native';
import { METINLER } from '../constants/gameConfig';
import { hayvanGorseliGetir, ruhHaliHesapla } from '../utils/petHelpers';
import { HayvanTuru } from '../types';

const { width, height } = Dimensions.get('window');
const OYUN_SURESI = 10; 
const OBJE_BOYUTU = scale(32);

// Hayvan türüne göre düşen objeler
const DUSEN_OBJELER: { [key: string]: string[] } = {
  kedi: ['🧶', '🐟', '🥛', '🐁'],
  kopek: ['🦴', '🎾', '🍖', '🥩'],
  tavsan: ['🥕', '🥬', '🍎', '🌸'],
  ejderha: ['🌻', '🌾', '🫘', '🪱'],
};

const DUSEN_MESAJ: { [key: string]: string } = {
  kedi: 'Yün Topladın!',
  kopek: 'Kemik Topladın!',
  tavsan: 'Havuç Topladın!',
  ejderha: 'Tohum Topladın!',
};

export const TopYakalaScreen = () => {
  const { hayvan, aksiyonlar } = usePetContext();
  const navigation = useNavigation<any>();
  
  const ruhHali = ruhHaliHesapla(hayvan.istatistikler);
  const hayvanEmoji = hayvanGorseliGetir(hayvan.tur, ruhHali, hayvan.seviye);
  const objeler_liste = DUSEN_OBJELER[hayvan.tur] || DUSEN_OBJELER.kedi;
  const sonMesaj = DUSEN_MESAJ[hayvan.tur] || 'Topladın!';

  const [skor, setSkor] = useState(0);
  const [kalanSure, setKalanSure] = useState(OYUN_SURESI);
  const [objeler, setObjeler] = useState<{id: number, x: number, y: Animated.Value, currentY: number, emoji: string}[]>([]);
  const [oyunBitti, setOyunBitti] = useState(false);
  
  const petX = useRef(new Animated.Value(width / 2 - scale(35))).current;
  const petXPos = useRef(width / 2 - scale(35));
  const activeObjeler = useRef<{id: number, x: number, y: Animated.Value, currentY: number, emoji: string}[]>([]);
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
      const emoji = objeler_liste[Math.floor(Math.random() * objeler_liste.length)];
      
      const yeniObje = { id, x, y, currentY: -OBJE_BOYUTU, emoji };
      
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
    navigation.goBack();
  };

  // Süre azaldıkça renkler
  const timerColor = kalanSure <= 3 ? '#FF6B6B' : kalanSure <= 6 ? '#FFD93D' : '#FFFFFF';

  return (
    <SafeAreaView style={styles.base} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" />

      {/* Skor paneli */}
      <View style={styles.stats}>
        <View style={styles.statBox}>
          <Text style={styles.sL}>SKOR</Text>
          <Text style={styles.sV}>{skor}</Text>
        </View>
        <View style={styles.petNameBadge}>
          <Text style={styles.petNameEmoji}>{hayvanEmoji}</Text>
          <Text style={styles.petNameText}>{hayvan.isim}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.sL}>SÜRE</Text>
          <Text style={[styles.sV, { color: timerColor }]}>{kalanSure}s</Text>
        </View>
      </View>

      {/* Süre barı */}
      <View style={styles.timerBar}>
        <View style={[styles.timerFill, { width: `${(kalanSure / OYUN_SURESI) * 100}%`, backgroundColor: kalanSure <= 3 ? '#FF6B6B' : '#A29BFE' }]} />
      </View>

      <View style={styles.area} {...panResponder.panHandlers}>
        {objeler.map(o => (
          <Animated.View key={o.id} style={[styles.obj, { transform: [{translateX: o.x}, {translateY: o.y}] }]}>
            <Text style={styles.objE}>{o.emoji}</Text>
          </Animated.View>
        ))}
        <Animated.View style={[styles.pet, { transform: [{translateX: petX}] }]}>
          <Text style={styles.petE}>{hayvanEmoji}</Text>
        </Animated.View>
      </View>

      {oyunBitti && (
        <View style={styles.over}>
          <View style={styles.modal}>
            <Text style={styles.mPetEmoji}>{hayvanEmoji}</Text>
            <Text style={styles.mT}>{METINLER.OYUN.SONUC}</Text>
            <Text style={styles.mS}>{skor} {sonMesaj}</Text>
            <Text style={styles.mPetMsg}>{hayvan.isim} {skor > 10 ? 'çok mutlu oldu! 🎉' : 'eğlendi! 😊'}</Text>
            <TouchableOpacity style={styles.btn} onPress={bitir} activeOpacity={0.8}>
              <Text style={styles.btnT}>🎮 Harika! Devam Et</Text>
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
    alignItems: 'center',
    padding: Spacing.md,
    paddingTop: verticalScale(5),
  },
  statBox: { 
    backgroundColor: 'rgba(255,255,255,0.15)', 
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: Corners.md, 
    alignItems: 'center', 
    minWidth: 70,
  },
  sL: { color: 'rgba(255,255,255,0.7)', fontSize: 9, fontWeight: '800' },
  sV: { color: 'white', fontSize: 20, fontWeight: '900' },
  petNameBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Corners.round,
    gap: 6,
  },
  petNameEmoji: { fontSize: 20 },
  petNameText: { color: 'white', fontSize: 12, fontWeight: '800' },
  timerBar: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: Spacing.md,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 5,
  },
  timerFill: {
    height: '100%',
    borderRadius: 3,
  },
  area: { flex: 1 },
  pet: { 
    position: 'absolute', 
    bottom: verticalScale(100), 
    width: 70, 
    height: 70, 
    alignItems: 'center',
  },
  petE: { fontSize: 50 },
  obj: { position: 'absolute' },
  objE: { fontSize: 28 },
  over: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
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
  mPetEmoji: { fontSize: 50, marginBottom: 8 },
  mT: { fontSize: FontSize.xl, fontWeight: '900', color: '#2D1B69' },
  mS: { fontSize: FontSize.md, color: Colors.textSecondary, marginTop: 6, fontWeight: '700' },
  mPetMsg: {
    fontSize: FontSize.sm,
    color: '#8B5CF6',
    marginTop: 4,
    marginBottom: 20,
    fontWeight: '600',
  },
  btn: { 
    backgroundColor: '#6C5CE7', 
    paddingVertical: 14, 
    paddingHorizontal: 30, 
    borderRadius: Corners.md,
    ...Shadows.soft,
  },
  btnT: { color: 'white', fontWeight: '900', fontSize: FontSize.md },
});
