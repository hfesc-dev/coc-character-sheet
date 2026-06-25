import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useCharacterStore } from '../store';
import { theme } from '../theme';

const SKILL_POOL = [70, 60, 60, 50, 50, 50, 40, 40, 40];
const SKILL_NAMES = [
  'Accounting', 'Appraise', 'Brawl', 'Charm', 'Credit Rating',
  'Dodge', 'Drive Auto', 'Fast Talk', 'Firearms', 'First Aid',
  'Library Use', 'Listen', 'Persuade', 'Psychology', 'Spot Hidden',
  'Stealth'
];

export default function GeneratorSkillsScreen({ navigation }) {
  const updateSkills = useCharacterStore((state) => state.updateSkills);
  const isPulp = useCharacterStore((state) => state.currentCharacter.isPulp);

  const [pool, setPool] = useState([...SKILL_POOL]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [allocated, setAllocated] = useState({});

  const handleSelectPoolValue = (val, index) => {
    setSelectedValue({ val, index });
  };

  const handleAssignToSkill = (skill) => {
    if (selectedValue !== null) {
      const newAllocated = { ...allocated };
      const newPool = [...pool];

      if (newAllocated[skill]) {
        newPool.push(newAllocated[skill]);
      }

      newAllocated[skill] = selectedValue.val;
      newPool.splice(selectedValue.index, 1);
      newPool.sort((a, b) => b - a);

      setAllocated(newAllocated);
      setPool(newPool);
      setSelectedValue(null);
    } else if (allocated[skill]) {
      const newPool = [...pool, allocated[skill]].sort((a, b) => b - a);
      const newAllocated = { ...allocated };
      delete newAllocated[skill];
      setPool(newPool);
      setAllocated(newAllocated);
    }
  };

  const handleNext = () => {
    if (pool.length > 0) {
      Alert.alert('Incomplete', 'Please allocate all values to skills before proceeding.');
      return;
    }
    updateSkills(allocated);
    if (isPulp) {
      navigation.navigate('GeneratorPulp');
    } else {
      navigation.navigate('GeneratorInfo');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Quick-Fire Skills</Text>
        <Text style={styles.subtitle}>
          Assign values to your most important skills.
        </Text>

        <View style={styles.poolContainer}>
          {pool.map((val, idx) => (
            <TouchableOpacity 
              key={`pool-${idx}`} 
              style={[styles.poolBadge, selectedValue?.index === idx && styles.poolBadgeSelected]}
              onPress={() => handleSelectPoolValue(val, idx)}
            >
              <Text style={styles.poolText}>{val}</Text>
            </TouchableOpacity>
          ))}
          {pool.length === 0 && <Text style={styles.emptyPool}>All values assigned!</Text>}
        </View>

        <ScrollView style={styles.skillsList} contentContainerStyle={styles.skillsContent}>
          {SKILL_NAMES.map(skill => (
            <TouchableOpacity 
              key={skill} 
              style={styles.skillRow}
              onPress={() => handleAssignToSkill(skill)}
            >
              <Text style={styles.skillName}>{skill}</Text>
              <Text style={styles.skillValue}>{allocated[skill] || '--'}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity 
          style={[styles.nextButton, pool.length > 0 && styles.nextButtonDisabled]} 
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {isPulp ? 'Next: Pulp Details' : 'Next: Character Details'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: { flex: 1, padding: theme.spacing.m, alignItems: 'center' },
  title: {
    color: theme.colors.gold,
    fontSize: theme.typography.sizes.h2,
    fontWeight: 'bold',
    marginBottom: theme.spacing.s,
    fontFamily: theme.typography.fontFamilyPrimary,
  },
  subtitle: {
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: theme.spacing.m,
  },
  poolContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: theme.spacing.s,
    minHeight: 50,
  },
  poolBadge: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    padding: theme.spacing.s,
    margin: 4,
    borderRadius: 20,
    width: 40,
    alignItems: 'center',
  },
  poolBadgeSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },
  poolText: { color: theme.colors.text, fontWeight: 'bold' },
  emptyPool: { color: theme.colors.primary, fontWeight: 'bold', padding: theme.spacing.s },
  skillsList: {
    flex: 1,
    width: '100%',
    marginBottom: theme.spacing.m,
  },
  skillsContent: {
    paddingBottom: theme.spacing.xl,
  },
  skillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    marginBottom: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  skillName: { color: theme.colors.text, fontSize: theme.typography.sizes.body },
  skillValue: { color: theme.colors.gold, fontWeight: 'bold', fontSize: theme.typography.sizes.body },
  nextButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  nextButtonDisabled: { backgroundColor: theme.colors.surface },
  nextButtonText: {
    color: theme.colors.background,
    fontWeight: 'bold',
    fontSize: theme.typography.sizes.body,
  }
});
