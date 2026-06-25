import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, FlatList, Alert } from 'react-native';
import { theme } from '../theme';
import { adventureService } from '../services/adventureService';
import { authService } from '../services/authService';

export default function PlayerHubScreen({ navigation }) {
  const [code, setCode] = useState('');
  const [connectedAdventures, setConnectedAdventures] = useState([]);
  const handleJoin = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      Alert.alert('Error', 'Please enter an adventure code.');
      return;
    }

    const user = authService.getCurrentUser();
    if (!user) {
      Alert.alert('Error', 'Not logged in!');
      return;
    }

    try {
      const adventure = await adventureService.findByCode(trimmed);
      if (!adventure) {
        Alert.alert('Not Found', `No adventure found with code "${trimmed}".`);
        return;
      }

      // Check if already connected
      if (connectedAdventures.find(a => a.id === adventure.id)) {
        Alert.alert('Already Connected', 'You are already in this adventure.');
        return;
      }

      // Add player to adventure in Firestore
      await adventureService.addPlayer(adventure.id, user.uid, {});

      setConnectedAdventures(prev => [...prev, adventure]);
      setCode('');
      Alert.alert('Connected!', `You joined "${adventure.name}". Create or link your character sheet.`);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>🔍 Player Hub</Text>

        {/* Join Adventure */}
        <View style={styles.joinSection}>
          <Text style={styles.sectionTitle}>Join an Adventure</Text>
          <Text style={styles.hint}>Enter the code your GM shared with you.</Text>
          <View style={styles.codeInputRow}>
            <TextInput
              style={styles.codeInput}
              placeholder="CTH-XXXX"
              placeholderTextColor={theme.colors.textMuted}
              autoCapitalize="characters"
              value={code}
              onChangeText={setCode}
              maxLength={8}
            />
            <TouchableOpacity style={styles.joinButton} onPress={handleJoin}>
              <Text style={styles.joinButtonText}>Join</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Connected Adventures */}
        <View style={styles.adventuresSection}>
          <Text style={styles.sectionTitle}>Your Adventures</Text>
          {connectedAdventures.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No adventures yet.</Text>
              <Text style={styles.emptyHint}>Join one using the code above, or play offline.</Text>
            </View>
          ) : (
            <FlatList
              data={connectedAdventures}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.adventureCard}
                  onPress={() => {
                    // Navigate to character sheet within this adventure
                    navigation.navigate('Menu');
                  }}
                >
                  <Text style={styles.adventureName}>{item.name}</Text>
                  <Text style={styles.adventureGm}>Keeper: {item.gmName}</Text>
                  <Text style={styles.adventureCode}>{item.code}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        {/* Messages */}
        <TouchableOpacity 
          style={styles.messagesButton}
          onPress={() => navigation.navigate('PlayerMessages')}
        >
          <Text style={styles.messagesButtonText}>📜 View Messages from NPCs</Text>
        </TouchableOpacity>

        {/* Offline */}
        <TouchableOpacity 
          style={styles.offlineButton}
          onPress={() => navigation.navigate('Menu')}
        >
          <Text style={styles.offlineText}>Play Offline →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: { flex: 1, padding: theme.spacing.m },
  headerBar: { marginBottom: theme.spacing.m },
  backText: { color: theme.colors.primary, fontWeight: 'bold' },
  title: {
    color: theme.colors.gold,
    fontSize: theme.typography.sizes.h1,
    fontWeight: 'bold',
    fontFamily: theme.typography.fontFamilyPrimary,
    marginBottom: theme.spacing.xl,
  },
  joinSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    color: theme.colors.gold,
    fontSize: theme.typography.sizes.h3,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  hint: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginBottom: theme.spacing.m,
  },
  codeInputRow: {
    flexDirection: 'row',
    gap: theme.spacing.s,
  },
  codeInput: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 8,
    color: theme.colors.text,
    padding: theme.spacing.m,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
    textAlign: 'center',
  },
  joinButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: 8,
    justifyContent: 'center',
  },
  joinButtonText: {
    color: theme.colors.background,
    fontWeight: 'bold',
    fontSize: theme.typography.sizes.body,
  },
  adventuresSection: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: theme.spacing.xl,
  },
  emptyText: { color: theme.colors.text, fontWeight: 'bold' },
  emptyHint: { color: theme.colors.textMuted, marginTop: 4, fontSize: 12 },
  adventureCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: 8,
    marginBottom: theme.spacing.s,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  adventureName: { color: theme.colors.text, fontWeight: 'bold', fontSize: theme.typography.sizes.body },
  adventureGm: { color: theme.colors.textMuted, fontSize: 12, marginTop: 2 },
  adventureCode: { color: theme.colors.primary, fontSize: 12, fontWeight: 'bold', marginTop: 4 },
  messagesButton: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: 8,
    alignItems: 'center',
    borderColor: theme.colors.gold,
    borderWidth: 1,
    marginBottom: theme.spacing.m,
  },
  messagesButtonText: {
    color: theme.colors.gold,
    fontWeight: 'bold',
    fontSize: theme.typography.sizes.body,
  },
  offlineButton: {
    padding: theme.spacing.m,
    alignItems: 'center',
  },
  offlineText: {
    color: theme.colors.textMuted,
    textDecorationLine: 'underline',
  },
});
