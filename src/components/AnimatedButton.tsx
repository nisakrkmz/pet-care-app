import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, View } from 'react-native';
import { Colors, FontSize, Corners, Spacing, Shadows } from '../constants/theme';
import { scale, verticalScale } from '../utils/responsive';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'gradient' | 'neon';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  glowEffect?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  glowEffect = true
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (glowEffect && !disabled) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [glowEffect, disabled]);

  const handlePressIn = () => {
    if (!disabled && !loading) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled && !loading) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      onPress();
    }
  };

  const getButtonColors = () => {
    switch (variant) {
      case 'gradient':
        return Colors.gradients.candy;
      case 'neon':
        return Colors.neon.pink;
      case 'secondary':
        return Colors.secondary;
      default:
        return Colors.primary;
    }
  };

  const getBackgroundStyle = () => {
    if (variant === 'gradient') {
      return {
        backgroundColor: Colors.gradients.candy[0],
        borderWidth: 2,
        borderColor: Colors.gradients.candy[1],
      };
    }
    if (variant === 'neon') {
      return {
        backgroundColor: Colors.neon.pink,
        borderWidth: 2,
        borderColor: Colors.neon.purple,
      };
    }
    if (variant === 'secondary') {
      return {
        backgroundColor: Colors.secondary,
        borderWidth: 2,
        borderColor: Colors.primary,
      };
    }
    const buttonColor = getButtonColors();
    return {
      backgroundColor: Array.isArray(buttonColor) ? buttonColor[0] : buttonColor,
    };
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: verticalScale(8),
          paddingHorizontal: scale(16),
          minWidth: scale(100),
        };
      case 'large':
        return {
          paddingVertical: verticalScale(16),
          paddingHorizontal: scale(24),
          minWidth: scale(140),
        };
      default:
        return {
          paddingVertical: verticalScale(12),
          paddingHorizontal: scale(20),
          minWidth: scale(120),
        };
    }
  };

  const buttonColor = getButtonColors();
  const isGradient = variant === 'gradient';

  return (
    <View style={styles.wrapper}>
      {/* Glow Effect */}
      {glowEffect && !disabled && (
        <Animated.View
          style={[
            styles.glow,
            {
              opacity: glowAnim,
              backgroundColor: Array.isArray(buttonColor) ? buttonColor[0] : buttonColor,
            }
          ]}
        />
      )}
      
      <TouchableOpacity
        style={[
          styles.button,
          getSizeStyles(),
          getBackgroundStyle(),
          {
            transform: [{ scale: scaleAnim }],
            opacity: disabled ? 0.5 : 1,
          }
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.buttonContent,
            {
              transform: [{ scale: pulseAnim }],
            }
          ]}
        >
          {icon && <Text style={styles.icon}>{icon}</Text>}
          <Text style={[
            styles.text,
            { color: Colors.white }
          ]}>
            {loading ? '...' : title}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    width: '100%',
  },
  glow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: Corners.md,
    filter: 'blur(8px)',
    zIndex: -1,
  },
  button: {
    borderRadius: Corners.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: FontSize.md,
    marginRight: Spacing.xs,
  },
  text: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
});

export default AnimatedButton;
