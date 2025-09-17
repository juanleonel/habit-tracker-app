import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator, Platform } from 'react-native';

interface VintageButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'warning' | 'danger' | 'info';
  size?: 'small' | 'medium' | 'large';
}

const VintageButton: React.FC<VintageButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium'
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[`${size}Button`]];
    
    if (disabled) {
      return [...baseStyle, styles.disabledButton, style];
    }
    
    switch (variant) {
      case 'secondary':
        return [...baseStyle, styles.secondaryButton, style];
      case 'outline':
        return [...baseStyle, styles.outlineButton, style];
      case 'warning':
        return [...baseStyle, styles.warningButton, style];
      case 'danger':
        return [...baseStyle, styles.dangerButton, style];
      case 'info':
        return [...baseStyle, styles.infoButton, style];
      default:
        return [...baseStyle, styles.primaryButton, style];
    }
  };

  const getTextStyle = () => {
    if (disabled) {
      return [styles.buttonText, styles.disabledText, textStyle];
    }
    
    switch (variant) {
      case 'secondary':
        return [styles.buttonText, styles.secondaryText, textStyle];
      case 'outline':
        return [styles.buttonText, styles.outlineText, textStyle];
      case 'warning':
        return [styles.buttonText, styles.warningText, textStyle];
      case 'danger':
        return [styles.buttonText, styles.dangerText, textStyle];
      case 'info':
        return [styles.buttonText, styles.infoText, textStyle];
      default:
        return [styles.buttonText, styles.primaryText, textStyle];
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={styles[`${variant}Text`]?.color || '#5c4b37'} 
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    flexDirection: 'row',
    // Efectos vintage
    shadowColor: '#8b7d6b',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  smallButton: {
    padding: 8,
    minWidth: 80,
  },
  mediumButton: {
    padding: 12,
    minWidth: 100,
  },
  largeButton: {
    padding: 16,
    minWidth: 120,
  },
  primaryButton: {
    backgroundColor: '#d4b483',
    borderColor: '#a6855a',
  },
  secondaryButton: {
    backgroundColor: '#e6d7c1',
    borderColor: '#b08d57',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderColor: '#c4a77d',
  },
  warningButton: {
    backgroundColor: '#F5DEB3',
    borderColor: '#DAA520',
  },
  dangerButton: {
    backgroundColor: '#F08080',
    borderColor: '#8B0000',
  },
  infoButton: {
    backgroundColor: '#B0E0E6',
    borderColor: '#2F4F4F',
  },
  disabledButton: {
    backgroundColor: '#b8b2a7',
    borderColor: '#9c9588',
  },
  buttonText: {
    fontWeight: '600',
    fontFamily: 'Vintage-Typewriter',
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
  primaryText: {
    color: '#5c4b37',
    fontSize: 14,
  },
  secondaryText: {
    color: '#5c4b37',
    fontSize: 14,
  },
  outlineText: {
    color: '#5c4b37',
    fontSize: 14,
  },
  warningText: {
    color: '#8B4513',
  },
  dangerText: {
    color: '#8B0000',
  },
  infoText: {
    color: '#2F4F4F',
  },
  disabledText: {
    color: '#6b6357',
  },
});

export default VintageButton;