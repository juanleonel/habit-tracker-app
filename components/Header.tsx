import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header: React.FC = () => {
  const formatDate = () => {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const months = [
      'ene', 'feb', 'mar', 'abr', 'may', 'jun',
      'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  };

  return (
    <View style={styles.header}>
      <Text style={styles.dateDisplay}>{formatDate()}</Text>
    </View>
  );
};

// const styles = StyleSheet.create({
//   header: {
//     padding: 24,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#eaeaea',
//   },
//   dateDisplay: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#2d3436',
//     textAlign: 'left',
//   },
// });

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: '#f0e6d8', // Fondo papel vintage
    borderBottomWidth: 2,
    borderBottomColor: '#d4b483', // Borde inferior dorado
    // Efecto de textura vintage
    shadowColor: '#8b7d6b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  dateDisplay: {
    fontSize: 20,
    fontWeight: '600',
    color: '#5c4b37', // Texto marrón vintage
    textAlign: 'left',
    fontFamily: 'Vintage-Typewriter',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#5c4b37', // Texto marrón vintage
    fontFamily: 'Vintage-Typewriter',
  },
});
export default Header;