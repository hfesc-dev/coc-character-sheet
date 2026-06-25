import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Modal, FlatList } from 'react-native';
import { useCharacterStore } from '../store';
import { theme } from '../theme';

const PULP_ARCHETYPES = [
  'Adventurer', 'Beefcake', 'Bon Vivant', 'Cold Reader', 
  'Dreamer', 'Egghead', 'Explorer', 'Femme Fatale', 
  'Grease Monkey', 'Hardboiled', 'Hunter', 'Mystic', 
  'Outsider', 'Rogue', 'Scholar', 'Sidekick', 
  'Soldier', 'Steadfast', 'Swashbuckler', 'Thrill Seeker'
];

export default function GeneratorInfoScreen({ navigation }) {
  const currentCharacter = useCharacterStore((state) => state.currentCharacter);
  const updateBaseInfo = useCharacterStore((state) => state.updateBaseInfo);
  const saveCharacter = useCharacterStore((state) => state.saveCharacter);

  const [name, setName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [age, setAge] = useState('');
  const [archetype, setArchetype] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleFinish = () => {
    updateBaseInfo({ name, occupation, age, archetype });
    saveCharacter();
    navigation.navigate('CharacterSheetTabs');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Investigator Details</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g. Harvey Walters" 
            placeholderTextColor={theme.colors.textMuted}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Occupation</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g. Journalist" 
            placeholderTextColor={theme.colors.textMuted}
            value={occupation}
            onChangeText={setOccupation}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Age</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g. 42" 
            placeholderTextColor={theme.colors.textMuted}
            keyboardType="number-pad"
            value={age}
            onChangeText={setAge}
          />
        </View>

        {currentCharacter.isPulp && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Pulp Archetype</Text>
            <TouchableOpacity 
              style={styles.input} 
              onPress={() => setModalVisible(true)}
            >
              <Text style={{ color: archetype ? theme.colors.text : theme.colors.textMuted }}>
                {archetype || 'Select an Archetype...'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity 
          style={styles.finishButton} 
          onPress={handleFinish}
          disabled={!name}
        >
          <Text style={styles.finishButtonText}>Complete & Save</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal for Archetype Selection */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Archetype</Text>
            <FlatList
              data={PULP_ARCHETYPES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.modalItem}
                  onPress={() => {
                    setArchetype(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: theme.spacing.xl,
    fontFamily: theme.typography.fontFamilyPrimary,
    textAlign: 'center',
  },
  formGroup: { marginBottom: theme.spacing.m },
  label: { color: theme.colors.textMuted, marginBottom: 4, fontWeight: 'bold' },
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 8,
    color: theme.colors.text,
    padding: theme.spacing.m,
    fontSize: theme.typography.sizes.body,
    justifyContent: 'center',
    height: 50,
  },
  finishButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  finishButtonText: {
    color: theme.colors.background,
    fontWeight: 'bold',
    fontSize: theme.typography.sizes.body,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: theme.spacing.m,
    height: '60%',
  },
  modalTitle: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.h3,
    fontWeight: 'bold',
    marginBottom: theme.spacing.m,
    textAlign: 'center',
  },
  modalItem: {
    padding: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalItemText: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body,
  },
  modalCloseButton: {
    marginTop: theme.spacing.m,
    padding: theme.spacing.m,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseText: {
    color: theme.colors.secondary,
    fontWeight: 'bold',
    fontSize: theme.typography.sizes.body,
  }
});


