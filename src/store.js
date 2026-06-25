import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

// Default empty character structure
const initialCharacterState = {
  id: null,
  name: '',
  occupation: '',
  age: '',
  isPulp: false,
  archetype: '',
  coreCharacteristic: '',
  talents: [],
  attributes: {
    STR: 0, DEX: 0, INT: 0, CON: 0, APP: 0, POW: 0, SIZ: 0, EDU: 0
  },
  stats: {
    hp: 0, maxHp: 0,
    san: 0, maxSan: 99,
    mp: 0, maxMp: 0,
    luck: 0, moveRate: 8,
  },
  combat: {
    damageBonus: '0',
    build: 0,
    weapons: [],
  },
  background: {
    personalDescription: '',
    ideology: '',
    significantPeople: '',
    meaningfulLocations: '',
    treasuredPossessions: '',
    traits: '',
    injuries: '',
    phobias: '',
    arcaneTomes: '',
  },
  skills: {}, // Will store overriding values. Base is handled dynamically or assumed 0/base in UI
  skillChecks: {}, // Gameplay: tracks checked skills { "Spot Hidden": true }
  inventory: [], // Gameplay: items list
  notes: '', // Gameplay: player notes
};

export const useCharacterStore = create(
  persist(
    (set, get) => ({
      characters: [], // Saved characters
      
      // Current character being created or viewed
      currentCharacter: { ...initialCharacterState },
      
      // Wizard / Creation Actions
      startNewCharacter: (isPulp) => set({ 
        currentCharacter: { ...initialCharacterState, isPulp, id: Date.now().toString() } 
      }),
      
      updateBaseInfo: (info) => set((state) => ({
        currentCharacter: { ...state.currentCharacter, ...info }
      })),
      
      updatePulpInfo: (info) => set((state) => ({
        currentCharacter: { ...state.currentCharacter, ...info }
      })),
      
      updateAttributes: (attributes) => set((state) => {
        const { CON, SIZ, POW, STR, DEX } = attributes;
        // HP Calculation
        const divisor = state.currentCharacter.isPulp ? 5 : 10;
        const maxHp = Math.floor((CON + SIZ) / divisor);
        
        // Damage Bonus and Build Calculation
        const strSiz = (STR || 0) + (SIZ || 0);
        let damageBonus = '0';
        let build = 0;
        
        if (strSiz >= 2 && strSiz <= 64) { damageBonus = '-2'; build = -2; }
        else if (strSiz >= 65 && strSiz <= 84) { damageBonus = '-1'; build = -1; }
        else if (strSiz >= 85 && strSiz <= 124) { damageBonus = '0'; build = 0; }
        else if (strSiz >= 125 && strSiz <= 164) { damageBonus = '+1D4'; build = 1; }
        else if (strSiz >= 165 && strSiz <= 204) { damageBonus = '+1D6'; build = 2; }
        else if (strSiz >= 205 && strSiz <= 284) { damageBonus = '+2D6'; build = 3; }
        else if (strSiz >= 285) { damageBonus = '+3D6'; build = 4; }

        return {
          currentCharacter: {
            ...state.currentCharacter,
            attributes,
            stats: {
              ...state.currentCharacter.stats,
              hp: maxHp,
              maxHp: maxHp,
              san: POW,
              mp: Math.floor(POW / 5),
              maxMp: Math.floor(POW / 5),
            },
            combat: {
              ...state.currentCharacter.combat,
              damageBonus,
              build,
            }
          }
        };
      }),
      
      updateSkills: (skills) => set((state) => ({
        currentCharacter: { ...state.currentCharacter, skills }
      })),
      
      // --- Gameplay Actions ---
      
      adjustStat: (statName, amount) => set((state) => {
        const currentStats = state.currentCharacter.stats;
        let newValue = (currentStats[statName] || 0) + amount;
        
        // Optional bounding (e.g., HP max bounding, but sometimes CoC allows going negative temporarily)
        const maxStatName = 'max' + statName.charAt(0).toUpperCase() + statName.slice(1);
        const maxVal = currentStats[maxStatName];
        if (maxVal !== undefined && newValue > maxVal) {
          newValue = maxVal;
        }

        return {
          currentCharacter: {
            ...state.currentCharacter,
            stats: {
              ...currentStats,
              [statName]: newValue
            }
          }
        };
      }),

      toggleSkillCheck: (skillName) => set((state) => {
        const checks = state.currentCharacter.skillChecks || {};
        return {
          currentCharacter: {
            ...state.currentCharacter,
            skillChecks: {
              ...checks,
              [skillName]: !checks[skillName]
            }
          }
        };
      }),

      updateInventory: (inventory) => set((state) => ({
        currentCharacter: { ...state.currentCharacter, inventory }
      })),

      updateNotes: (notes) => set((state) => ({
        currentCharacter: { ...state.currentCharacter, notes }
      })),
      
      // Save current character to list
      saveCharacter: () => set((state) => {
        const existingIndex = state.characters.findIndex(c => c.id === state.currentCharacter.id);
        let newCharacters = [...state.characters];
        if (existingIndex >= 0) {
          newCharacters[existingIndex] = state.currentCharacter;
        } else {
          newCharacters.push(state.currentCharacter);
        }
        return { characters: newCharacters };
      }),
      
      // Load a character into current
      loadCharacter: (id) => set((state) => {
        const char = state.characters.find(c => c.id === id);
        if (char) {
          return { currentCharacter: char };
        }
        return state;
      }),
      
      deleteCharacter: (id) => set((state) => ({
        characters: state.characters.filter(c => c.id !== id)
      })),
      
    }),
    {
      name: 'coc-characters-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
