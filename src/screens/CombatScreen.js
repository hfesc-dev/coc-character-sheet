import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCharacterStore } from '../store';
import { theme } from '../theme';

export default function CombatScreen() {
  const navigation = useNavigation();
  const character = useCharacterStore((state) => state.currentCharacter);

  const combat = character.combat || { damageBonus: '0', build: 0, weapons: [] };
  const baseDodge = Math.floor((character.attributes?.DEX || 0) / 2);
  const dodge = character.skills?.['Dodge'] || baseDodge;
  const brawl = character.skills?.['Brawl'] || 25;
  const firearms = character.skills?.['Firearms (Handgun)'] || 20;

  const renderCombatStat = (label, value) => (
    <View style={styles.statBox}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  const renderSkillBox = (label, value) => {
    const half = Math.floor(value / 2);
    const fifth = Math.floor(value / 5);
    return (
      <View style={styles.skillBox}>
        <Text style={styles.skillLabel}>{label}</Text>
        <View style={styles.skillValuesWrapper}>
          <View style={styles.mainValueBox}>
            <Text style={styles.mainValue}>{value}</Text>
          </View>
          <View style={styles.subValuesContainer}>
            <View style={styles.subValueBox}><Text style={styles.subValue}>{half}</Text></View>
            <View style={[styles.subValueBox, {marginBottom: 0}]}><Text style={styles.subValue}>{fifth}</Text></View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
          <Text style={styles.backButton}>← Menu</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.headerTitle}>Combat</Text>

        <View style={styles.statsRow}>
          {renderCombatStat('Damage Bonus', combat.damageBonus)}
          {renderCombatStat('Build (Corpo)', combat.build)}
        </View>

        <Text style={styles.sectionTitle}>Combat Skills</Text>
        <View style={styles.skillsRow}>
          {renderSkillBox('Dodge', dodge)}
          {renderSkillBox('Brawl', brawl)}
          {renderSkillBox('Handguns', firearms)}
        </View>

        <View style={styles.weaponsSection}>
          <View style={styles.weaponsHeader}>
            <Text style={styles.sectionTitle}>Weapons</Text>
          </View>
          
          {combat.weapons && combat.weapons.length > 0 ? (
            combat.weapons.map((w, idx) => (
              <View key={idx} style={styles.weaponCard}>
                <Text style={styles.weaponName}>{w.name}</Text>
                <Text style={styles.weaponDamage}>Damage: {w.damage}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No weapons equipped.</Text>
            </View>
          )}
        </View>

      </ScrollView>
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
  content: {
    padding: theme.spacing.m,
  },
  headerTitle: {
    color: theme.colors.gold,
    fontSize: theme.typography.sizes.h2,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xl,
    fontFamily: theme.typography.fontFamilyPrimary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  statBox: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: 8,
    marginHorizontal: theme.spacing.xs,
    alignItems: 'center',
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  statLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.sizes.small,
    fontWeight: 'bold',
    marginBottom: theme.spacing.s,
    textTransform: 'uppercase',
  },
  statValue: {
    color: theme.colors.secondary,
    fontSize: theme.typography.sizes.h2,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: theme.colors.gold,
    fontSize: theme.typography.sizes.h3,
    fontWeight: 'bold',
    marginBottom: theme.spacing.m,
    fontFamily: theme.typography.fontFamilyPrimary,
  },
  skillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.xl,
  },
  skillBox: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.s,
    borderRadius: 8,
    marginHorizontal: theme.spacing.xs,
    marginBottom: theme.spacing.m,
    minWidth: '30%',
    alignItems: 'center',
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  skillLabel: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
  },
  skillValuesWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainValueBox: {
    padding: 6,
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 4,
    marginRight: 4,
    minWidth: 36,
    alignItems: 'center',
  },
  mainValue: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.h3,
    fontWeight: 'bold',
  },
  subValuesContainer: {
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
  subValue: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: 'bold',
  },
  weaponsSection: {
    marginTop: theme.spacing.m,
  },
  weaponsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  weaponCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: 8,
    marginBottom: theme.spacing.s,
    borderColor: theme.colors.border,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weaponName: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body,
    fontWeight: 'bold',
  },
  weaponDamage: {
    color: theme.colors.secondary,
    fontSize: theme.typography.sizes.body,
    fontWeight: 'bold',
  },
  emptyState: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    borderStyle: 'dashed',
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.sizes.body,
  }
});
