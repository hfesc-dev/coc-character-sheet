import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useCharacterStore } from '../store';
import { theme } from '../theme';

const INITIAL_POOL = [80, 70, 60, 60, 50, 50, 50, 40];
const ATTR_NAMES = ['STR', 'DEX', 'INT', 'CON', 'APP', 'POW', 'SIZ', 'EDU'];

export default function GeneratorAttributesScreen({ navigation }) {
  const updateAttributes = useCharacterStore((state) => state.updateAttributes);
  const isPulp = useCharacterStore((state) => state.currentCharacter.isPulp);

  const [pool, setPool] = useState([...INITIAL_POOL]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [allocated, setAllocated] = useState({
    STR: null, DEX: null, INT: null, CON: null, APP: null, POW: null, SIZ: null, EDU: null
  });

  const handleSelectPoolValue = (val, index) => {
    setSelectedValue({ val, index });
  };

  const handleAssignToAttribute = (attr) => {
    if (selectedValue !== null) {
      const newAllocated = { ...allocated };
      const newPool = [...pool];

      // If the attribute already had a value, return it to the pool
      if (newAllocated[attr] !== null) {
        newPool.push(newAllocated[attr]);
      }

      newAllocated[attr] = selectedValue.val;
      newPool.splice(selectedValue.index, 1);
      newPool.sort((a, b) => b - a);

      setAllocated(newAllocated);
      setPool(newPool);
      setSelectedValue(null);
    } else if (allocated[attr] !== null) {
      // Tap an allocated attribute without a selected value to return it to the pool
      const newPool = [...pool, allocated[attr]].sort((a, b) => b - a);
      const newAllocated = { ...allocated, [attr]: null };
      setPool(newPool);
      setAllocated(newAllocated);
    }
  };

  const handleNext = () => {
    if (pool.length > 0) {
      Alert.alert('Incomplete', 'Please allocate all values to attributes before proceeding.');
      return;
    }
    updateAttributes(allocated);
    navigation.navigate('GeneratorSkills');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Quick-Fire Attributes</Text>
        <Text style={styles.subtitle}>
          Tap a value from the pool, then tap an attribute to assign it.
        </Text>

        <View style={styles.poolContainer}>
          {pool.map((val, idx) => (
            <TouchableOpacity 
              key={`pool-${idx}`} 
              style={[
                styles.poolBadge, 
                selectedValue?.index === idx && styles.poolBadgeSelected
              ]}
              onPress={() => handleSelectPoolValue(val, idx)}
            >
              <Text style={styles.poolText}>{val}</Text>
            </TouchableOpacity>
          ))}
          {pool.length === 0 && <Text style={styles.emptyPool}>All values assigned!</Text>}
        </View>

        <View style={styles.grid}>
          {ATTR_NAMES.map(attr => (
            <TouchableOpacity 
              key={attr} 
              style={styles.attrBox}
              onPress={() => handleAssignToAttribute(attr)}
            >
              <Text style={styles.attrLabel}>{attr}</Text>
              <Text style={styles.attrValue}>{allocated[attr] || '--'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.nextButton, pool.length > 0 && styles.nextButtonDisabled]} 
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next: Character Details</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: { padding: theme.spacing.m, alignItems: 'center' },
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
    marginBottom: theme.spacing.l,
  },
  poolContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
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
  poolText: {
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  emptyPool: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    padding: theme.spacing.s,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  attrBox: {
    width: 70,
    height: 70,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 8,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attrLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.sizes.small,
    fontWeight: 'bold',
  },
  attrValue: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.h2,
    fontWeight: 'bold',
    marginTop: 4,
  },
  nextButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: theme.colors.surface,
  },
  nextButtonText: {
    color: theme.colors.background,
    fontWeight: 'bold',
    fontSize: theme.typography.sizes.body,
  }
});
