import React, { useMemo } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Text, 
  StatusBar, 
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, Corners, Shadows } from '../constants/theme';
import { PetCard } from '../components/PetCard';
import { StatBar } from '../components/StatBar';
import { AnimatedButton } from '../components/AnimatedButton';
import { AnimatedProgress } from '../components/AnimatedProgress';
import { LevelCard, SectionHeader } from '../components/LevelCard';
import { usePetContext } from '../context/PetContext';
import { ruhHaliHesapla } from '../utils/petHelpers';
import { METINLER } from '../constants/gameConfig';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from '../utils/responsive';

const TXT = METINLER.ANA_SAYFA;

export const HomeScreen = () => {
  const { hayvan, aksiyonlar } = usePetContext();
  const navigation = useNavigation<any>();
  
  const ruhHali = useMemo(() => ruhHaliHesapla(hayvan.istatistikler), [hayvan.istatistikler]);

  const handleBesle = () => {
    if (hayvan.istatistikler.aclik >= 95) {
      Alert.alert('Tok', METINLER.FEEDBACK.BESLE_TOK);
    } else {
      navigation.navigate('HaydiBesle');
    }
  };

  return (
    <View style={styles.base}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      {/* Arka Plan */}
      <View style={styles.backgroundPattern}>
        <View style={[styles.patternDot, { backgroundColor: Colors.gradients.candy[0] }]} />
        <View style={[styles.patternDot, { backgroundColor: Colors.gradients.candy[1] }]} />
        <View style={[styles.patternDot, { backgroundColor: Colors.secondary }]} />
      </View>
      
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <ScrollView 
          contentContainerStyle={styles.scroll} 
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.contentWrapper}>
            <View style={styles.header}>
              <Text style={[styles.greeting, { color: Colors.text }]}>{hayvan.isim} ile Macera</Text>
              <Text style={[styles.subText, { color: Colors.textSecondary }]}>{TXT.DURUM_SORUSU(hayvan.isim)}</Text>
            </View>

            <View style={styles.cardContainer}>
              <PetCard pet={hayvan} mood={ruhHali} />
              <LevelCard level={hayvan.seviye} experience={hayvan.tecrube} />
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🎯 Hayatını İyileştir</Text>
              <Text style={styles.sectionSubtitle}>İhtiyaçlarını karşıla</Text>
            </View>
            
            <View style={[styles.panel, { backgroundColor: Colors.glass.white, borderColor: Colors.glass.border }]}>
              <AnimatedProgress 
                label="🍕 Açlık" 
                value={hayvan.istatistikler.aclik} 
                color={Colors.hunger} 
                height={12}
                showPercentage
                borderRadius={6}
              />
              <View style={styles.progressSpacer} />
              <AnimatedProgress 
                label="🎾 Mutluluk" 
                value={hayvan.istatistikler.mutluluk} 
                color={Colors.happiness} 
                height={12}
                showPercentage
                borderRadius={6}
              />
              <View style={styles.progressSpacer} />
              <AnimatedProgress 
                label="⚡ Enerji" 
                value={hayvan.istatistikler.enerji} 
                color={Colors.energy} 
                height={12}
                showPercentage
                borderRadius={6}
              />
              <View style={styles.progressSpacer} />
              <AnimatedProgress 
                label="❤️ Sağlık" 
                value={hayvan.istatistikler.saglik} 
                color={Colors.health} 
                height={12}
                showPercentage
                borderRadius={6}
              />
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🎮 Etkileşim Alanları</Text>
              <Text style={styles.sectionSubtitle}>Oyna, besle, dinlen</Text>
            </View>
            
            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.actionsScroll}
            >
              <View style={styles.actions}>
                <AnimatedButton 
                  title="🍕 Besle" 
                  onPress={handleBesle} 
                  variant="gradient"
                  size="large"
                  glowEffect
                />
                <AnimatedButton 
                  title="🎮 Oyna" 
                  onPress={() => navigation.navigate('OyunSec')} 
                  variant="gradient"
                  size="large"
                  glowEffect
                />
                <AnimatedButton 
                  title="💤 Dinlen" 
                  onPress={() => navigation.navigate('Dinlenme')} 
                  variant="gradient"
                  size="large"
                  glowEffect
                />
              </View>
            </ScrollView>
            
            <View style={styles.bottomSpacer} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  base: { flex: 1, backgroundColor: '#FFE0EC' }, // Pink background
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: verticalScale(50),
  },
  patternDot: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    opacity: 0.15,
  },
  safe: { flex: 1 },
  scroll: { 
    flexGrow: 1 
  },
  contentWrapper: {
    padding: Spacing.lg,
    paddingTop: verticalScale(60),
    backgroundColor: Colors.white,
    borderRadius: Corners.xl,
    margin: Spacing.md,
    ...Shadows.premium,
  },
  header: { 
    alignItems: 'center', 
    marginBottom: verticalScale(25),
  },
  greeting: { 
    fontSize: FontSize.xxl,
    fontWeight: '900', 
    letterSpacing: -1,
    marginBottom: Spacing.xs,
    color: Colors.text,
  },
  subText: { 
    fontSize: FontSize.md, 
    marginTop: 2, 
    fontWeight: '600',
    color: Colors.textSecondary
  },
  cardContainer: {
    marginBottom: verticalScale(25),
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  panel: { 
    padding: Spacing.lg, 
    borderRadius: Corners.xl, 
    borderWidth: 1,
    ...Shadows.premium,
    marginTop: verticalScale(10),
    backgroundColor: Colors.glass.white,
    borderColor: Colors.glass.border
  },
  progressSpacer: {
    height: verticalScale(12),
  },
  actions: { 
    flexDirection: 'row', 
    gap: Spacing.sm,
    paddingBottom: verticalScale(20),
    paddingHorizontal: Spacing.md,
  },
  actionsScroll: {
    paddingHorizontal: Spacing.md,
  },
  bottomSpacer: { 
    height: verticalScale(20) 
  }
});
