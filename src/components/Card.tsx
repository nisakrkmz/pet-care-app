import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Corners, Spacing, Shadows } from '../constants/theme';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    variant?: 'default' | 'elevated' | 'outlined';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({ 
    children, 
    style, 
    variant = 'default',
    padding = 'md'
}) => {
    const getVariantStyles = () => {
        switch (variant) {
            case 'elevated':
                return Shadows.medium;
            case 'outlined':
                return {
                    borderWidth: 1,
                    borderColor: Colors.border,
                };
            default:
                return Shadows.soft;
        }
    };

    const getPaddingStyles = () => {
        switch (padding) {
            case 'none': return { padding: 0 };
            case 'sm': return { padding: Spacing.sm };
            case 'lg': return { padding: Spacing.lg };
            default: return { padding: Spacing.md };
        }
    };

    return (
        <View style={[
            styles.container,
            getVariantStyles(),
            getPaddingStyles(),
            style
        ]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.surface,
        borderRadius: Corners.lg,
        marginVertical: Spacing.sm,
    },
});

export default Card;
