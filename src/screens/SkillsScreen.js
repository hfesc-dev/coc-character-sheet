import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCharacterStore } from '../store';
import { theme } from '../theme';

const BASE_SKILLS = [
  { name: 'Accounting', base: 5 },
  { name: 'Appraise', base: 5 },
  { name: 'Brawl', base: 25 },
  { name: 'Charm', base: 15 },
  { name: 'Credit Rating', base: 0 },
  { name: 'Dodge', base: 0 }, // base is half DEX, handled below
  { name: 'Drive Auto', base: 20 },
  { name: 'Fast Talk', base: 5 },
  { name: 'Firearms (Handgun)', base: 20 },
  { name: 'First Aid', base: 30 },
  { name: 'Library Use', base: 20 },
  { name: 'Listen', base: 20 },
  { name: 'Persuade', base: 10 },
  { name: 'Psychology', base: 10 },
  { name: 'Spot Hidden', base: 25 },
  { name: 'Stealth', base: 20 },
];

const SkillItem = ({ name, value, isChecked, onToggle }) => {
  const half = Math.floor(value / 2);
  const fifth = Math.floor(value / 5);

  return (
    <TouchableOpacity style={styles.skillRow} activeOpacity={0.7} onPress={onToggle}>
      <View style={styles.skillNameContainer}>
        <View style={[styles.checkbox, isChecked && styles.checkboxChecked]} />
        <Text style={styles.skillName}>{name}</Text>
      </View>
      
      <View style={styles.skillValues}>
        <View style={styles.mainValueBox}>
          <Text style={styles.mainValue}>{value}</Text>
        </View>
        <View style={styles.subValues}>
          <View style={styles.subValueBox}>
            <Text style={styles.subValue}>{half}</Text>
          </View>
          <View style={[styles.subValueBox, styles.extremeBox]}>
            <Text style={styles.subValue}>{fifth}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function SkillsScreen() {
  const navigation = useNavigation();
  const character = useCharacterStore((state) => state.currentCharacter);
  const toggleSkillCheck = useCharacterStore((state) => state.toggleSkillCheck);
  const saveCharacter = useCharacterStore((state) => state.saveCharacter);

  // Merge base skills with allocated skills
  const skillsData = BASE_SKILLS.map(skill => {
    let baseVal = skill.base;
    if (skill.name === 'Dodge') {
      baseVal = Math.floor((character.attributes.DEX || 0) / 2);
    }
    const allocated = character.skills?.[skill.name] || 0;
    return {
      id: skill.name,
      name: skill.name,
      value: allocated > 0 ? allocated : baseVal
    };
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
          <Text style={styles.backButton}>← Menu</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Skills</Text>
        <FlatList
          data={skillsData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SkillItem 
              name={item.name} 
              value={item.value} 
              isChecked={!!character.skillChecks?.[item.name]}
              onToggle={() => {
                toggleSkillCheck(item.name);
                saveCharacter();
              }}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerBar: {
    padding: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.body,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
  },

  headerTitle: {
    color: theme.colors.gold,
    fontSize: theme.typography.sizes.h2,
    fontWeight: 'bold',
    margin: theme.spacing.m,
    fontFamily: theme.typography.fontFamilyPrimary,
  },
  listContent: {
    paddingHorizontal: theme.spacing.m,
    paddingBottom: theme.spacing.xl,
  },
  skillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.s,
    marginBottom: theme.spacing.s,
    borderRadius: 8,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  skillNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: theme.colors.textMuted,
    marginRight: theme.spacing.s,
  },
  checkboxChecked: {
    backgroundColor: theme.colors.gold,
    borderColor: theme.colors.gold,
  },
  skillName: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body,
  },
  skillValues: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 70,
    justifyContent: 'flex-end',
  },
  mainValueBox: {
    padding: theme.spacing.s,
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 4,
    marginRight: 4,
    minWidth: 40,
    alignItems: 'center',
  },
  mainValue: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.h3,
    fontWeight: 'bold',
  },
  subValues: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 38,
  },
  subValueBox: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    alignItems: 'center',
    marginBottom: 2,
    minWidth: 26,
  },
  extremeBox: {
    marginBottom: 0,
  },
  subValue: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: 'bold',
  }
});
