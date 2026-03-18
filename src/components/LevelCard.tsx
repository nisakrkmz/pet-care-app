import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Corners, FontSize } from '../constants/theme';
import { sonrakiSeviyeXPHesapla } from '../utils/petHelpers';
import { verticalScale } from '../utils/responsive';

interface LevelCardProps {
  level: number;
  experience: number;
}

export const LevelCard: React.FC<LevelCardProps> = ({ level, experience }) => {
  const nextXP = sonrakiSeviyeXPHesapla(level);
  const progress = experience / nextXP;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.xpText}>Seviye İlerlemesi</Text>
        <Text style={styles.xpValue}>{Math.floor(experience)} / {nextXP} XP</Text>
      </View>
      <View style={styles.barContainer}>
        <View style={[styles.barFill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
};

export const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: { 
    paddingHorizontal: Spacing.xs, 
    width: '100%', 
    marginBottom: verticalScale(5) 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 5 
  },
  xpText: { 
    fontSize: FontSize.xs, 
    fontWeight: '800', 
    color: Colors.textSecondary, 
    textTransform: 'uppercase' 
  },
  xpValue: { 
    fontSize: FontSize.xs, 
    fontWeight: '900', 
    color: Colors.primary 
  },
  barContainer: { 
    height: 10, 
    backgroundColor: '#EEE', 
    borderRadius: 5, 
    overflow: 'hidden' 
  },
  barFill: { 
    height: '100%', 
    backgroundColor: Colors.primary 
  },
  sectionHeader: { 
    paddingHorizontal: Spacing.xs, 
    marginTop: verticalScale(15), 
    marginBottom: verticalScale(8) 
  },
  sectionTitle: { 
    fontSize: FontSize.md, 
    fontWeight: '900', 
    color: Colors.text 
  },
  sectionSubtitle: { 
    fontSize: 10, 
    color: Colors.textSecondary, 
    marginTop: 1 
  }
});
