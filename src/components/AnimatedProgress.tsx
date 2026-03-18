import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, FontSize, Corners } from '../constants/theme';

interface AnimatedProgressProps {
  value: number;
  maxValue?: number;
  color?: string;
  backgroundColor?: string;
  height?: number;
  showPercentage?: boolean;
  label?: string;
  animated?: boolean;
  borderRadius?: number;
}

export const AnimatedProgress: React.FC<AnimatedProgressProps> = ({
  value,
  maxValue = 100,
  color = Colors.primary,
  backgroundColor = 'rgba(0,0,0,0.1)',
  height = 8,
  showPercentage = false,
  label,
  animated = true,
  borderRadius = Corners.sm
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const percentage = Math.min((value / maxValue) * 100, 100);

  useEffect(() => {
    if (animated) {
      Animated.timing(progressAnim, {
        toValue: percentage,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    } else {
      progressAnim.setValue(percentage);
    }
  }, [percentage, animated]);

  return (
    <View style={styles.container}>
      {(label || showPercentage) && (
        <View style={styles.labelContainer}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showPercentage && (
            <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
          )}
        </View>
      )}
      <View style={[styles.progressBg, { height, backgroundColor, borderRadius }]}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: animated ? progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
                extrapolate: 'clamp',
              }) : `${percentage}%`,
              backgroundColor: color,
              borderRadius,
            }
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  percentage: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.text,
  },
  progressBg: {
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  }
});

export default AnimatedProgress;
