import React from 'react';
import { View, ScrollView, StyleSheet, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Shadows, FontSize } from '../constants/theme';
import { AchievementBadge } from '../components/AchievementBadge';
import { SectionHeader } from '../components/LevelCard';
import { usePetContext } from '../context/PetContext';
import { METINLER } from '../constants/gameConfig';
import { verticalScale } from '../utils/responsive';

const TXT = METINLER.BASARIMLAR;

export const AchievementsScreen = () => {
  const { basarimlar } = usePetContext();
  const acilanSayi = basarimlar.filter(a => a.acildi).length;

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
            <Text style={styles.title}>{TXT.BASLIK}</Text>
            <View style={styles.chips}>
              <View style={styles.chip}>
                <Text style={styles.cV}>{acilanSayi}</Text>
                <Text style={styles.cL}>{TXT.ACILDI}</Text>
              </View>
              <View style={styles.chip}>
                <Text style={styles.cV}>{basarimlar.length}</Text>
                <Text style={styles.cL}>{TXT.TOPLAM}</Text>
              </View>
            </View>
          </View>

          <SectionHeader title="Başarı Yolculuğun" subtitle={TXT.SUB} />

          <View style={styles.list}>
            {basarimlar.map((b) => (
              <AchievementBadge key={b.id} achievement={b} />
            ))}
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
  scroll: { paddingBottom: verticalScale(80) },
  header: { 
    padding: Spacing.lg, 
    backgroundColor: 'white', 
    borderBottomLeftRadius: 25, 
    borderBottomRightRadius: 25, 
    ...Shadows.soft 
  },
  title: { 
    fontSize: FontSize.xl, 
    fontWeight: '900', 
    color: Colors.text, 
    marginBottom: 10 
  },
  chips: { flexDirection: 'row' },
  chip: { 
    backgroundColor: Colors.background, 
    paddingVertical: 6, 
    paddingHorizontal: 12, 
    borderRadius: 10, 
    marginRight: 8, 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  cV: { fontSize: 16, fontWeight: '900', color: Colors.primary, marginRight: 4 },
  cL: { 
    fontSize: 9, 
    fontWeight: '700', 
    color: Colors.textSecondary, 
    textTransform: 'uppercase' 
  },
  list: { paddingVertical: 5 },
  bottomSpacer: { height: verticalScale(40) }
});
