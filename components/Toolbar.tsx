import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getFormatDate } from '../utils';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const currentDate = new Date();

  return (
    <View style={styles.header}>
      <Text style={styles.dateDisplay}>{getFormatDate(currentDate)}</Text>
      {title && <Text style={styles.title}>{title}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  dateDisplay: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2d3436',
    textAlign: 'left',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#2d3436',
  },
});

export default Header;