import { adventureService } from './adventureService';
import { isFirebaseConfigured } from './firebase';
import { 
  addDoc, getDocs, updateDoc, deleteDoc
} from 'firebase/firestore';

jest.mock('./firebase', () => ({
  db: {},
  isFirebaseConfigured: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  addDoc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  onSnapshot: jest.fn(),
  serverTimestamp: jest.fn(),
}));

describe('adventureService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createAdventure', () => {
    it('deve criar uma aventura corretamente', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      addDoc.mockResolvedValue({ id: 'adv-123' });

      const result = await adventureService.createAdventure('gm-id', 'Test Adventure', false);
      
      expect(addDoc).toHaveBeenCalled();
      expect(result.id).toBe('adv-123');
      expect(result.name).toBe('Test Adventure');
      expect(result.isPulp).toBe(false);
      expect(result.code).toMatch(/^CTH-[A-Z0-9]{4}$/);
    });

    it('deve lançar erro se o Firebase não estiver configurado', async () => {
      isFirebaseConfigured.mockReturnValue(false);
      await expect(adventureService.createAdventure('gm-id', 'Name', false))
        .rejects.toThrow('Firebase not configured');
    });
  });

  describe('findByCode', () => {
    it('deve buscar e retornar uma aventura pelo código', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      
      // Mock do getDocs retornando snapshot com dados
      getDocs.mockResolvedValue({
        empty: false,
        docs: [
          { id: 'adv-123', data: () => ({ name: 'Test Adventure', code: 'CTH-TEST' }) }
        ]
      });

      const result = await adventureService.findByCode('cth-test'); // input minúsculo
      
      expect(getDocs).toHaveBeenCalled();
      expect(result.id).toBe('adv-123');
      expect(result.name).toBe('Test Adventure');
    });

    it('deve retornar null se não encontrar aventura', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      
      getDocs.mockResolvedValue({ empty: true });

      const result = await adventureService.findByCode('CTH-NOPE');
      
      expect(result).toBeNull();
    });
  });
  
  describe('addPlayer', () => {
    it('deve adicionar um jogador à aventura', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      
      await adventureService.addPlayer('adv-123', 'user-123', { name: 'Investigator' });
      
      expect(addDoc).toHaveBeenCalled();
    });
  });

  describe('updatePlayerCharacter', () => {
    it('deve atualizar dados do personagem', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      
      await adventureService.updatePlayerCharacter('adv-123', 'player-123', { hp: 10 });
      
      expect(updateDoc).toHaveBeenCalled();
    });
  });
  
  describe('addNPC', () => {
    it('deve criar um NPC', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      addDoc.mockResolvedValue({ id: 'npc-123' });
      
      const result = await adventureService.addNPC('adv-123', { name: 'Cultist' });
      
      expect(addDoc).toHaveBeenCalled();
      expect(result.id).toBe('npc-123');
      expect(result.name).toBe('Cultist');
    });
  });
  
  describe('deleteNPC', () => {
    it('deve apagar um NPC', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      
      await adventureService.deleteNPC('adv-123', 'npc-123');
      
      expect(deleteDoc).toHaveBeenCalled();
    });
  });
});
