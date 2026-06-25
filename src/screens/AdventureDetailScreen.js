import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Modal, Alert } from 'react-native';
import { theme } from '../theme';
import { adventureService } from '../services/adventureService';
import { messageService } from '../services/messageService';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';

export default function AdventureDetailScreen({ route, navigation }) {
  const { adventure } = route.params;
  const [activeTab, setActiveTab] = useState('players'); // 'players' | 'npcs' | 'messages'
  
  // NPC state
  const [npcs, setNpcs] = useState([]);
  const [npcModalVisible, setNpcModalVisible] = useState(false);
  const [newNpcName, setNewNpcName] = useState('');
  const [newNpcDesc, setNewNpcDesc] = useState('');

  // Message state
  const [msgModalVisible, setMsgModalVisible] = useState(false);
  const [selectedNpc, setSelectedNpc] = useState(null);
  const [msgTarget, setMsgTarget] = useState('all');
  const [msgContent, setMsgContent] = useState('');
  const [msgType, setMsgType] = useState('letter');
  const [messages, setMessages] = useState([]);

  // Players state
  const [players, setPlayers] = useState([]);

  // Listen to Firestore
  useEffect(() => {
    const unsubNpcs = adventureService.getNPCs(adventure.id, setNpcs);
    const unsubPlayers = adventureService.getPlayers(adventure.id, setPlayers);
    const unsubMessages = messageService.listenToAllMessages(adventure.id, setMessages);
    return () => {
      if (unsubNpcs) unsubNpcs();
      if (unsubPlayers) unsubPlayers();
      if (unsubMessages) unsubMessages();
    };
  }, []);

  const handleAddNpc = async () => {
    if (!newNpcName.trim()) return;
    try {
      await adventureService.addNPC(adventure.id, {
        name: newNpcName.trim(),
        description: newNpcDesc.trim(),
      });
      setNewNpcName('');
      setNewNpcDesc('');
      setNpcModalVisible(false);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleSendMessage = async () => {
    if (!msgContent.trim() || !selectedNpc) {
      Alert.alert('Error', 'Select an NPC and write a message.');
      return;
    }
    try {
      await messageService.sendMessage(adventure.id, {
        fromNpcId: selectedNpc.id,
        fromNpcName: selectedNpc.name,
        toPlayerId: msgTarget,
        type: msgType,
        content: msgContent.trim(),
      });
      setMsgContent('');
      setMsgModalVisible(false);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(adventure.code);
    Alert.alert('Copied!', 'Adventure code copied to clipboard.');
  };

  const renderPlayersTab = () => (
    <View style={styles.tabContent}>
      {players.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No players connected yet.</Text>
          <Text style={styles.emptyHint}>Share the code below with your players:</Text>
          
          <TouchableOpacity style={styles.bigCodeContainer} onPress={handleCopyCode}>
            <Text style={styles.bigCode}>{adventure.code}</Text>
            <Text style={styles.copyHint}>Tap to copy</Text>
          </TouchableOpacity>
          
          <View style={styles.qrContainer}>
            <QRCode
              value={adventure.code}
              size={150}
              color={theme.colors.primary}
              backgroundColor={theme.colors.surface}
            />
          </View>
        </View>
      ) : (
        <FlatList
          data={players}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.playerCard}>
              <Text style={styles.playerName}>{item.name}</Text>
              <Text style={styles.playerOccupation}>{item.occupation}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );

  const renderNpcsTab = () => (
    <View style={styles.tabContent}>
      {npcs.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No NPCs created yet.</Text>
        </View>
      ) : (
        <FlatList
          data={npcs}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.npcCard}>
              <Text style={styles.npcName}>{item.name}</Text>
              <Text style={styles.npcDesc}>{item.description || 'No description'}</Text>
            </View>
          )}
        />
      )}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setNpcModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add NPC</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMessagesTab = () => (
    <View style={styles.tabContent}>
      {messages.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No messages sent yet.</Text>
          <Text style={styles.emptyHint}>Send messages as NPCs to your players.</Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.messageCard}>
              <View style={styles.messageHeader}>
                <Text style={styles.messageFrom}>{item.fromNpcName}</Text>
                <Text style={styles.messageType}>{item.type.toUpperCase()}</Text>
              </View>
              <Text style={styles.messageContent}>{item.content}</Text>
              <Text style={styles.messageMeta}>
                To: {item.toPlayerId === 'all' ? 'All Players' : item.toPlayerId} • {item.timestamp?.toDate?.()?.toLocaleTimeString?.() || ''}
              </Text>
            </View>
          )}
        />
      )}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => {
          if (npcs.length === 0) {
            Alert.alert('No NPCs', 'Create at least one NPC before sending messages.');
            return;
          }
          setMsgModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>✉ Send Message as NPC</Text>
      </TouchableOpacity>
    </View>
  );

  const MSG_TYPES = ['letter', 'whisper', 'announcement'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>{adventure.name}</Text>
        <TouchableOpacity style={styles.codeRow} onPress={handleCopyCode}>
          <Text style={styles.codeLabel}>Adventure Code: </Text>
          <Text style={styles.codeValue}>{adventure.code}</Text>
          <Text style={styles.copyIcon}> 📋</Text>
          {adventure.isPulp && <Text style={styles.pulpBadge}>PULP</Text>}
        </TouchableOpacity>

        {/* Tabs */}
        <View style={styles.tabBar}>
          {['players', 'npcs', 'messages'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'players' ? '👤 Players' : tab === 'npcs' ? '🎭 NPCs' : '✉ Messages'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === 'players' && renderPlayersTab()}
        {activeTab === 'npcs' && renderNpcsTab()}
        {activeTab === 'messages' && renderMessagesTab()}
      </View>

      {/* NPC Modal */}
      <Modal animationType="slide" transparent visible={npcModalVisible} onRequestClose={() => setNpcModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New NPC</Text>
            <TextInput
              style={styles.input}
              placeholder="NPC Name"
              placeholderTextColor={theme.colors.textMuted}
              value={newNpcName}
              onChangeText={setNewNpcName}
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Description (optional)"
              placeholderTextColor={theme.colors.textMuted}
              multiline
              value={newNpcDesc}
              onChangeText={setNewNpcDesc}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setNpcModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleAddNpc}>
                <Text style={styles.confirmText}>Create NPC</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Message Modal */}
      <Modal animationType="slide" transparent visible={msgModalVisible} onRequestClose={() => setMsgModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Send Message as NPC</Text>
            
            <Text style={styles.inputLabel}>From NPC:</Text>
            <ScrollView horizontal style={styles.npcSelector} showsHorizontalScrollIndicator={false}>
              {npcs.map(npc => (
                <TouchableOpacity
                  key={npc.id}
                  style={[styles.npcChip, selectedNpc?.id === npc.id && styles.npcChipActive]}
                  onPress={() => setSelectedNpc(npc)}
                >
                  <Text style={[styles.npcChipText, selectedNpc?.id === npc.id && styles.npcChipTextActive]}>
                    {npc.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.inputLabel}>Message Type:</Text>
            <View style={styles.typeSelector}>
              {MSG_TYPES.map(type => (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeChip, msgType === type && styles.typeChipActive]}
                  onPress={() => setMsgType(type)}
                >
                  <Text style={[styles.typeChipText, msgType === type && styles.typeChipTextActive]}>
                    {type === 'letter' ? '📜 Letter' : type === 'whisper' ? '🤫 Whisper' : '📢 Announce'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Message:</Text>
            <TextInput
              style={[styles.input, { height: 100 }]}
              placeholder="Write the NPC's message..."
              placeholderTextColor={theme.colors.textMuted}
              multiline
              value={msgContent}
              onChangeText={setMsgContent}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setMsgModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleSendMessage}>
                <Text style={styles.confirmText}>Send</Text>
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
  headerBar: { marginBottom: theme.spacing.s },
  backText: { color: theme.colors.primary, fontWeight: 'bold' },
  title: { color: theme.colors.gold, fontSize: theme.typography.sizes.h2, fontWeight: 'bold', fontFamily: theme.typography.fontFamilyPrimary },
  codeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.m },
  codeLabel: { color: theme.colors.textMuted, fontSize: 14 },
  codeValue: { color: theme.colors.primary, fontSize: 16, fontWeight: 'bold', letterSpacing: 2 },
  copyIcon: { fontSize: 12 },
  pulpBadge: { color: theme.colors.background, backgroundColor: theme.colors.secondary, fontSize: 10, fontWeight: 'bold', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden', marginLeft: 8 },
  
  // Tabs
  tabBar: { flexDirection: 'row', marginBottom: theme.spacing.m, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  tab: { flex: 1, paddingVertical: theme.spacing.s, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: theme.colors.primary },
  tabText: { color: theme.colors.textMuted, fontSize: 13, fontWeight: 'bold' },
  tabTextActive: { color: theme.colors.primary },
  tabContent: { flex: 1 },

  // Empty state
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: theme.colors.text, fontSize: theme.typography.sizes.body, fontWeight: 'bold' },
  emptyHint: { color: theme.colors.textMuted, marginTop: theme.spacing.s, marginBottom: theme.spacing.m },
  bigCodeContainer: { backgroundColor: theme.colors.surface, padding: theme.spacing.l, borderRadius: 12, borderColor: theme.colors.primary, borderWidth: 2, alignItems: 'center' },
  bigCode: { color: theme.colors.primary, fontSize: 32, fontWeight: 'bold', letterSpacing: 4 },
  copyHint: { color: theme.colors.textMuted, fontSize: 10, marginTop: 4 },
  qrContainer: { marginTop: theme.spacing.xl, padding: theme.spacing.m, backgroundColor: theme.colors.surface, borderRadius: 12 },

  // Cards
  playerCard: { backgroundColor: theme.colors.surface, padding: theme.spacing.m, borderRadius: 8, marginBottom: theme.spacing.s, borderColor: theme.colors.border, borderWidth: 1 },
  playerName: { color: theme.colors.text, fontWeight: 'bold', fontSize: theme.typography.sizes.body },
  playerOccupation: { color: theme.colors.textMuted, fontSize: 12 },
  npcCard: { backgroundColor: theme.colors.surface, padding: theme.spacing.m, borderRadius: 8, marginBottom: theme.spacing.s, borderColor: theme.colors.border, borderWidth: 1 },
  npcName: { color: theme.colors.gold, fontWeight: 'bold', fontSize: theme.typography.sizes.body },
  npcDesc: { color: theme.colors.textMuted, fontSize: 12, marginTop: 4 },
  messageCard: { backgroundColor: theme.colors.surface, padding: theme.spacing.m, borderRadius: 8, marginBottom: theme.spacing.s, borderColor: theme.colors.border, borderWidth: 1 },
  messageHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  messageFrom: { color: theme.colors.gold, fontWeight: 'bold' },
  messageType: { color: theme.colors.primary, fontSize: 10, fontWeight: 'bold' },
  messageContent: { color: theme.colors.text, marginBottom: 4 },
  messageMeta: { color: theme.colors.textMuted, fontSize: 10 },

  // Buttons
  addButton: { backgroundColor: theme.colors.primary, padding: theme.spacing.m, borderRadius: 8, alignItems: 'center', marginTop: theme.spacing.m },
  addButtonText: { color: theme.colors.background, fontWeight: 'bold' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: theme.spacing.m },
  modalContent: { backgroundColor: theme.colors.surface, borderRadius: 16, padding: theme.spacing.xl },
  modalTitle: { color: theme.colors.gold, fontSize: theme.typography.sizes.h2, fontWeight: 'bold', marginBottom: theme.spacing.l, textAlign: 'center' },
  inputLabel: { color: theme.colors.textMuted, fontWeight: 'bold', marginBottom: 4, marginTop: theme.spacing.s },
  input: { backgroundColor: theme.colors.background, borderColor: theme.colors.border, borderWidth: 1, borderRadius: 8, color: theme.colors.text, padding: theme.spacing.m, marginBottom: theme.spacing.s },
  npcSelector: { flexDirection: 'row', marginBottom: theme.spacing.s, maxHeight: 40 },
  npcChip: { backgroundColor: theme.colors.background, borderColor: theme.colors.border, borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8 },
  npcChipActive: { borderColor: theme.colors.gold, backgroundColor: 'rgba(212,175,55,0.15)' },
  npcChipText: { color: theme.colors.textMuted, fontSize: 13 },
  npcChipTextActive: { color: theme.colors.gold, fontWeight: 'bold' },
  typeSelector: { flexDirection: 'row', marginBottom: theme.spacing.s, gap: 8 },
  typeChip: { backgroundColor: theme.colors.background, borderColor: theme.colors.border, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  typeChipActive: { borderColor: theme.colors.primary, backgroundColor: 'rgba(31,138,112,0.15)' },
  typeChipText: { color: theme.colors.textMuted, fontSize: 12 },
  typeChipTextActive: { color: theme.colors.primary, fontWeight: 'bold' },
  modalActions: { flexDirection: 'row', gap: theme.spacing.m, marginTop: theme.spacing.m },
  cancelButton: { flex: 1, padding: theme.spacing.m, borderRadius: 8, alignItems: 'center', backgroundColor: theme.colors.background },
  cancelText: { color: theme.colors.textMuted, fontWeight: 'bold' },
  confirmButton: { flex: 1, padding: theme.spacing.m, borderRadius: 8, alignItems: 'center', backgroundColor: theme.colors.primary },
  confirmText: { color: theme.colors.background, fontWeight: 'bold' },
});
