import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import VintageButton from '../components/VintageButton';
import VintageInput from '../components/VintageInput'; // Asegúrate de tener este componente
import { Picker } from '@react-native-picker/picker';

type CreateHabitScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateHabit'>;

const CreateHabitScreen: React.FC = () => {
  const navigation = useNavigation<CreateHabitScreenNavigationProp>();
  const [habitName, setHabitName] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('😊');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [target, setTarget] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    target: '',
  });

  const validate = () => {
    let valid = true;
    const newErrors = { name: '', target: '' };

    if (!habitName.trim()) {
      newErrors.name = 'El nombre del hábito es obligatorio';
      valid = false;
    }

    if (!target.trim()) {
      newErrors.target = 'El objetivo es obligatorio';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (validate()) {
      // Aquí iría la lógica para crear el hábito
      // Por ahora solo navegamos atrás
      console.log('ok')
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Nuevo Hábito</Text>

        <VintageInput
          label="Nombre del hábito*"
          placeholder="Ej: Beber agua"
          value={habitName}
          onChangeText={setHabitName}
          error={errors.name}
          variant="filled"
        />

        <VintageInput
          label="Descripción (opcional)"
          placeholder="Ej: Beber 2 litros de agua al día"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          variant="filled"
        />

        <Text style={styles.label}>Emoji</Text>
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{emoji}</Text>
        </View>

        <Text style={styles.label}>Frecuencia*</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={frequency}
            onValueChange={(itemValue) => setFrequency(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Diario" value="daily" />
            <Picker.Item label="Semanal" value="weekly" />
            <Picker.Item label="Mensual" value="monthly" />
          </Picker>
        </View>

        <VintageInput
          label="Objetivo*"
          placeholder="Ej: 8 vasos al día"
          value={target}
          onChangeText={setTarget}
          error={errors.target}
          variant="filled"
        />

        <VintageButton
          title="Crear Hábito"
          onPress={handleSubmit}
          variant="primary"
          size="large"
          style={styles.submitButton}
        />

        <VintageButton
          title="Cancelar"
          onPress={() => navigation.goBack()}
          variant="info"
          size="medium"
          style={styles.cancelButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f0e8',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5c4b37',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Vintage-Typewriter',
  },
  label: {
    fontSize: 16,
    color: '#5c4b37',
    marginBottom: 8,
    fontFamily: 'Vintage-Typewriter',
  },
  emojiContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 40,
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: '#b08d57', // Color marrón vintage para el borde
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#f8f4e8', // Fondo beige claro
    overflow: 'hidden', // Para que los bordes redondeados se vean bien
    shadowColor: '#8b7d6b',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  picker: {
    height: 50,
    color: '#5c4b37', // Color texto marrón oscuro
    fontFamily: 'Vintage-Typewriter',
    fontSize: 16,
    // Para iOS: personalizamos la apariencia del Picker
    ...Platform.select({
      ios: {
        // En iOS, el Picker se ve diferente, así que ajustamos su contenedor
      },
      android: {
        // En Android, podemos estilizar el Picker directamente
        backgroundColor: 'transparent',
      },
    }),
  },
  // Estilo para el icono del Picker (solo iOS)
  pickerIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
    zIndex: 1,
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 10,
  },
  cancelButton: {
    marginBottom: 20,
  },
});

export default CreateHabitScreen;
