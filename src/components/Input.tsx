import React from 'react';
import { TextInput, StyleSheet, View, Text, TextInputProps } from 'react-native';
import { Colors, FontSize, Corners, Spacing, Shadows } from '../constants/theme';
import { moderateScale } from '../utils/responsive';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    disabled?: boolean;
}

const Input: React.FC<InputProps> = ({ label, error, disabled, style, ...props }) => {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    disabled && styles.disabled,
                    error && styles.errorInput,
                    style
                ]}
                placeholderTextColor={Colors.textSecondary}
                editable={!disabled}
                {...props}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: Spacing.sm,
        width: '100%',
    },
    label: {
        fontSize: FontSize.sm,
        color: Colors.text,
        marginBottom: Spacing.xs,
        fontWeight: '500',
    },
    input: {
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Corners.md,
        padding: Spacing.md,
        fontSize: FontSize.md,
        color: Colors.text,
        ...Shadows.soft,
    },
    disabled: {
        backgroundColor: Colors.background,
        opacity: 0.6,
    },
    errorInput: {
        borderColor: Colors.error,
    },
    errorText: {
        fontSize: FontSize.xs,
        color: Colors.error,
        marginTop: Spacing.xs,
    },
});

export default Input;
