import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Colors, Corners, Shadows, FontSize, Spacing } from '../constants/theme';
import { scale, verticalScale } from '../utils/responsive';

interface ActionButtonProps {
  label: string;
  onPress: () => void;
  icon: string;
  color?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  label, 
  onPress, 
  icon, 
  color = Colors.primary,
  disabled = false,
  size = 'medium'
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: verticalScale(6),
          paddingHorizontal: scale(8),
        };
      case 'large':
        return {
          paddingVertical: verticalScale(14),
          paddingHorizontal: scale(16),
        };
      default:
        return {
          paddingVertical: verticalScale(10),
          paddingHorizontal: scale(12),
        };
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small': return 16;
      case 'large': return 24;
      default: return 18;
    }
  };
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        getSizeStyles(),
        { backgroundColor: color },
        disabled && styles.disabled,
        Shadows.medium
      ]} 
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Text style={[styles.icon, { fontSize: getIconSize() }]}>{icon}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: { 
    borderRadius: Corners.md, 
    alignItems: 'center', 
    justifyContent: 'center', 
    flex: 1, 
    marginHorizontal: Spacing.xs 
  },
  disabled: { opacity: 0.4 },
  iconContainer: { 
    backgroundColor: 'rgba(255,255,255,0.25)', 
    width: scale(36), 
    height: scale(36), 
    borderRadius: Corners.sm, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: Spacing.xs 
  },
  icon: { 
    color: Colors.surface,
    fontWeight: '600'
  },
  label: { 
    color: Colors.surface, 
    fontSize: FontSize.xs, 
    fontWeight: '600',
    textAlign: 'center'
  }
});
