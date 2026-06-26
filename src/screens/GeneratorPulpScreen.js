import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Modal, FlatList } from 'react-native';
import { useCharacterStore } from '../store';
import { theme } from '../theme';

const CHARACTERISTICS = ['STR', 'DEX', 'INT', 'CON', 'APP', 'POW', 'SIZ', 'EDU'];

const TALENTS = [
  'Tough Guy', 'Quick Draw', 'Hardy', 'Keen Vision', 'Strong Willed', 
  'Resilient', 'Lucky', 'Fleet Footed', 'Nimble', 'Rapid Attack', 
  'Photographic Memory', 'Hardened', 'Smooth Talker', 'Sniper', 'Gadgeteer'
];

const DropdownPicker = ({ label, value, options, onSelect, placeholder }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        style={styles.dropdownButton} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.dropdownButtonText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <Text style={styles.dropdownIcon}>▼</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select {label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.optionItem}
                  onPress={() => {
                    onSelect(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[styles.optionText, value === item && styles.optionSelected]}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

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
        
        <DropdownPicker 
          label="Core Characteristic" 
          placeholder="Select characteristic..." 
          options={CHARACTERISTICS}
          value={coreCharacteristic}
          onSelect={setCoreCharacteristic}
        />
        <Text style={styles.helper}>The attribute that defines your archetype.</Text>

        <View style={{ marginTop: theme.spacing.l }} />

        <DropdownPicker 
          label="Pulp Talent 1" 
          placeholder="Select first talent..." 
          options={TALENTS}
          value={talent1}
          onSelect={setTalent1}
        />

        <DropdownPicker 
          label="Pulp Talent 2" 
          placeholder="Select second talent..." 
          options={TALENTS}
          value={talent2}
          onSelect={setTalent2}
        />

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
  formGroup: { marginBottom: theme.spacing.m },
  label: { color: theme.colors.textMuted, marginBottom: 4, fontWeight: 'bold' },
  helper: { color: theme.colors.textMuted, fontSize: 12, marginTop: -8, marginBottom: theme.spacing.m, fontStyle: 'italic' },
  
  dropdownButton: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: theme.spacing.m,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
  dropdownButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body,
  },
  placeholderText: {
    color: theme.colors.textMuted,
  },
  dropdownIcon: {
    color: theme.colors.textMuted,
    fontSize: 12,
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    maxHeight: '80%',
    padding: theme.spacing.m,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  modalTitle: {
    color: theme.colors.gold,
    fontSize: theme.typography.sizes.h3,
    fontWeight: 'bold',
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  optionItem: {
    paddingVertical: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
  },
  optionText: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body,
    textAlign: 'center',
  },
  optionSelected: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: theme.spacing.m,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
    borderRadius: 8,
    alignItems: 'center',
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  closeButtonText: {
    color: theme.colors.text,
    fontWeight: 'bold',
  },

  nextButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  nextButtonText: {
    color: theme.colors.background,
    fontWeight: 'bold',
    fontSize: theme.typography.sizes.body,
  }
});
