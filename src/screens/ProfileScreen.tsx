import React from 'react';
import { View, ScrollView, StyleSheet, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Corners, Shadows, FontSize } from '../constants/theme';
import { SectionHeader } from '../components/LevelCard';
import { usePetContext } from '../context/PetContext';
import { METINLER } from '../constants/gameConfig';
import { scale, verticalScale } from '../utils/responsive';

const TXT = METINLER.ISTATISTIKLER;

const IstatistikSatiri = ({ etiket, deger, ikon, renk }: any) => (
  <View style={styles.satir}>
    <View style={[styles.ikonKutu, { backgroundColor: renk + '10' }]}>
      <Text style={[styles.ikon, { color: renk }]}>{ikon}</Text>
    </View>
    <View style={styles.bilgi}>
      <Text style={styles.etiket}>{etiket}</Text>
      <Text style={styles.deger}>{deger}</Text>
    </View>
  </View>
);

export const ProfileScreen = () => {
  const { hayvan, stats } = usePetContext();

  return (
    <View style={styles.base}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <ScrollView 
          contentContainerStyle={styles.scroll} 
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.header}>
            <View style={styles.daire}>
              <Text style={styles.dE}>🏆</Text>
            </View>
            <Text style={styles.title}>{TXT.BASLIK}</Text>
            <Text style={styles.sub}>{TXT.SUB}</Text>
          </View>

          <SectionHeader title="İstatistiklerin" subtitle="Genel ilerleme raporun" />
          
          <View style={styles.kart}>
            <IstatistikSatiri etiket={TXT.TOPLAM_PUAN} deger={stats.toplamPuan} ikon="✨" renk={Colors.primary} />
            <IstatistikSatiri etiket={TXT.BEST_SERI} deger={`${stats.bestSeri} Gün`} ikon="🔥" renk="#FF9F43" />
            <IstatistikSatiri etiket={TXT.TOPLAM_BESLEME} deger={stats.toplamBesleme} ikon="🍱" renk={Colors.hunger} />
            <IstatistikSatiri etiket={TXT.TOPLAM_OYUN} deger={stats.toplamOyun} ikon="🎮" renk={Colors.happiness} />
            <IstatistikSatiri etiket={TXT.PET_SEVIYESI} deger={hayvan.seviye} ikon="📈" renk={Colors.accent} />
          </View>

          <View style={styles.ipucu}>
            <Text style={styles.iT}>{TXT.IPUCU_BASLIK}</Text>
            <Text style={styles.iM}>{TXT.IPUCU_METIN}</Text>
          </View>
          
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  base: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1 },
  scroll: { paddingBottom: verticalScale(60) },
  header: { 
    alignItems: 'center', 
    padding: Spacing.lg, 
    backgroundColor: 'white', 
    borderBottomLeftRadius: 25, 
    borderBottomRightRadius: 25, 
    ...Shadows.soft 
  },
  daire: { 
    width: scale(64), // 80 -> 64 (küçültüldü)
    height: scale(64), 
    borderRadius: scale(32), 
    backgroundColor: '#EEF2FF', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  dE: { fontSize: scale(32) },
  title: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.text },
  sub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2, fontWeight: '600' },
  kart: { 
    backgroundColor: 'white', 
    marginHorizontal: Spacing.md, 
    padding: Spacing.sm, 
    borderRadius: Corners.lg, 
    ...Shadows.soft 
  },
  satir: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F7F7F7' 
  },
  ikonKutu: { 
    width: 38, 
    height: 38, 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 12 
  },
  ikon: { fontSize: 16 },
  bilgi: { flex: 1 },
  etiket: { 
    fontSize: 9, 
    color: Colors.textSecondary, 
    fontWeight: '700', 
    textTransform: 'uppercase' 
  },
  deger: { fontSize: 16, fontWeight: '800', color: Colors.text },
  ipucu: { 
    margin: Spacing.md, 
    padding: Spacing.md, 
    backgroundColor: Colors.primary + '08', 
    borderRadius: Corners.md, 
    borderLeftWidth: 4, 
    borderLeftColor: Colors.primary 
  },
  iT: { fontSize: FontSize.md, fontWeight: '900', color: Colors.primary, marginBottom: 4 },
  iM: { fontSize: 13, color: '#555', lineHeight: 20 },
  bottomSpacer: { height: verticalScale(40) }
});
