/**
 * Message Service
 * Manages NPC → Player messaging in Firestore.
 */
import { db, isFirebaseConfigured } from './firebase';
import { 
  collection, addDoc, query, where, orderBy, onSnapshot, updateDoc, doc, serverTimestamp 
} from 'firebase/firestore';

export const messageService = {
  // GM sends a message as an NPC
  sendMessage: async (adventureId, { fromNpcId, fromNpcName, toPlayerId, type, content }) => {
    if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
    const docRef = await addDoc(collection(db, 'adventures', adventureId, 'messages'), {
      fromNpcId,
      fromNpcName,
      toPlayerId, // 'all' or specific playerId
      type, // 'letter' | 'whisper' | 'announcement'
      content,
      read: false,
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  },

  // Listen to messages for a specific player (or 'all')
  listenToPlayerMessages: (adventureId, playerId, callback) => {
    if (!isFirebaseConfigured()) return () => {};
    // Get messages addressed to this player or to 'all'
    const q = query(
      collection(db, 'adventures', adventureId, 'messages'),
      orderBy('timestamp', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(msg => msg.toPlayerId === 'all' || msg.toPlayerId === playerId);
      callback(messages);
    });
  },

  // Listen to all messages (for GM view)
  listenToAllMessages: (adventureId, callback) => {
    if (!isFirebaseConfigured()) return () => {};
    const q = query(
      collection(db, 'adventures', adventureId, 'messages'),
      orderBy('timestamp', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(messages);
    });
  },

  // Mark message as read
  markAsRead: async (adventureId, messageId) => {
    if (!isFirebaseConfigured()) return;
    await updateDoc(doc(db, 'adventures', adventureId, 'messages', messageId), {
      read: true,
    });
  },
};
