import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, Corners, Shadows } from '../constants/theme';
import { METINLER } from '../constants/gameConfig';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from '../utils/responsive';

const TXT = METINLER.OYUN;

interface OyunKartProps {
  baslik: string;
  altBaslik: string;
  ikon: string;
  onPress: () => void;
  renk: string;
}

const OyunKarti = ({ baslik, altBaslik, ikon, onPress, renk }: OyunKartProps) => (
  <TouchableOpacity style={[styles.kart, Shadows.soft]} onPress={onPress}>
    <View style={[styles.ikonKapsayici, { backgroundColor: renk + '15' }]}>
      <Text style={styles.ikonText}>{ikon}</Text>
    </View>
    <View style={styles.kartIcerik}>
      <Text style={styles.kartBaslik}>{baslik}</Text>
      <Text style={styles.kartAltBaslik}>{altBaslik}</Text>
    </View>
    <View style={styles.gitBtn}>
      <Text style={[styles.gitText, { color: renk }]}>→</Text>
    </View>
  </TouchableOpacity>
);

export const OyunSecScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.konteyner} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.ustAlan}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.kapatBtn}>
          <Text style={styles.kapatIkon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.sayfaBaslik}>{TXT.SEC_BASLIK}</Text>
        <Text style={styles.sayfaAltBaslik}>{TXT.SEC_SUB}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.liste} showsVerticalScrollIndicator={false} bounces={false}>
        <OyunKarti 
          baslik={TXT.TOP_YAKALA} 
          altBaslik={TXT.TOP_YAKALA_SUB} 
          ikon="🧶" 
          renk={Colors.primary}
          onPress={() => navigation.navigate('TopYakala')}
        />
        <OyunKarti 
          baslik={TXT.HIZLI_DOKUN} 
          altBaslik={TXT.HIZLI_DOKUN_SUB} 
          ikon="⚡" 
          renk="#F1C40F"
          onPress={() => navigation.navigate('HizliDokun')}
        />
        <OyunKarti 
          baslik={TXT.HAFIZA} 
          altBaslik={TXT.HAFIZA_SUB} 
          ikon="🧩" 
          renk="#E67E22"
          onPress={() => navigation.navigate('HafizaEslestirme')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  konteyner: { flex: 1, backgroundColor: Colors.background },
  ustAlan: { 
    paddingTop: verticalScale(10), 
    paddingBottom: verticalScale(15), 
    alignItems: 'center',
    paddingHorizontal: Spacing.xl
  },
  kapatBtn: { 
    position: 'absolute', 
    left: Spacing.lg, 
    top: verticalScale(10),
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  kapatIkon: { fontSize: 20, color: Colors.textSecondary },
  sayfaBaslik: { 
    fontSize: FontSize.lg, 
    fontWeight: '900', 
    color: Colors.text, 
    marginTop: verticalScale(5) 
  },
  sayfaAltBaslik: { 
    fontSize: 12, 
    color: Colors.textSecondary, 
    marginTop: 2, 
    textAlign: 'center',
    fontWeight: '600'
  },
  liste: { padding: Spacing.md },
  kart: { 
    backgroundColor: Colors.surface, 
    borderRadius: Corners.md, 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: Spacing.sm, 
    marginBottom: verticalScale(12) 
  },
  ikonKapsayici: { 
    width: scale(56), // 64 -> 56 (küçültüldü)
    height: scale(56), 
    borderRadius: Corners.md, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  ikonText: { fontSize: scale(28) },
  kartIcerik: { flex: 1, marginLeft: Spacing.md },
  kartBaslik: { fontSize: 15, fontWeight: '800', color: Colors.text },
  kartAltBaslik: { fontSize: 10, color: Colors.textSecondary, marginTop: 1 },
  gitBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  gitText: { fontSize: 20, fontWeight: 'bold' }
});
