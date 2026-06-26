import { authService } from './authService';
import { isFirebaseConfigured } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

jest.mock('./firebase', () => ({
  auth: {},
  isFirebaseConfigured: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('deve lançar erro se o Firebase não estiver configurado', async () => {
      isFirebaseConfigured.mockReturnValue(false);
      await expect(authService.register('test@test.com', '123456')).rejects.toThrow('Firebase not configured');
    });

    it('deve chamar createUserWithEmailAndPassword corretamente', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      const mockUser = { uid: '123', email: 'test@test.com' };
      createUserWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });

      const user = await authService.register('test@test.com', '123456');
      
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'test@test.com', '123456');
      expect(user).toEqual(mockUser);
    });
  });

  describe('login', () => {
    it('deve lançar erro se o Firebase não estiver configurado', async () => {
      isFirebaseConfigured.mockReturnValue(false);
      await expect(authService.login('test@test.com', '123456')).rejects.toThrow('Firebase not configured');
    });

    it('deve chamar signInWithEmailAndPassword corretamente', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      const mockUser = { uid: '123', email: 'test@test.com' };
      signInWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });

      const user = await authService.login('test@test.com', '123456');
      
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'test@test.com', '123456');
      expect(user).toEqual(mockUser);
    });
  });

  describe('logout', () => {
    it('deve ignorar logout se Firebase não estiver configurado', async () => {
      isFirebaseConfigured.mockReturnValue(false);
      await authService.logout();
      expect(signOut).not.toHaveBeenCalled();
    });

    it('deve chamar signOut', async () => {
      isFirebaseConfigured.mockReturnValue(true);
      await authService.logout();
      expect(signOut).toHaveBeenCalled();
    });
  });
});
