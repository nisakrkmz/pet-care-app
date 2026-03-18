import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize } from '../constants/theme';
import { verticalScale } from '../utils/responsive';

interface StatBarProps {
  label: string;
  value: number;
  color: string;
  icon?: string;
}

export const StatBar: React.FC<StatBarProps> = ({ label, value, color, icon }) => {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.labelRow}>
          {icon && <Text style={styles.icon}>{icon}</Text>}
          <Text style={styles.label}>{label}</Text>
        </View>
        <Text style={styles.value}>%{Math.round(value)}</Text>
      </View>
      <View style={styles.track}>
        <View 
          style={[
            styles.fill, 
            { width: `${value}%`, backgroundColor: color }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    marginBottom: verticalScale(12), 
    width: '100%' 
  },
  top: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 4 
  },
  labelRow: { flexDirection: 'row', alignItems: 'center' },
  icon: { fontSize: 12, marginRight: 5 },
  label: { 
    fontSize: 12, 
    fontWeight: '700', 
    color: Colors.text 
  },
  value: { 
    fontSize: 10, 
    fontWeight: '800', 
    color: Colors.textSecondary 
  },
  track: { 
    height: 8, // 10 -> 8 (küçültüldü)
    backgroundColor: '#F0F0F0', 
    borderRadius: 4, 
    overflow: 'hidden' 
  },
  fill: { height: '100%', borderRadius: 4 }
});
