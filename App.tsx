import React, { useState } from 'react';
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
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Header from './components/Header';
import HabitItem from './components/HabitItem';
import { mockHabits } from './data/habiits';
import { Habit, RootStackParamList } from './types';
import VintageButton from './components/VintageButton';
import { useVintageFonts } from './hooks/useVintageFonts';
import VintageInput from './components/VintageInput';

const Stack = createStackNavigator<RootStackParamList>();

// Ajustamos HomeScreen para usar SafeAreaView
const HomeScreen: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>(mockHabits);
  const [longPressedHabit, setLongPressedHabit] = useState<Habit | null>(null);

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
    Alert.alert('Navegar', 'Ir a estadísticas');
  };

  const navigateToCreateHabit = () => {
    Alert.alert('Navegar', 'Crear nuevo hábito');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header />
      <VintageInput
        label="Correo electrónico"
        placeholder="tu@email.com"
        variant="filled"
        onChangeText={(text) => console.log(text)}
      />

      <VintageInput
        label="Contraseña"
        placeholder="Ingresa tu contraseña"
        secureTextEntry
        error="La contraseña es demasiado corta"
      />
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
          disabled={true}
          onPress={navigateToStatistics}
          variant="secondary"
          size='small'
        />

        <VintageButton
          title="Eliminar Hábito"
          onPress={() => longPressedHabit && deleteHabit(longPressedHabit.id)}
          variant="danger"
          size='small'
        />
        <VintageButton
          title="Advertencia"
          onPress={() => Alert.alert('Advertencia', 'Esto es una advertencia')}
          variant="warning"
          size='small'
        />

        <VintageButton
          title="Crear Hábito"
          onPress={navigateToCreateHabit}
          variant="primary"
          size='small'
        />
      </View>
    </SafeAreaView>
  );
};

// Ajustamos las otras pantallas para usar SafeAreaView
const StatisticsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text>Pantalla de Estadísticas</Text>
    </SafeAreaView>
  );
};

const CreateHabitScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text>Pantalla de Crear Hábito</Text>
    </SafeAreaView>
  );
};

// Ajustamos el componente principal App para incluir SafeAreaProvider
const App: React.FC = () => {
  // Usamos el hook para cargar las fuentes
  const fontsLoaded = useVintageFonts();

  // Mientras las fuentes se cargan, mostramos un indicador de carga
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

// Ajustamos los estilos para que funcionen bien con SafeAreaView
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Fondo transparente para que se vea el global
  },
  list: {
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  longPressHint: {
    padding: 10,
    backgroundColor: '#f0e6d8', // Fondo vintage claro con textura
    borderTopWidth: 1,
    borderTopColor: '#d4b483', // Borde dorado vintage
  },
  hintText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#8b7d6b', // Texto sepia
    fontFamily: 'Vintage-Typewriter',
    fontStyle: 'italic',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f0e6d8', // Fondo vintage
    borderTopWidth: 2,
    borderTopColor: '#d4b483', // Borde superior dorado
    // Efecto de textura vintage
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
