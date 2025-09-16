import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import { Habit } from '../types';

interface HabitItemProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onLongPress: (event: GestureResponderEvent, habit: Habit) => void;
}

const HabitItem: React.FC<HabitItemProps> = ({ habit, onToggle, onLongPress }) => {
  return (
    <TouchableOpacity
      style={styles.habitItem}
      onLongPress={(e) => onLongPress(e, habit)}
      delayLongPress={500}
    >
      <View style={styles.habitThumbnail}>
        <Text style={styles.emoji}>{habit.emoji}</Text>
      </View>
      <View style={styles.habitInfo}>
        <Text style={styles.habitName}>{habit.name}</Text>
        <Text style={styles.habitDetails}>
          {habit.frequency} • {habit.target}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.habitCheck, habit.completed && styles.checked]}
        onPress={() => onToggle(habit.id)}
      >
        {habit.completed && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

// const styles = StyleSheet.create({
//   habitItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f1f2f6',
//   },
//   habitThumbnail: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: '#74b9ff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   emoji: {
//     fontSize: 20,
//   },
//   habitInfo: {
//     flex: 1,
//   },
//   habitName: {
//     fontWeight: '500',
//     fontSize: 16,
//     marginBottom: 4,
//     color: '#2d3436',
//   },
//   habitDetails: {
//     fontSize: 13,
//     color: '#636e72',
//   },
//   habitCheck: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     borderWidth: 2,
//     borderColor: '#b2bec3',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   checked: {
//     backgroundColor: '#00b894',
//     borderColor: '#00b894',
//   },
//   checkmark: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

const styles = StyleSheet.create({
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e8ded1', // Color sepia claro
    backgroundColor: '#faf7f2', // Fondo vintage claro
  },
  habitThumbnail: {
    marginRight: 16,
    marginLeft: 8,
  },
  vintageFrame: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e6d7c1', // Color papel antiguo
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#c4a77d', // Borde dorado desgastado
    // Efectos de sombra para profundidad vintage
    shadowColor: '#8b7d6b',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  emoji: {
    fontSize: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.2)', // Sombra de texto vintage
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
    color: '#5c4b37',
    fontFamily: 'Vintage Typewriter',
    // Descomenta la línea de arriba después de instalar las fuentes
  },
  habitDetails: {
    fontSize: 13,
    color: '#8b7d6b', // Color texto sepia
    fontStyle: 'italic', // Estilo italic vintage
  },
  habitCheck: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#c4a77d', // Borde dorado vintage
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0e6d8', // Fondo vintage
    // Efectos vintage para el check
    shadowColor: '#8b7d6b',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  checked: {
    backgroundColor: '#d4b483', // Dorado antique para completado
    borderColor: '#b08d57', // Borde dorado más oscuro
  },
  checkmark: {
    color: '#5c4b37', // Color texto marrón vintage
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  
});

export default HabitItem;