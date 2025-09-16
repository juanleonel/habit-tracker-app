import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface VintageButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

const VintageButton: React.FC<VintageButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  variant = 'primary'
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return [styles.button, styles.secondaryButton, style];
      case 'outline':
        return [styles.button, styles.outlineButton, style];
      default:
        return [styles.button, styles.primaryButton, style];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return [styles.buttonText, styles.secondaryText, textStyle];
      case 'outline':
        return [styles.buttonText, styles.outlineText, textStyle];
      default:
        return [styles.buttonText, styles.primaryText, textStyle];
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    // Efectos vintage
    shadowColor: '#8b7d6b',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
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
  buttonText: {
    fontWeight: '600',
    fontFamily: 'Vintage-Typewriter',
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
  disabledButton: {
    backgroundColor: '#b8b2a7',
    borderColor: '#9c9588',
  },
});

export default VintageButton;