import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, FontSize, Corners, Spacing, Shadows } from '../constants/theme';
import { moderateScale } from '../utils/responsive';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    loading?: boolean;
    disabled?: boolean;
    size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    size = 'medium'
}) => {
    const getBackgroundColor = () => {
        if (disabled) return Colors.textSecondary;
        if (variant === 'primary') return Colors.primary;
        if (variant === 'secondary') return Colors.text;
        return 'transparent';
    };

    const getTextColor = () => {
        if (variant === 'outline') return Colors.primary;
        return Colors.surface;
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return {
                    paddingVertical: Spacing.sm,
                    paddingHorizontal: Spacing.md,
                };
            case 'large':
                return {
                    paddingVertical: Spacing.lg,
                    paddingHorizontal: Spacing.xl,
                };
            default:
                return {
                    paddingVertical: Spacing.md,
                    paddingHorizontal: Spacing.lg,
                };
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                getSizeStyles(),
                { backgroundColor: getBackgroundColor() },
                variant === 'outline' && styles.outlineButton,
                Shadows.soft
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: Corners.md,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    outlineButton: {
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    text: {
        fontSize: FontSize.md,
        fontWeight: '600',
    },
});

export default Button;
