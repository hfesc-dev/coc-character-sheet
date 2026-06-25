import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCharacterStore } from '../store';
import { theme } from '../theme';

export default function BackgroundScreen() {
  const navigation = useNavigation();
  const character = useCharacterStore((state) => state.currentCharacter);

  const background = character.background || {
    personalDescription: '',
    ideology: '',
    significantPeople: '',
    meaningfulLocations: '',
    treasuredPossessions: '',
    traits: '',
    injuries: '',
    phobias: '',
    arcaneTomes: '',
  };
  const inventory = character.inventory || [];
  const notes = character.notes || '';

  const renderBackgroundSection = (title, content) => {
    if (!content) return null;
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionContent}>{content}</Text>
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
        <Text style={styles.headerTitle}>Background</Text>

        <View style={styles.card}>
          {renderBackgroundSection('Personal Description', background.personalDescription)}
          {renderBackgroundSection('Ideology / Beliefs', background.ideology)}
          {renderBackgroundSection('Significant People', background.significantPeople)}
          {renderBackgroundSection('Meaningful Locations', background.meaningfulLocations)}
          {renderBackgroundSection('Treasured Possessions', background.treasuredPossessions)}
          {renderBackgroundSection('Traits', background.traits)}
          
          <View style={styles.divider} />
          
          {renderBackgroundSection('Injuries & Scars', background.injuries)}
          {renderBackgroundSection('Phobias & Manias', background.phobias)}
          {renderBackgroundSection('Arcane Tomes, Spells & Artifacts', background.arcaneTomes)}
          
          {(!background.personalDescription && !background.ideology && !background.traits) && (
            <Text style={styles.emptyText}>No background information recorded yet.</Text>
          )}
        </View>

        <Text style={styles.headerTitle}>Inventory & Notes</Text>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Possessions</Text>
          {inventory.length > 0 ? (
            inventory.map((item, idx) => (
              <View key={idx} style={styles.itemRow}>
                <Text style={styles.itemBullet}>•</Text>
                <Text style={styles.itemText}>{item}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Empty inventory.</Text>
          )}

          {notes ? (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Notes</Text>
              <Text style={styles.sectionContent}>{notes}</Text>
            </>
          ) : null}
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
    paddingBottom: theme.spacing.xxl,
  },
  headerTitle: {
    color: theme.colors.gold,
    fontSize: theme.typography.sizes.h2,
    fontWeight: 'bold',
    marginBottom: theme.spacing.m,
    fontFamily: theme.typography.fontFamilyPrimary,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: 8,
    marginBottom: theme.spacing.xl,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  sectionContainer: {
    marginBottom: theme.spacing.m,
  },
  sectionTitle: {
    color: theme.colors.secondary,
    fontSize: theme.typography.sizes.body,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
  },
  sectionContent: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.m,
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.sizes.body,
    fontStyle: 'italic',
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xs,
  },
  itemBullet: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.body,
    marginRight: theme.spacing.s,
  },
  itemText: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body,
    flex: 1,
  }
});
