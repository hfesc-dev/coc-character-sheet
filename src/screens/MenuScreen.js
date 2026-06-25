import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useCharacterStore } from '../store';
import { theme } from '../theme';

export default function MenuScreen({ navigation }) {
  const characters = useCharacterStore((state) => state.characters);
  const loadCharacter = useCharacterStore((state) => state.loadCharacter);
  const deleteCharacter = useCharacterStore((state) => state.deleteCharacter);

  const handleCreateNew = () => {
    navigation.navigate('GeneratorSetup');
  };

  const handleLoad = (id) => {
    loadCharacter(id);
    navigation.navigate('CharacterSheetTabs');
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity style={styles.cardContent} onPress={() => handleLoad(item.id)}>
        <Text style={styles.charName}>{item.name || 'Unknown Investigator'}</Text>
        <Text style={styles.charDetails}>
          {item.occupation || 'No Occupation'} • {item.isPulp ? 'Pulp' : 'Classic'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.deleteBtn} 
        onPress={() => deleteCharacter(item.id)}>
        <Text style={styles.deleteText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Call of Cthulhu</Text>
        <Text style={styles.subtitle}>Investigators</Text>

        <FlatList
          data={characters}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No investigators found. Create one to begin your descent into madness.</Text>
          }
        />

        <TouchableOpacity style={styles.createButton} onPress={handleCreateNew}>
          <Text style={styles.createButtonText}>Create New Investigator</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: { flex: 1, padding: theme.spacing.m },
  title: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.h1,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: theme.typography.fontFamilyPrimary,
    marginTop: theme.spacing.l,
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.sizes.h3,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  list: { paddingBottom: theme.spacing.xl },
  card: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: 8,
    marginBottom: theme.spacing.s,
    borderColor: theme.colors.border,
    borderWidth: 1,
    alignItems: 'center',
  },
  cardContent: { flex: 1 },
  charName: { color: theme.colors.text, fontSize: theme.typography.sizes.h3, fontWeight: 'bold' },
  charDetails: { color: theme.colors.textMuted, fontSize: theme.typography.sizes.small, marginTop: 4 },
  deleteBtn: { padding: theme.spacing.s },
  deleteText: { color: theme.colors.secondary, fontWeight: 'bold', fontSize: 18 },
  emptyText: { color: theme.colors.textMuted, textAlign: 'center', fontStyle: 'italic', marginVertical: theme.spacing.xl },
  createButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  createButtonText: { color: theme.colors.background, fontWeight: 'bold', fontSize: theme.typography.sizes.body },
});
