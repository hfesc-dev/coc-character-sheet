import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { theme } from '../theme';

// Mock data — will be replaced by Firestore listener
const MOCK_MESSAGES = [];

export default function PlayerMessagesScreen({ navigation }) {
  const messages = MOCK_MESSAGES;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'letter': return '📜';
      case 'whisper': return '🤫';
      case 'announcement': return '📢';
      default: return '✉';
    }
  };

  const renderMessage = ({ item }) => (
    <TouchableOpacity 
      style={[styles.messageCard, !item.read && styles.messageUnread]}
      activeOpacity={0.8}
    >
      <View style={styles.messageHeader}>
        <Text style={styles.messageIcon}>{getTypeIcon(item.type)}</Text>
        <View style={styles.messageHeaderText}>
          <Text style={styles.messageFrom}>From: {item.fromNpc}</Text>
          <Text style={styles.messageTime}>{item.timestamp}</Text>
        </View>
        {!item.read && <View style={styles.unreadDot} />}
      </View>
      <Text style={styles.messageContent}>{item.content}</Text>
      <Text style={styles.messageType}>{item.type.toUpperCase()}</Text>
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

        <Text style={styles.title}>📜 Messages</Text>
        <Text style={styles.subtitle}>Letters, whispers, and announcements from NPCs.</Text>

        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🕯️</Text>
            <Text style={styles.emptyText}>No messages yet.</Text>
            <Text style={styles.emptyHint}>
              When the Keeper sends you a letter or whisper through an NPC, it will appear here.
            </Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            keyExtractor={item => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.list}
          />
        )}
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
    fontSize: theme.typography.sizes.h2,
    fontWeight: 'bold',
    fontFamily: theme.typography.fontFamilyPrimary,
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 12,
    marginBottom: theme.spacing.xl,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: { fontSize: 50, marginBottom: theme.spacing.m },
  emptyText: { color: theme.colors.text, fontSize: theme.typography.sizes.h3, fontWeight: 'bold' },
  emptyHint: { color: theme.colors.textMuted, marginTop: theme.spacing.s, textAlign: 'center', paddingHorizontal: 20 },
  list: { paddingBottom: theme.spacing.xl },
  messageCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: 12,
    marginBottom: theme.spacing.m,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  messageUnread: {
    borderColor: theme.colors.gold,
    borderWidth: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  messageIcon: {
    fontSize: 24,
    marginRight: theme.spacing.s,
  },
  messageHeaderText: {
    flex: 1,
  },
  messageFrom: {
    color: theme.colors.gold,
    fontWeight: 'bold',
    fontSize: theme.typography.sizes.body,
  },
  messageTime: {
    color: theme.colors.textMuted,
    fontSize: 10,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  messageContent: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body,
    marginBottom: theme.spacing.s,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  messageType: {
    color: theme.colors.textMuted,
    fontSize: 10,
    fontWeight: 'bold',
    alignSelf: 'flex-end',
  }
});
