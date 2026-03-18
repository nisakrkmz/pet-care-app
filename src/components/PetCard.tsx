import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, Corners, Shadows, FontSize } from '../constants/theme';
import { Hayvan, RuhHali } from '../types';
import { ruhHaliDetayGetir, hayvanGorseliGetir, seviyeRengiGetir } from '../utils/petHelpers';
import { scale, verticalScale } from '../utils/responsive';

interface PetCardProps {
  pet: Hayvan;
  mood: RuhHali;
}

export const PetCard: React.FC<PetCardProps> = ({ pet, mood }) => {
  const { emoji, renk } = ruhHaliDetayGetir(mood);
  const seviyeRengi = seviyeRengiGetir(pet.seviye);
  const hayvanEmoji = hayvanGorseliGetir(pet.tur, mood, pet.seviye);
  
  // Animasyon değerleri
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const glowAnim = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    // Sürekli nefes alma animasyonu
    const breatheAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    
    // Işık parlaması animasyonu
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    breatheAnimation.start();
    glowAnimation.start();

    return () => {
      breatheAnimation.stop();
      glowAnimation.stop();
    };
  }, []);

  return (
    <View style={[styles.container, Shadows.premium]}>
      {/* Arka plan parlaması */}
      <Animated.View 
        style={[
          styles.glowBackground,
          {
            opacity: glowAnim,
            backgroundColor: seviyeRengi + '20',
          }
        ]} 
      />
      
      {/* Seviye rozeti */}
      <View style={[styles.badge, { backgroundColor: seviyeRengi }]}>
        <Text style={styles.badgeT}>Lv.{pet.seviye}</Text>
      </View>
      
      {/* Hayvan avatarı */}
      <View style={styles.avW}>
        <Animated.View 
          style={[
            styles.avC,
            {
              transform: [{ scale: scaleAnim }],
              borderColor: seviyeRengi,
              backgroundColor: seviyeRengi + '10',
            }
          ]}
        >
          <Text style={[styles.avE, { textShadowColor: seviyeRengi }]}>
            {hayvanEmoji}
          </Text>
        </Animated.View>
        
        {/* Ruh hali göstergesi */}
        <View style={[styles.mT, { backgroundColor: renk + '20' }]}>
          <Text style={styles.mE}>{emoji}</Text>
          <Text style={[styles.mTex, { color: renk }]}>{mood}</Text>
        </View>
      </View>
      
      {/* Bilgi alanı */}
      <View style={styles.info}>
        <Text style={[styles.name, { color: seviyeRengi }]}>{pet.isim}</Text>
        <View style={styles.str}>
          <Text style={styles.strE}>🔥</Text>
          <Text style={styles.strT}>{pet.seri} Günlük Seri</Text>
        </View>
        
        {/* XP Progress Bar */}
        <View style={styles.xpContainer}>
          <Text style={styles.xpText}>XP: {pet.tecrube}</Text>
          <View style={styles.xpBarBg}>
            <View 
              style={[
                styles.xpBarFill, 
                { 
                  width: `${(pet.tecrube % 100)}%`,
                  backgroundColor: seviyeRengi 
                }
              ]} 
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    borderRadius: Corners.lg, 
    padding: Spacing.md, 
    alignItems: 'center', 
    marginVertical: verticalScale(5), 
    width: '100%',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  glowBackground: {
    position: 'absolute',
    top: -Spacing.sm,
    left: -Spacing.sm,
    right: -Spacing.sm,
    bottom: -Spacing.sm,
    borderRadius: Corners.lg,
  },
  badge: { 
    position: 'absolute', 
    top: Spacing.sm, 
    right: Spacing.sm, 
    paddingVertical: 4, 
    paddingHorizontal: 12, 
    borderRadius: Corners.round,
    zIndex: 10,
    ...Shadows.medium,
  },
  badgeT: { 
    color: 'white', 
    fontSize: FontSize.xs, 
    fontWeight: '900'
  },
  avW: { alignItems: 'center', marginBottom: Spacing.sm },
  avC: { 
    width: scale(100),
    height: scale(100), 
    borderRadius: scale(50), 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 3, 
    ...Shadows.medium,
  },
  avE: { 
    fontSize: scale(55)
  },
  mT: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 6, 
    paddingHorizontal: 16, 
    borderRadius: Corners.round, 
    marginTop: -Spacing.sm, 
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...Shadows.soft 
  },
  mE: { fontSize: 14, marginRight: 6 },
  mTex: { fontSize: FontSize.sm, fontWeight: '800' },
  info: { alignItems: 'center' },
  name: { 
    fontSize: FontSize.xl, 
    fontWeight: '900', 
    marginBottom: Spacing.xs
  },
  str: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  strE: { fontSize: 12, marginRight: 4 },
  strT: { fontSize: FontSize.xs, fontWeight: '800' },
  xpContainer: {
    width: '100%',
    marginTop: Spacing.sm,
  },
  xpText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    marginBottom: 4,
    color: Colors.textSecondary,
  },
  xpBarBg: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    borderRadius: 3,
  }
});
