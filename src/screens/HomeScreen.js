import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { theme } from '../theme';
import AttributeBox from '../components/AttributeBox';
import { useCharacterStore } from '../store';
import { useNavigation } from '@react-navigation/native';

const StatBar = ({ label, current, max, color, onPress, onAdjust }) => {
  const percentage = max > 0 ? (current / max) * 100 : 0;
  
  return (
    <View style={styles.statContainer}>
      <TouchableOpacity style={{flex: 1}} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.statHeader}>
          <Text style={styles.statLabel}>{label}</Text>
          <Text style={styles.statValue}>{current} / {max}</Text>
        </View>
        <View style={styles.barBackground}>
          <View style={[styles.barFill, { width: `${Math.min(percentage, 100)}%`, backgroundColor: color }]} />
        </View>
      </TouchableOpacity>
      
      {onAdjust && (
        <View style={styles.quickAdjustContainer}>
          <TouchableOpacity style={styles.quickAdjustBtn} onPress={() => onAdjust(-1)}>
            <Text style={styles.quickAdjustText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAdjustBtn} onPress={() => onAdjust(1)}>
            <Text style={styles.quickAdjustText}>+</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const character = useCharacterStore((state) => state.currentCharacter);
  const adjustStat = useCharacterStore((state) => state.adjustStat);
  const saveCharacter = useCharacterStore((state) => state.saveCharacter);

  const [modalVisible, setModalVisible] = useState(false);
  const [activeStat, setActiveStat] = useState(null);

  const openStatModal = (label, key, color) => {
    setActiveStat({ 
      label, key, color, 
      current: character.stats[key] || 0,
      max: key === 'luck' ? 99 : (character.stats[`max${key.charAt(0).toUpperCase() + key.slice(1)}`] || 99)
    });
    setModalVisible(true);
  };

  const handleAdjust = (amount) => {
    adjustStat(activeStat.key, amount);
    saveCharacter();
    setActiveStat(prev => ({ ...prev, current: prev.current + amount }));
  };

  if (!character.id) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Text style={{color: theme.colors.text}}>No character loaded.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const attributes = [
    { label: 'STR', value: character.attributes?.STR || 0 },
    { label: 'DEX', value: character.attributes?.DEX || 0 },
    { label: 'INT', value: character.attributes?.INT || 0 },
    { label: 'CON', value: character.attributes?.CON || 0 },
    { label: 'APP', value: character.attributes?.APP || 0 },
    { label: 'POW', value: character.attributes?.POW || 0 },
    { label: 'SIZ', value: character.attributes?.SIZ || 0 },
    { label: 'EDU', value: character.attributes?.EDU || 0 },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
            <Text style={styles.backButton}>← Menu</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerCard}>
          <Text style={styles.name}>{character.name || 'Unnamed'}</Text>
          <Text style={styles.occupation}>
            {character.occupation || 'No Occupation'} • Age: {character.age || '?'}
            {character.isPulp ? ` • Pulp: ${character.archetype}` : ''}
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <StatBar 
            label="Hit Points (HP)" 
            current={character.stats?.hp || 0} 
            max={character.stats?.maxHp || 0} 
            color={theme.colors.secondary} 
            onPress={() => openStatModal('Hit Points', 'hp', theme.colors.secondary)}
          />
          <StatBar 
            label="Sanity (SAN)" 
            current={character.stats?.san || 0} 
            max={character.stats?.maxSan || 99} 
            color={theme.colors.primary} 
            onPress={() => openStatModal('Sanity', 'san', theme.colors.primary)}
          />
          <StatBar 
            label="Magic (MP)" 
            current={character.stats?.mp || 0} 
            max={character.stats?.maxMp || 0} 
            color="#5D3FD3" 
            onPress={() => openStatModal('Magic', 'mp', '#5D3FD3')}
          />
          <StatBar 
            label="Luck" 
            current={character.stats?.luck || 0} 
            max={99} 
            color={theme.colors.gold} 
            onPress={() => openStatModal('Luck', 'luck', theme.colors.gold)}
          />
        </View>

        {/* Pulp Info (if Pulp) */}
        {character.isPulp && (
          <View style={styles.pulpContainer}>
            <Text style={styles.sectionTitle}>Pulp Hero</Text>
            <Text style={styles.pulpText}>
              <Text style={{fontWeight: 'bold'}}>Core Characteristic:</Text> {character.coreCharacteristic || 'None'}
            </Text>
            <Text style={styles.pulpText}>
              <Text style={{fontWeight: 'bold'}}>Talents:</Text> {character.talents?.join(', ') || 'None'}
            </Text>
          </View>
        )}

        {/* Characteristics */}
        <Text style={styles.sectionTitle}>Characteristics</Text>
        <View style={styles.attributesGrid}>
          {attributes.map((attr) => (
            <AttributeBox key={attr.label} label={attr.label} value={attr.value} />
          ))}
        </View>
        
        {/* Move Rate */}
        <View style={styles.moveContainer}>
          <Text style={styles.moveLabel}>Move Rate</Text>
          <Text style={styles.moveValue}>{character.stats?.moveRate || 8}</Text>
        </View>

      </ScrollView>

      {/* Adjust Stat Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {activeStat && (
              <>
                <Text style={[styles.modalTitle, { color: activeStat.color }]}>{activeStat.label}</Text>
                <Text style={styles.modalValue}>{activeStat.current} / {activeStat.max}</Text>
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.adjustBtn} onPress={() => handleAdjust(-5)}>
                    <Text style={styles.adjustBtnText}>-5</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.adjustBtn} onPress={() => handleAdjust(-1)}>
                    <Text style={styles.adjustBtnText}>-1</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.modalDivider} />
                  
                  <TouchableOpacity style={styles.adjustBtn} onPress={() => handleAdjust(1)}>
                    <Text style={styles.adjustBtnText}>+1</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.adjustBtn} onPress={() => handleAdjust(5)}>
                    <Text style={styles.adjustBtnText}>+5</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  style={styles.modalCloseButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalCloseText}>Done</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerBar: {
    paddingBottom: theme.spacing.m,
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
  headerCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: 8,
    marginBottom: theme.spacing.l,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  name: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.h2,
    fontWeight: 'bold',
    fontFamily: theme.typography.fontFamilyPrimary,
  },
  occupation: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.sizes.body,
    marginTop: theme.spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  statContainer: {
    width: '48%',
    marginBottom: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.s,
    borderRadius: 8,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statLabel: { color: theme.colors.textMuted, fontSize: 12, fontWeight: 'bold' },
  statValue: { color: theme.colors.text, fontSize: 12, fontWeight: 'bold' },
  barBackground: { height: 8, backgroundColor: theme.colors.background, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%' },
  pulpContainer: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: 8,
    marginBottom: theme.spacing.xl,
    borderColor: theme.colors.primary,
    borderWidth: 1,
  },
  pulpText: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body,
    marginBottom: 4,
  },
  sectionTitle: {
    color: theme.colors.gold,
    fontSize: theme.typography.sizes.h3,
    fontWeight: 'bold',
    marginBottom: theme.spacing.m,
    fontFamily: theme.typography.fontFamilyPrimary,
  },
  attributesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moveContainer: {
    marginTop: theme.spacing.l,
    alignItems: 'center',
    padding: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    borderColor: theme.colors.border,
    borderWidth: 1,
    marginBottom: theme.spacing.xl,
  },
  moveLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.sizes.small,
    fontWeight: 'bold',
  },
  moveValue: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.h1,
    fontWeight: 'bold',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: 16,
    borderColor: theme.colors.border,
    borderWidth: 1,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: theme.typography.sizes.h2,
    fontWeight: 'bold',
    marginBottom: theme.spacing.s,
    fontFamily: theme.typography.fontFamilyPrimary,
  },
  modalValue: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.h1,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xl,
  },
  modalButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  adjustBtn: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
    borderRadius: 8,
    marginHorizontal: theme.spacing.xs,
    minWidth: 50,
    alignItems: 'center',
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  adjustBtnText: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body,
    fontWeight: 'bold',
  },
  modalDivider: {
    width: 2,
    height: 30,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.m,
  },
  modalCloseButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: 8,
  },
  modalCloseText: {
    color: theme.colors.background,
    fontWeight: 'bold',
    fontSize: theme.typography.sizes.body,
  }
});
