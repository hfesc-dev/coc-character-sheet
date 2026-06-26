import { messageService } from './messageService';
import { isFirebaseConfigured } from './firebase';
import { 
  addDoc, updateDoc
} from 'firebase/firestore';

jest.mock('./firebase', () => ({
  db: {},
  isFirebaseConfigured: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  onSnapshot: jest.fn(),
  serverTimestamp: jest.fn(),
}));

describe('messageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendMessage', () => {
    it('deve lançar erro se o Firebase não estiver configurado', async () => {
      isFirebaseConfigured.mockReturnValue(false);
      await expect(messageService.sendMessage('adv-123', {}))
        .rejects.toThrow('Firebase not configured');
    });

    it('deve criar uma mensagem corretamente e retornar seu ID', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      addDoc.mockResolvedValue({ id: 'msg-123' });

      const msgData = {
        fromNpcId: 'npc-1',
        fromNpcName: 'Cultist',
        toPlayerId: 'all',
        type: 'letter',
        content: 'Ph\'nglui mglw\'nafh Cthulhu'
      };

      const result = await messageService.sendMessage('adv-123', msgData);
      
      expect(addDoc).toHaveBeenCalled();
      expect(result).toBe('msg-123');
    });
  });

  describe('markAsRead', () => {
    it('deve marcar a mensagem como lida', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      
      await messageService.markAsRead('adv-123', 'msg-123');
      
      expect(updateDoc).toHaveBeenCalledWith(undefined, { read: true }); // doc mock returns undefined, but we care if it was called
    });
  });
});
