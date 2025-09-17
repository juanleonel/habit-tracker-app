import { Picker } from '@react-native-picker/picker';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, Platform, Alert, ActivityIndicator, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native';

import { AppConstants } from '../constants/appConstants';
import { Habit, RootStackParamList } from '../types';
import VintageButton from '../components/VintageButton';
import VintageInput from '../components/VintageInput';
import { createHabitLabels } from '../labels/createHabitLabels';
import SQLiteService from '../utils/SqliteService';

type CreateHabitScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateHabit'>;

const CreateHabitScreen: React.FC = () => {
  const navigation = useNavigation<CreateHabitScreenNavigationProp>();
  const [habitName, setHabitName] = useState(AppConstants.emptyString);
  const [description, setDescription] = useState(AppConstants.emptyString);
  const [emoji, setEmoji] = useState('😊');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [target, setTarget] = useState(AppConstants.emptyString);
  const [errors, setErrors] = useState({
    name: AppConstants.emptyString,
    target: AppConstants.emptyString,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    try {
      const initDataDb = async () => {
        await SQLiteService.init();
      };
      initDataDb();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const validate = () => {
    let valid = true;
    const newErrors = { name: AppConstants.emptyString, target: AppConstants.emptyString };

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

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const habitData = {
        name: habitName,
        description: description,
        emoji: emoji,
        completed: false,
        frequency: frequency,
        target: target
      };

      await SQLiteService.addHabit(habitData);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el hábito');
    } finally {
      setLoading(false);
    }
  }, [habitName, description, emoji, frequency, target, navigation]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#5c4b37" />
        <Text style={styles.loadingText}>Cargando hábitos...</Text>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Text style={styles.title}>{createHabitLabels.title}</Text>
              <VintageInput
                label={createHabitLabels.habitName}
                placeholder={createHabitLabels.habitPlaceholder}
                value={habitName}
                onChangeText={setHabitName}
                error={errors.name}
                variant="filled"
              />
              <VintageInput
                label={createHabitLabels.description}
                placeholder={createHabitLabels.descriptionPlaceholder}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                variant="filled"
              />
              <Text style={styles.label}>{createHabitLabels.emoji}</Text>
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
                label={createHabitLabels.target}
                placeholder={createHabitLabels.targetPlaceholder}
                value={target}
                onChangeText={setTarget}
                error={errors.target}
                variant="filled"
              />
              <VintageButton
                title={createHabitLabels.create}
                onPress={handleSubmit}
                variant="primary"
                size="large"
                style={styles.submitButton}
              />
              <VintageButton
                title={createHabitLabels.cancel}
                onPress={() => navigation.goBack()}
                variant="info"
                size="medium"
                style={styles.cancelButton}
              />
            </ScrollView>
          </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
    borderColor: '#b08d57',
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#f8f4e8',
    overflow: 'hidden',
    shadowColor: '#8b7d6b',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  picker: {
    height: 50,
    color: '#5c4b37',
    fontFamily: 'Vintage-Typewriter',
    fontSize: 16,
    ...Platform.select({
      ios: { },
      android: {
        backgroundColor: 'transparent',
      },
    }),
  },
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f4eb',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#5c4b37',
    fontFamily: 'Vintage-Typewriter',
  },
});

export default CreateHabitScreen;
