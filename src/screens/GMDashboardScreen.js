import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert, TextInput, Modal } from 'react-native';
import { theme } from '../theme';
import { adventureService } from '../services/adventureService';
import { authService } from '../services/authService';

export default function GMDashboardScreen({ navigation }) {
  const [adventures, setAdventures] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newAdventureName, setNewAdventureName] = useState('');
  const [isPulp, setIsPulp] = useState(false);

  const [user, setUser] = useState(authService.getCurrentUser());

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    if (!currentUser) return;
    const unsubscribe = adventureService.getGMAdventures(currentUser.uid, (data) => {
      setAdventures(data);
    });
    return unsubscribe;
  }, []);

  const handleCreateAdventure = async () => {
    if (!newAdventureName.trim()) {
      Alert.alert('Error', 'Please enter an adventure name.');
      return;
    }

    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to create an adventure.');
      return;
    }

    try {
      await adventureService.createAdventure(currentUser.uid, newAdventureName.trim(), isPulp);
      setNewAdventureName('');
      setIsPulp(false);
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderAdventure = ({ item }) => (
    <TouchableOpacity 
      style={styles.adventureCard}
      onPress={() => navigation.navigate('AdventureDetail', { adventure: item })}
    >
      <View style={styles.adventureHeader}>
        <Text style={styles.adventureName}>{item.name}</Text>
        {item.isPulp && <Text style={styles.pulpBadge}>PULP</Text>}
      </View>
      <View style={styles.adventureInfo}>
        <View style={styles.codeContainer}>
          <Text style={styles.codeLabel}>Code:</Text>
          <Text style={styles.codeValue}>{item.code}</Text>
        </View>
        <Text style={styles.playerCount}>{item.players?.length || 0} player(s)</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>🎭 GM Dashboard</Text>
        <Text style={styles.subtitle}>Your Adventures</Text>

        {adventures.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📜</Text>
            <Text style={styles.emptyText}>No adventures yet.</Text>
            <Text style={styles.emptyHint}>Create your first adventure to get started.</Text>
          </View>
        ) : (
          <FlatList
            data={adventures}
            keyExtractor={item => item.id}
            renderItem={renderAdventure}
            contentContainerStyle={styles.list}
          />
        )}

        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.createButtonText}>+ New Adventure</Text>
        </TouchableOpacity>
      </View>

      {/* Create Adventure Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Adventure</Text>

            <TextInput
              style={styles.input}
              placeholder="Adventure name (e.g. The Haunting)"
              placeholderTextColor={theme.colors.textMuted}
              value={newAdventureName}
              onChangeText={setNewAdventureName}
            />

            <Text style={styles.inputLabel}>Game Mode</Text>
            <View style={styles.modeSelectorRow}>
              <TouchableOpacity 
                style={[styles.modeOption, !isPulp && styles.modeOptionActive]}
                onPress={() => setIsPulp(false)}
              >
                <Text style={styles.modeOptionIcon}>🐙</Text>
                <Text style={[styles.modeOptionText, !isPulp && styles.modeOptionTextActive]}>Classic</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modeOption, isPulp && styles.modeOptionActivePulp]}
                onPress={() => setIsPulp(true)}
              >
                <Text style={styles.modeOptionIcon}>💥</Text>
                <Text style={[styles.modeOptionText, isPulp && styles.modeOptionTextActivePulp]}>Pulp</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleCreateAdventure}
              >
                <Text style={styles.confirmText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: { flex: 1, padding: theme.spacing.m },
  headerBar: { marginBottom: theme.spacing.m },
  backText: { color: theme.colors.primary, fontWeight: 'bold', fontSize: theme.typography.sizes.body },
  title: {
    color: theme.colors.gold,
    fontSize: theme.typography.sizes.h1,
    fontWeight: 'bold',
    fontFamily: theme.typography.fontFamilyPrimary,
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.sizes.body,
    marginBottom: theme.spacing.xl,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: { fontSize: 50, marginBottom: theme.spacing.m },
  emptyText: { color: theme.colors.text, fontSize: theme.typography.sizes.h3, fontWeight: 'bold' },
  emptyHint: { color: theme.colors.textMuted, marginTop: theme.spacing.s },
  list: { paddingBottom: 80 },
  adventureCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
  adventureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  adventureName: { color: theme.colors.text, fontSize: theme.typography.sizes.h3, fontWeight: 'bold' },
  pulpBadge: {
    color: theme.colors.background,
    backgroundColor: theme.colors.secondary,
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  adventureInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codeContainer: { flexDirection: 'row', alignItems: 'center' },
  codeLabel: { color: theme.colors.textMuted, fontSize: 12, marginRight: 4 },
  codeValue: { color: theme.colors.primary, fontSize: 14, fontWeight: 'bold', letterSpacing: 1 },
  playerCount: { color: theme.colors.textMuted, fontSize: 12 },
  createButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: 8,
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: theme.spacing.m,
    right: theme.spacing.m,
  },
  createButtonText: { color: theme.colors.background, fontWeight: 'bold', fontSize: theme.typography.sizes.body },
  
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: theme.spacing.m },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: theme.spacing.xl,
  },
  modalTitle: {
    color: theme.colors.gold,
    fontSize: theme.typography.sizes.h2,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  input: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 8,
    color: theme.colors.text,
    padding: theme.spacing.m,
    fontSize: theme.typography.sizes.body,
    marginBottom: theme.spacing.m,
  },
  inputLabel: {
    color: theme.colors.textMuted,
    fontWeight: 'bold',
    marginBottom: theme.spacing.s,
  },
  modeSelectorRow: {
    flexDirection: 'row',
    gap: theme.spacing.m,
    marginBottom: theme.spacing.xl,
  },
  modeOption: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: theme.spacing.m,
    alignItems: 'center',
  },
  modeOptionActive: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(31,138,112,0.15)',
  },
  modeOptionActivePulp: {
    borderColor: theme.colors.secondary,
    backgroundColor: 'rgba(139,0,0,0.15)',
  },
  modeOptionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  modeOptionText: { 
    color: theme.colors.textMuted, 
    fontWeight: 'bold' 
  },
  modeOptionTextActive: { 
    color: theme.colors.primary 
  },
  modeOptionTextActivePulp: { 
    color: theme.colors.secondary 
  },
  modalActions: { flexDirection: 'row', gap: theme.spacing.m },
  cancelButton: {
    flex: 1,
    padding: theme.spacing.m,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  cancelText: { color: theme.colors.textMuted, fontWeight: 'bold' },
  confirmButton: {
    flex: 1,
    padding: theme.spacing.m,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
  },
  confirmText: { color: theme.colors.background, fontWeight: 'bold' },
});
