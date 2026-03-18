import React, { useMemo, useRef, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Text, 
  StatusBar, 
  TouchableOpacity,
  Animated,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, Corners, Shadows } from '../constants/theme';
import { PetCard } from '../components/PetCard';
import { AnimatedProgress } from '../components/AnimatedProgress';
import { LevelCard } from '../components/LevelCard';
import { usePetContext } from '../context/PetContext';
import { ruhHaliHesapla } from '../utils/petHelpers';
import { METINLER } from '../constants/gameConfig';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from '../utils/responsive';

const TXT = METINLER.ANA_SAYFA;

// Büyük aksiyon kartı bileşeni
const ActionCard = ({ 
  icon, 
  label, 
  sublabel, 
  color, 
  bgColor, 
  onPress 
}: { 
  icon: string; 
  label: string; 
  sublabel: string; 
  color: string; 
  bgColor: string;
  onPress: () => void;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.93, useNativeDriver: true, speed: 40 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 20 }).start();
    setTimeout(onPress, 80);
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], flex: 1 }}>
      <TouchableOpacity
        style={[styles.actionCard, { backgroundColor: bgColor, borderColor: color + '55' }]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={[styles.actionIconBg, { backgroundColor: color + '22' }]}>
          <Text style={styles.actionIcon}>{icon}</Text>
        </View>
        <Text style={[styles.actionLabel, { color }]}>{label}</Text>
        <Text style={styles.actionSublabel}>{sublabel}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const HomeScreen = () => {
  const { hayvan, aksiyonlar } = usePetContext();
  const navigation = useNavigation<any>();
  
  const ruhHali = useMemo(() => ruhHaliHesapla(hayvan.istatistikler), [hayvan.istatistikler]);

  // Arka plan ballons animasyonu
  const bob1 = useRef(new Animated.Value(0)).current;
  const bob2 = useRef(new Animated.Value(0)).current;
  const bob3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createBob = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: -14, duration: 2200, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 2200, useNativeDriver: true }),
        ])
      );
    const a1 = createBob(bob1, 0);
    const a2 = createBob(bob2, 700);
    const a3 = createBob(bob3, 1400);
    a1.start(); a2.start(); a3.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); };
  }, []);

  const handleBesle = () => {
    if (hayvan.istatistikler.aclik >= 95) {
      Alert.alert('Tok! 🍽️', METINLER.FEEDBACK.BESLE_TOK);
    } else {
      navigation.navigate('HaydiBesle');
    }
  };

  const aclikPct = hayvan.istatistikler.aclik;
  const mutlulukPct = hayvan.istatistikler.mutluluk;
  const enerjiPct = hayvan.istatistikler.enerji;
  const saglikPct = hayvan.istatistikler.saglik;

  return (
    <View style={styles.base}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Renkli arka plan */}
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.bgTop} />
        <View style={styles.bgBottom} />
      </View>

      {/* Dekoratif balonlar */}
      <Animated.View style={[styles.bubble, styles.bubble1, { transform: [{ translateY: bob1 }] }]} />
      <Animated.View style={[styles.bubble, styles.bubble2, { transform: [{ translateY: bob2 }] }]} />
      <Animated.View style={[styles.bubble, styles.bubble3, { transform: [{ translateY: bob3 }] }]} />

      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <ScrollView 
          contentContainerStyle={styles.scroll} 
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* ─── HEADER ─── */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Merhaba! 👋</Text>
              <Text style={styles.subText}>{TXT.DURUM_SORUSU(hayvan.isim)}</Text>
            </View>
            <View style={styles.streakBadge}>
              <Text style={styles.streakIcon}>🔥</Text>
              <Text style={styles.streakText}>{hayvan.seri}</Text>
            </View>
          </View>

          {/* ─── PET CARD ─── */}
          <View style={styles.cardSection}>
            <PetCard pet={hayvan} mood={ruhHali} />
          </View>

          {/* ─── LEVEL ─── */}
          <View style={styles.levelSection}>
            <LevelCard level={hayvan.seviye} experience={hayvan.tecrube} />
          </View>

          {/* ─── STATS ─── */}
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>💖 Hayati Durum</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>🍕</Text>
                <View style={styles.statBarOuter}>
                  <View style={[styles.statBarInner, { width: `${aclikPct}%`, backgroundColor: '#FF6B6B' }]} />
                </View>
                <Text style={[styles.statPct, { color: '#FF6B6B' }]}>{Math.round(aclikPct)}%</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>🎾</Text>
                <View style={styles.statBarOuter}>
                  <View style={[styles.statBarInner, { width: `${mutlulukPct}%`, backgroundColor: '#FFD93D' }]} />
                </View>
                <Text style={[styles.statPct, { color: '#F5A623' }]}>{Math.round(mutlulukPct)}%</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>⚡</Text>
                <View style={styles.statBarOuter}>
                  <View style={[styles.statBarInner, { width: `${enerjiPct}%`, backgroundColor: '#6BCF7F' }]} />
                </View>
                <Text style={[styles.statPct, { color: '#27AE60' }]}>{Math.round(enerjiPct)}%</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statEmoji}>❤️</Text>
                <View style={styles.statBarOuter}>
                  <View style={[styles.statBarInner, { width: `${saglikPct}%`, backgroundColor: '#FF6B9D' }]} />
                </View>
                <Text style={[styles.statPct, { color: '#E91E8C' }]}>{Math.round(saglikPct)}%</Text>
              </View>
            </View>
          </View>

          {/* ─── ACTIONS ─── */}
          <Text style={styles.actionTitle}>🎮 Ne Yapalım?</Text>
          <View style={styles.actionRow}>
            <ActionCard
              icon="🍕"
              label="Besle"
              sublabel="Acıktı mı?"
              color="#FF6B6B"
              bgColor="#FFF5F5"
              onPress={handleBesle}
            />
            <ActionCard
              icon="🎮"
              label="Oyna"
              sublabel="Eğlen!"
              color="#8B5CF6"
              bgColor="#F5F0FF"
              onPress={() => navigation.navigate('OyunSec')}
            />
            <ActionCard
              icon="💤"
              label="Dinlen"
              sublabel="Enerji şarj"
              color="#10B981"
              bgColor="#F0FFF8"
              onPress={() => navigation.navigate('Dinlenme')}
            />
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  base: { flex: 1 },

  // Arka plan
  bgTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: '#EDE9FE',
    borderBottomLeftRadius: scale(50),
    borderBottomRightRadius: scale(50),
  },
  bgBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: '40%',
    backgroundColor: '#F9FAFB',
  },

  // Balonlar
  bubble: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.18,
  },
  bubble1: {
    width: scale(130),
    height: scale(130),
    backgroundColor: '#A78BFA',
    top: -20,
    right: -30,
  },
  bubble2: {
    width: scale(80),
    height: scale(80),
    backgroundColor: '#F472B6',
    top: 80,
    left: -20,
  },
  bubble3: {
    width: scale(60),
    height: scale(60),
    backgroundColor: '#34D399',
    top: 150,
    right: 60,
  },

  safe: { flex: 1 },
  scroll: { 
    paddingHorizontal: Spacing.md,
    paddingTop: verticalScale(55),
    paddingBottom: verticalScale(20),
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(18),
    paddingHorizontal: Spacing.xs,
  },
  greeting: { 
    fontSize: FontSize.xl,
    fontWeight: '900', 
    color: '#2D1B69',
    letterSpacing: -0.5,
  },
  subText: { 
    fontSize: FontSize.sm, 
    color: '#7C5C9E',
    fontWeight: '600',
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E7',
    borderRadius: Corners.round,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: '#FBBF24',
    ...Shadows.soft,
  },
  streakIcon: { fontSize: 18, marginRight: 4 },
  streakText: { 
    fontSize: FontSize.md, 
    fontWeight: '900', 
    color: '#D97706'
  },

  // Card sections
  cardSection: {
    marginBottom: verticalScale(10),
  },
  levelSection: {
    marginBottom: verticalScale(14),
  },

  // Stats Card
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Corners.xl,
    padding: Spacing.md,
    marginBottom: verticalScale(18),
    ...Shadows.medium,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  statsTitle: {
    fontSize: FontSize.md,
    fontWeight: '800',
    color: '#2D1B69',
    marginBottom: Spacing.sm,
  },
  statsGrid: {
    gap: verticalScale(8),
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statEmoji: { fontSize: 16, width: 26, textAlign: 'center' },
  statBarOuter: {
    flex: 1,
    height: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 5,
    overflow: 'hidden',
  },
  statBarInner: {
    height: '100%',
    borderRadius: 5,
  },
  statPct: {
    fontSize: 11,
    fontWeight: '800',
    width: 36,
    textAlign: 'right',
  },

  // Actions
  actionTitle: {
    fontSize: FontSize.md,
    fontWeight: '800',
    color: '#2D1B69',
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: verticalScale(10),
  },
  actionCard: {
    borderRadius: Corners.xl,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    ...Shadows.soft,
    minHeight: scale(110),
    justifyContent: 'center',
  },
  actionIconBg: {
    width: scale(52),
    height: scale(52),
    borderRadius: scale(26),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  actionIcon: { fontSize: scale(28) },
  actionLabel: { 
    fontSize: FontSize.md, 
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  actionSublabel: { 
    fontSize: 10, 
    color: '#9CA3AF', 
    fontWeight: '600',
    marginTop: 2,
  },

  bottomSpacer: { height: verticalScale(80) },
});
