/**
 * Adventure Service
 * Manages CRUD operations for adventures, players, and NPCs in Firestore.
 */
import { db, isFirebaseConfigured } from './firebase';
import { 
  collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc,
  query, where, onSnapshot, serverTimestamp 
} from 'firebase/firestore';

// Generate a unique adventure code
const generateCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'CTH-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const adventureService = {
  // --- Adventures ---
  createAdventure: async (gmUserId, name, isPulp) => {
    if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
    const code = generateCode();
    const docRef = await addDoc(collection(db, 'adventures'), {
      name,
      gmUserId,
      code,
      isPulp,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, name, code, isPulp };
  },

  getGMAdventures: (gmUserId, callback) => {
    if (!isFirebaseConfigured()) return () => {};
    const q = query(collection(db, 'adventures'), where('gmUserId', '==', gmUserId));
    return onSnapshot(q, (snapshot) => {
      const adventures = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(adventures);
    });
  },

  findByCode: async (code) => {
    if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
    const q = query(collection(db, 'adventures'), where('code', '==', code.toUpperCase()));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  },

  // --- Players in Adventure ---
  addPlayer: async (adventureId, userId, characterData) => {
    if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
    await addDoc(collection(db, 'adventures', adventureId, 'players'), {
      userId,
      characterData,
      joinedAt: serverTimestamp(),
    });
  },

  getPlayers: (adventureId, callback) => {
    if (!isFirebaseConfigured()) return () => {};
    return onSnapshot(collection(db, 'adventures', adventureId, 'players'), (snapshot) => {
      const players = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(players);
    });
  },

  updatePlayerCharacter: async (adventureId, playerId, characterData) => {
    if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
    await updateDoc(doc(db, 'adventures', adventureId, 'players', playerId), {
      characterData,
    });
  },

  // --- NPCs ---
  addNPC: async (adventureId, npcData) => {
    if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
    const docRef = await addDoc(collection(db, 'adventures', adventureId, 'npcs'), {
      ...npcData,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...npcData };
  },

  getNPCs: (adventureId, callback) => {
    if (!isFirebaseConfigured()) return () => {};
    return onSnapshot(collection(db, 'adventures', adventureId, 'npcs'), (snapshot) => {
      const npcs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(npcs);
    });
  },

  deleteNPC: async (adventureId, npcId) => {
    if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
    await deleteDoc(doc(db, 'adventures', adventureId, 'npcs', npcId));
  },
};
