import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

interface PaperTextureBackgroundProps {
  children: React.ReactNode;
}

const PaperTextureBackground: React.FC<PaperTextureBackgroundProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      {/* Opcional: agregar una imagen de textura de papel */}
      {/* <Image 
        source={require('../assets/paper-texture.jpg')} 
        style={styles.texture}
        resizeMode="repeat"
      /> */}
      <View style={styles.overlay} />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f4eb', // Color base de papel antiguo
  },
  texture: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.1, // Textura sutil
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(248, 244, 235, 0.8)', // Overlay para suavizar
  },
  content: {
    flex: 1,
  },
});

export default PaperTextureBackground;