import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  GestureResponderEvent,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import Header from './components/Header';
import HabitItem from './components/HabitItem';
import { mockHabits } from './data/habiits';
import { Habit, RootStackParamList } from './types';
import VintageButton from './components/VintageButton';
import { useVintageFonts } from './hooks/useVintageFonts';
import CreateHabitScreen from './components/CreateHabitScreen';

const Stack = createStackNavigator<RootStackParamList>();

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();
  const [habits, setHabits] = useState<Habit[]>(mockHabits);
  const [longPressedHabit, setLongPressedHabit] = useState<Habit | null>(null);

  // useEffect(async() => {

  // });

  const toggleHabit = (id: string) => {
    setHabits(prevHabits =>
      prevHabits.map(habit =>
        habit.id === id
          ? {
              ...habit,
              completed: !habit.completed,
              completedDates: habit.completed
                ? habit.completedDates.filter(d => d.getDate() !== new Date().getDate())
                : [...habit.completedDates, new Date()],
            }
          : habit
      )
    );
  };

  const handleLongPress = (event: GestureResponderEvent, habit: Habit) => {
    setLongPressedHabit(habit);
    Alert.alert(
      'Opciones',
      `¿Qué deseas hacer con "${habit.name}"?`,
      [
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteHabit(habit.id),
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  const deleteHabit = (id: string) => {
    setHabits(prevHabits => prevHabits.filter(habit => habit.id !== id));
  };

  const navigateToStatistics = () => {
    navigation.navigate('Statistics');
  };

  const navigateToCreateHabit = () => {
    navigation.navigate('CreateHabit');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header />
      <FlatList
        data={habits}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <HabitItem
            habit={item}
            onToggle={toggleHabit}
            onLongPress={handleLongPress}
          />
        )}
        contentContainerStyle={styles.list}
      />

      <View style={styles.longPressHint}>
        <Text style={styles.hintText}>
          Mantén presionado un hábito para ver más opciones
        </Text>
      </View>

      <View style={styles.bottomNav}>
        <VintageButton
          title="Estadísticas"
          onPress={navigateToStatistics}
          variant="secondary"
          size='medium'
        />

        <VintageButton
          title="Crear Hábito"
          onPress={navigateToCreateHabit}
          variant="primary"
          size='medium'
        />
      </View>
    </SafeAreaView>
  );
};

const StatisticsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text>Pantalla de Estadísticas</Text>
    </SafeAreaView>
  );
};

const App: React.FC = () => {
  const fontsLoaded = useVintageFonts();

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6c5ce7" />
        <Text>Cargando fuentes...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Statistics"
            component={StatisticsScreen}
            options={{ title: 'Estadísticas' }}
          />
          <Stack.Screen
            name="CreateHabit"
            component={CreateHabitScreen}
            options={{ title: 'Nuevo Hábito' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  list: {
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  longPressHint: {
    padding: 10,
    backgroundColor: '#f0e6d8',
    borderTopWidth: 1,
    borderTopColor: '#d4b483',
  },
  hintText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#8b7d6b',
    fontFamily: 'Vintage-Typewriter',
    fontStyle: 'italic',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f0e6d8',
    borderTopWidth: 2,
    borderTopColor: '#d4b483',
    shadowColor: '#8b7d6b',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  navButton: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.48,
  },
  statsButton: {
    backgroundColor: '#dfe6e9',
  },
  statsButtonText: {
    color: '#2d3436',
    fontWeight: '500',
  },
  createButton: {
    backgroundColor: '#6c5ce7',
  },
  createButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default App;
