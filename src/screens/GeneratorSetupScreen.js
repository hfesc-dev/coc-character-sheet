import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useCharacterStore } from '../store';
import { theme } from '../theme';

export default function GeneratorSetupScreen({ navigation }) {
  const startNewCharacter = useCharacterStore((state) => state.startNewCharacter);

  const handleSelectMode = (isPulp) => {
    startNewCharacter(isPulp);
    navigation.navigate('GeneratorAttributes');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Select Campaign Type</Text>

        <TouchableOpacity style={styles.card} onPress={() => handleSelectMode(false)}>
          <Text style={styles.cardTitle}>Classic Cthulhu</Text>
          <Text style={styles.cardDesc}>
            Standard rules. Investigators are fragile and sanity is fleeting.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => handleSelectMode(true)}>
          <Text style={styles.cardTitle}>Pulp Cthulhu</Text>
          <Text style={styles.cardDesc}>
            Action-packed. Double hit points, archetypes, and heroic talents.
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: { flex: 1, padding: theme.spacing.m, justifyContent: 'center' },
  title: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.h2,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    fontFamily: theme.typography.fontFamilyPrimary,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.l,
    borderRadius: 8,
    marginBottom: theme.spacing.m,
    borderColor: theme.colors.border,
    borderWidth: 1,
    alignItems: 'center',
  },
  cardTitle: {
    color: theme.colors.gold,
    fontSize: theme.typography.sizes.h3,
    fontWeight: 'bold',
    marginBottom: theme.spacing.s,
  },
  cardDesc: {
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  }
});
