import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useCharacterStore } from '../store';
import { theme } from '../theme';

export default function GeneratorPulpScreen({ navigation }) {
  const updatePulpInfo = useCharacterStore((state) => state.updatePulpInfo);

  const [coreCharacteristic, setCoreCharacteristic] = useState('');
  const [talent1, setTalent1] = useState('');
  const [talent2, setTalent2] = useState('');

  const handleNext = () => {
    updatePulpInfo({
      coreCharacteristic,
      talents: [talent1, talent2].filter(t => t.trim() !== '')
    });
    navigation.navigate('GeneratorInfo');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Pulp Options</Text>
        <Text style={styles.subtitle}>
          Heroes in Pulp Cthulhu are exceptional. Define your Core Characteristic and 2 Pulp Talents.
        </Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Core Characteristic</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g. STR, DEX, INT..." 
            placeholderTextColor={theme.colors.textMuted}
            value={coreCharacteristic}
            onChangeText={setCoreCharacteristic}
          />
          <Text style={styles.helper}>The attribute that defines your archetype.</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Pulp Talent 1</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g. Tough Guy" 
            placeholderTextColor={theme.colors.textMuted}
            value={talent1}
            onChangeText={setTalent1}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Pulp Talent 2</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g. Quick Draw" 
            placeholderTextColor={theme.colors.textMuted}
            value={talent2}
            onChangeText={setTalent2}
          />
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next: Character Details</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: { padding: theme.spacing.m },
  title: {
    color: theme.colors.gold,
    fontSize: theme.typography.sizes.h2,
    fontWeight: 'bold',
    marginBottom: theme.spacing.s,
    fontFamily: theme.typography.fontFamilyPrimary,
    textAlign: 'center',
  },
  subtitle: {
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  formGroup: { marginBottom: theme.spacing.l },
  label: { color: theme.colors.textMuted, marginBottom: 4, fontWeight: 'bold' },
  helper: { color: theme.colors.textMuted, fontSize: 12, marginTop: 4, fontStyle: 'italic' },
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 8,
    color: theme.colors.text,
    padding: theme.spacing.m,
    fontSize: theme.typography.sizes.body,
  },
  nextButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: theme.spacing.l,
  },
  nextButtonText: {
    color: theme.colors.background,
    fontWeight: 'bold',
    fontSize: theme.typography.sizes.body,
  }
});
