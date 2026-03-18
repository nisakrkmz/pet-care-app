import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Corners, Shadows, FontSize } from '../constants/theme';
import { Basarim } from '../types';
import { scale } from '../utils/responsive';

interface AchievementBadgeProps {
  achievement: Basarim;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement }) => {
  const ilerleme = Math.min(achievement.mevcutDeger / achievement.hedefDeger, 1);
  const acildi = achievement.acildi;
  
  return (
    <View style={[styles.kasa, acildi ? styles.kasAcik : styles.kasKapali, Shadows.soft]}>
      <View style={[styles.ikonKutu, acildi ? styles.ikonAcik : styles.ikonKapali]}>
        <Text style={[styles.ikon, !acildi && styles.ikonGri]}>{achievement.ikon}</Text>
      </View>
      
      <View style={styles.bilgi}>
        <Text style={styles.baslik}>{achievement.baslik}</Text>
        <Text style={styles.aciklama}>{achievement.aciklama}</Text>
        
        {!acildi && (
          <View style={styles.iR}>
            <View style={styles.iB}>
              <View style={[styles.iF, { width: `${ilerleme * 100}%` }]} />
            </View>
            <Text style={styles.iT}>{achievement.mevcutDeger}/{achievement.hedefDeger}</Text>
          </View>
        )}
      </View>
      
      {acildi && (
        <View style={styles.tik}><Text style={styles.tikT}>✓</Text></View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  kasa: { 
    backgroundColor: Colors.surface, 
    padding: Spacing.md, 
    borderRadius: Corners.md, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: Spacing.md, 
    marginHorizontal: Spacing.md, 
    borderWidth: 1, 
    borderColor: 'transparent' 
  },
  kasAcik: { borderColor: Colors.success },
  kasKapali: { opacity: 0.9, backgroundColor: Colors.background },
  ikonKutu: { 
    width: scale(60), 
    height: scale(60), 
    borderRadius: Corners.md, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: Spacing.md 
  },
  ikonAcik: { backgroundColor: Colors.primary + '10' },
  ikonKapali: { backgroundColor: Colors.border },
  ikon: { fontSize: FontSize.xl * 1.5 },
  ikonGri: { opacity: 0.3 },
  bilgi: { flex: 1 },
  baslik: { 
    fontSize: FontSize.md, 
    fontWeight: '800', 
    color: Colors.text, 
    marginBottom: Spacing.xs 
  },
  aciklama: { 
    fontSize: FontSize.xs, 
    color: Colors.textSecondary, 
    fontWeight: '500' 
  },
  iR: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: Spacing.sm 
  },
  iB: { 
    flex: 1, 
    height: 6, 
    backgroundColor: Colors.border, 
    borderRadius: 3, 
    marginRight: Spacing.sm 
  },
  iF: { 
    height: '100%', 
    backgroundColor: Colors.primary, 
    borderRadius: 3 
  },
  iT: { 
    fontSize: FontSize.xs, 
    fontWeight: '800', 
    color: Colors.textSecondary 
  },
  tik: { 
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    backgroundColor: Colors.success, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  tikT: { 
    color: Colors.surface, 
    fontSize: FontSize.xs, 
    fontWeight: '900' 
  }
});
