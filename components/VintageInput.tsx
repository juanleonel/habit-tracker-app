import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps, TextStyle, ViewStyle, Platform } from 'react-native';

interface VintageInputProps extends TextInputProps {
  label?: string;
  error?: string;
  variant?: 'default' | 'outline' | 'filled';
  style?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
}

const VintageInput: React.FC<VintageInputProps> = ({
  label,
  error,
  variant = 'default',
  style,
  inputStyle,
  labelStyle,
  errorStyle,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const getContainerStyle = () => {
    const baseStyle = [styles.container, style];
    
    if (error) {
      return [...baseStyle, styles.errorContainer];
    }
    
    if (isFocused) {
      return [...baseStyle, styles.focusedContainer];
    }
    
    switch (variant) {
      case 'outline':
        return [...baseStyle, styles.outlineContainer];
      case 'filled':
        return [...baseStyle, styles.filledContainer];
      default:
        return baseStyle;
    }
  };

  const getInputStyle = () => {
    const baseStyle = [styles.input, inputStyle];
    
    if (variant === 'filled') {
      return [...baseStyle, styles.filledInput];
    }
    
    return baseStyle;
  };

  return (
    <View style={styles.wrapper}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View style={getContainerStyle()}>
        <TextInput
          style={getInputStyle()}
          placeholderTextColor="#8b7d6b"
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </View>
      {error && <Text style={[styles.error, errorStyle]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  container: {
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: '#f8f4eb',
    // Efectos vintage
    shadowColor: '#8b7d6b',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderColor: '#c4a77d',
  },
  filledContainer: {
    backgroundColor: '#e6d7c1',
    borderColor: '#b08d57',
  },
  focusedContainer: {
    borderColor: '#a6855a',
    backgroundColor: '#f8f4eb',
    shadowColor: '#a6855a',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  errorContainer: {
    borderColor: '#8B0000',
    backgroundColor: '#f8f4eb',
  },
  input: {
    padding: 12,
    fontSize: 16,
    color: '#5c4b37',
    fontFamily: 'Vintage-Typewriter',
    // Fuente alternativa por si la principal no está disponible
    ...Platform.select({
      android: {
        fontFamily: 'monospace',
      },
      ios: {
        fontFamily: 'Courier',
      },
    }),
  },
  filledInput: {
    backgroundColor: '#e6d7c1',
  },
  label: {
    marginBottom: 6,
    fontSize: 16,
    color: '#5c4b37',
    fontFamily: 'Vintage-Typewriter',
    fontWeight: '600',
    // Fuente alternativa por si la principal no está disponible
    ...Platform.select({
      android: {
        fontFamily: 'monospace',
      },
      ios: {
        fontFamily: 'Courier',
      },
    }),
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  error: {
    marginTop: 6,
    fontSize: 14,
    color: '#8B0000',
    fontFamily: 'Vintage-Typewriter',
    // Fuente alternativa por si la principal no está disponible
    ...Platform.select({
      android: {
        fontFamily: 'monospace',
      },
      ios: {
        fontFamily: 'Courier',
      },
    }),
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});

export default VintageInput;