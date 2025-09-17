import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Platform } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Header from './Header';
import { frequencyOptions, targetOptions } from '../constants/habitForm';

export interface Habit {
  id: string;
  name: string;
  description: string;
  emoji: string;
  completed: boolean;
  frequency: string;
  target: string;
  createdAt: Date;
  completedDates: Date[];
}

// Esquema de validación con Yup
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(30, 'El nombre no puede tener más de 30 caracteres')
    .required('El nombre es obligatorio'),
  description: Yup.string()
    .max(100, 'La descripción no puede tener más de 100 caracteres'),
  emoji: Yup.string()
    .max(2, 'Solo se permite un emoji')
    .required('El emoji es obligatorio'),
  frequency: Yup.string()
    .required('La frecuencia es obligatoria'),
  target: Yup.string()
    .required('El objetivo es obligatorio')
});

interface HabitFormProps {
  onSubmit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completedDates' | 'completed'>) => void;
  initialValues?: Partial<Habit>;
  editMode?: boolean;
}

const HabitForm: React.FC<HabitFormProps> = ({ onSubmit, initialValues, editMode = false }) => {
  const [showFrequencyOptions, setShowFrequencyOptions] = useState(false);
  const [showTargetOptions, setShowTargetOptions] = useState(false);

  const defaultValues = {
    name: '',
    description: '',
    emoji: '⭐',
    frequency: '',
    target: '',
    completed: false,
    ...initialValues
  };

  const handleSubmit = (values: any) => {
    onSubmit({
      name: values.name,
      description: values.description,
      emoji: values.emoji,
      frequency: values.frequency,
      target: values.target
    });
  };

  function setFieldValue(arg0: string, option: string) {
    
  }

  return (
    <ScrollView style={styles.container}>
      <Header />
      <Text style={styles.title}>{editMode ? 'Editar Hábito' : 'Crear Nuevo Hábito'}</Text>
      
      <Formik
        initialValues={defaultValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
          <View>
            {/* Campo Emoji */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Emoji</Text>
              <View style={styles.emojiContainer}>
                <TextInput
                  style={[styles.input, styles.emojiInput, errors.emoji && touched.emoji && styles.inputError]}
                  placeholder="⭐"
                  value={values.emoji}
                  onChangeText={handleChange('emoji')}
                  onBlur={handleBlur('emoji')}
                  maxLength={2}
                />
              </View>
              {errors.emoji && touched.emoji && (
                <Text style={styles.errorText}>{errors.emoji}</Text>
              )}
            </View>

            {/* Campo Nombre */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Nombre del hábito</Text>
              <TextInput
                style={[styles.input, errors.name && touched.name && styles.inputError]}
                placeholder="Ej: Beber agua"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
              />
              {errors.name && touched.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            {/* Campo Descripción */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Descripción (opcional)</Text>
              <TextInput
                style={[styles.input, styles.textArea, errors.description && touched.description && styles.inputError]}
                placeholder="Ej: Mantenerme hidratado durante el día"
                value={values.description}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                multiline
                numberOfLines={3}
              />
              {errors.description && touched.description && (
                <Text style={styles.errorText}>{errors.description}</Text>
              )}
            </View>

            {/* Campo Frecuencia */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Frecuencia</Text>
              <TouchableOpacity 
                style={[styles.input, styles.pickerInput, errors.frequency && touched.frequency && styles.inputError]}
                onPress={() => setShowFrequencyOptions(true)}
              >
                <Text style={values.frequency ? styles.pickerText : styles.placeholderText}>
                  {values.frequency || 'Selecciona una frecuencia'}
                </Text>
              </TouchableOpacity>
              {errors.frequency && touched.frequency && (
                <Text style={styles.errorText}>{errors.frequency}</Text>
              )}
            </View>

            {/* Campo Objetivo */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Objetivo</Text>
              <TouchableOpacity 
                style={[styles.input, styles.pickerInput, errors.target && touched.target && styles.inputError]}
                onPress={() => setShowTargetOptions(true)}
              >
                <Text style={values.target ? styles.pickerText : styles.placeholderText}>
                  {values.target || 'Selecciona un objetivo'}
                </Text>
              </TouchableOpacity>
              {errors.target && touched.target && (
                <Text style={styles.errorText}>{errors.target}</Text>
              )}
            </View>

            {/* Botón de enviar */}
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={() => handleSubmit()}
            >
              <Text style={styles.submitButtonText}>
                {editMode ? 'Actualizar Hábito' : 'Crear Hábito'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>

      {/* Modal de frecuencia */}
      <Modal
        visible={showFrequencyOptions}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFrequencyOptions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona una frecuencia</Text>
            <ScrollView>
              {frequencyOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.optionItem}
                  onPress={() => {
                    setFieldValue('frequency', option);
                    setShowFrequencyOptions(false);
                  }}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowFrequencyOptions(false)}
            >
              <Text style={styles.modalCloseText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de objetivo */}
      <Modal
        visible={showTargetOptions}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTargetOptions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona un objetivo</Text>
            <ScrollView>
              {targetOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.optionItem}
                  onPress={() => {
                    setFieldValue('target', option);
                    setShowTargetOptions(false);
                  }}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowTargetOptions(false)}
            >
              <Text style={styles.modalCloseText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f4eb',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5c4b37',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Vintage-Typewriter',
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5c4b37',
    marginBottom: 8,
    fontFamily: 'Vintage-Typewriter',
  },
  input: {
    borderWidth: 2,
    borderColor: '#c4a77d',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#5c4b37',
    fontFamily: 'Vintage-Typewriter',
    // Efectos vintage
    shadowColor: '#8b7d6b',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  inputError: {
    borderColor: '#8B0000',
  },
  errorText: {
    fontSize: 14,
    color: '#8B0000',
    marginTop: 4,
    fontFamily: 'Vintage-Typewriter',
  },
  emojiContainer: {
    alignItems: 'center',
  },
  emojiInput: {
    width: 60,
    textAlign: 'center',
    fontSize: 24,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerInput: {
    justifyContent: 'center',
  },
  pickerText: {
    color: '#5c4b37',
    fontSize: 16,
    fontFamily: 'Vintage-Typewriter',
  },
  placeholderText: {
    color: '#8b7d6b',
    fontSize: 16,
    fontFamily: 'Vintage-Typewriter',
  },
  submitButton: {
    backgroundColor: '#d4b483',
    borderWidth: 2,
    borderColor: '#a6855a',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    // Efectos vintage
    shadowColor: '#8b7d6b',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  submitButtonText: {
    color: '#5c4b37',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Vintage-Typewriter',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#f8f4eb',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
    borderWidth: 2,
    borderColor: '#c4a77d',
    // Efectos vintage
    shadowColor: '#8b7d6b',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5c4b37',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'Vintage-Typewriter',
  },
  optionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e6d7c1',
  },
  optionText: {
    fontSize: 16,
    color: '#5c4b37',
    fontFamily: 'Vintage-Typewriter',
  },
  modalClose: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#d4b483',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#a6855a',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#5c4b37',
    fontWeight: '600',
    fontFamily: 'Vintage-Typewriter',
  },
});

export default HabitForm;