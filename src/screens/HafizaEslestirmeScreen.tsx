import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Corners, Shadows, FontSize } from '../constants/theme';
import { usePetContext } from '../context/PetContext';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from '../utils/responsive';

const EMOJILER = ['🐱', '🧶', '🐟', '⚽', '🍕', '🏠'];

export const HafizaEslestirmeScreen = () => {
  const { aksiyonlar } = usePetContext();
  const navigation = useNavigation<any>();

  const [kartlar, setKartlar] = useState<string[]>([]);
  const [acikKartlar, setAcikKartlar] = useState<number[]>([]);

  useEffect(() => {
    const shuffle = [...EMOJILER, ...EMOJILER].sort(() => Math.random() - 0.5);
    setKartlar(shuffle);
  }, []);
  
  const [eslesmisler, setEslesmisler] = useState<number[]>([]);
  const [hamleSayisi, setHamleSayisi] = useState(0);

  const kartSec = (index: number) => {
    if (acikKartlar.length === 2 || acikKartlar.includes(index) || eslesmisler.includes(index)) return;

    const yeniAcik = [...acikKartlar, index];
    setAcikKartlar(yeniAcik);

    if (yeniAcik.length === 2) {
      setHamleSayisi(h => h + 1);
      const [ilk, ikinci] = yeniAcik;
      if (kartlar[ilk] === kartlar[ikinci]) {
        setEslesmisler([...eslesmisler, ilk, ikinci]);
        setAcikKartlar([]);
      } else {
        setTimeout(() => setAcikKartlar([]), 800);
      }
    }
  };

  const bitir = () => {
    const carpan = hamleSayisi < 10 ? 1.5 : (hamleSayisi < 15 ? 1 : 0.6);
    aksiyonlar.oyna(carpan);
    navigation.popToTop();
  };

  const oyunBitti = eslesmisler.length === kartlar.length && kartlar.length > 0;

  return (
    <SafeAreaView style={styles.base} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Hafıza Eşleştirme</Text>
        <Text style={styles.sub}>Toplam {hamleSayisi} Hamle</Text>
      </View>

      <View style={styles.gridContainer}>
        <View style={styles.grid}>
          {kartlar.map((item: string, index: number) => {
            const acik = acikKartlar.includes(index) || eslesmisler.includes(index);
            return (
              <TouchableOpacity 
                key={index} 
                style={[styles.kart, acik && styles.kartAcik]} 
                onPress={() => kartSec(index)}
              >
                <Text style={[styles.kartT, acik && { color: Colors.text }]}>
                  {acik ? item : '?'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {oyunBitti && (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.mTitle}>Süper Hafıza!</Text>
            <Text style={styles.mSub}>{hamleSayisi} Hamlede Tamamladın.</Text>
            <TouchableOpacity style={styles.btn} onPress={bitir} activeOpacity={0.8}>
              <Text style={styles.btnT}>Devam Et</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  base: { flex: 1, backgroundColor: Colors.background },
  header: { 
    paddingTop: verticalScale(10), 
    alignItems: 'center' 
  },
  title: { 
    fontSize: FontSize.lg, 
    fontWeight: '900', 
    color: Colors.text 
  },
  sub: { 
    fontSize: 13, 
    color: Colors.textSecondary, 
    marginTop: 2,
    fontWeight: '700'
  },
  gridContainer: { flex: 1, justifyContent: 'center', padding: Spacing.sm },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center',
    marginVertical: verticalScale(10)
  },
  kart: { 
    width: scale(64), // 80 -> 64
    height: scale(64), 
    backgroundColor: Colors.primary, 
    margin: 6, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center', 
    ...Shadows.soft 
  },
  kartAcik: { 
    backgroundColor: 'white', 
    borderWidth: 2, 
    borderColor: Colors.primary 
  },
  kartT: { 
    fontSize: scale(28), 
    fontWeight: 'bold', 
    color: 'white' 
  },
  overlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modal: { 
    backgroundColor: 'white', 
    padding: Spacing.xl, 
    borderRadius: Corners.lg, 
    alignItems: 'center', 
    width: '80%',
    ...Shadows.medium
  },
  mTitle: { 
    fontSize: FontSize.xl, 
    fontWeight: '900', 
    color: Colors.text 
  },
  mSub: { 
    fontSize: FontSize.md, 
    color: Colors.textSecondary, 
    marginVertical: 15,
    fontWeight: '600'
  },
  btn: { 
    backgroundColor: Colors.primary, 
    paddingVertical: 12, 
    paddingHorizontal: 30, 
    borderRadius: 12 
  },
  btnT: { color: 'white', fontWeight: '800' }
});
