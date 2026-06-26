import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator, Platform } from 'react-native';
import { theme } from '../theme';
import { authService } from '../services/authService';

export default function LoginScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = authService.onAuthChange((user) => {
      if (user) {
        navigation.replace('ModeSelect');
      } else {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in both email and password.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await authService.login(email.trim(), password);
      } else {
        await authService.register(email.trim(), password);
      }
      // The onAuthChange listener will handle the redirect
    } catch (error) {
      setLoading(false);
      let msg = error.message;
      if (msg.includes('auth/invalid-credential')) msg = 'Invalid email or password.';
      else if (msg.includes('auth/email-already-in-use')) msg = 'This email is already registered. Try signing in.';
      else if (msg.includes('auth/invalid-email')) msg = 'Please enter a valid email address.';
      Alert.alert('Authentication Error', msg);
    }
  };

  const handleGoogleAuth = async () => {
    if (Platform.OS !== 'web') {
      Alert.alert('Not Supported', 'Google Sign-In via app requires native configuration. Please use Email/Password or play on Web.');
      return;
    }

    try {
      setLoading(true);
      await authService.loginWithGoogle();
      // The onAuthChange listener will handle the redirect
    } catch (error) {
      setLoading(false);
      if (error.code !== 'auth/popup-closed-by-user') {
        Alert.alert('Google Sign-In Error', error.message);
      }
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Call of Cthulhu</Text>
          <Text style={styles.modeLabel}>Multiplayer Companion</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={theme.colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={theme.colors.textMuted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity 
            style={[styles.authButton, loading && styles.authButtonDisabled]} 
            onPress={handleAuth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.background} />
            ) : (
              <Text style={styles.authButtonText}>
                {isLogin ? 'Sign In' : 'Create Account'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.toggleText}>
              {isLogin ? "Don't have an account? Create one" : 'Already have an account? Sign in'}
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleAuth}>
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.offlineButton} onPress={() => navigation.navigate('Menu')}>
            <Text style={styles.offlineText}>Play Offline →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: {
    flex: 1,
    padding: theme.spacing.m,
  },
  backButton: {
    marginBottom: theme.spacing.xl,
  },
  backText: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.body,
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl * 2,
  },
  modeLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.sizes.body,
    marginBottom: theme.spacing.s,
  },
  title: {
    color: theme.colors.gold,
    fontSize: theme.typography.sizes.h1,
    fontWeight: 'bold',
    fontFamily: theme.typography.fontFamilyPrimary,
  },
  form: {
    gap: theme.spacing.m,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 8,
    color: theme.colors.text,
    padding: theme.spacing.m,
    fontSize: theme.typography.sizes.body,
    height: 50,
  },
  authButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: theme.spacing.s,
  },
  authButtonDisabled: {
    opacity: 0.6,
  },
  authButtonText: {
    color: theme.colors.background,
    fontWeight: 'bold',
    fontSize: theme.typography.sizes.body,
  },
  toggleText: {
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.s,
    textDecorationLine: 'underline',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.m,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    color: theme.colors.textMuted,
    paddingHorizontal: theme.spacing.s,
    fontSize: 12,
  },
  googleButton: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: 8,
    alignItems: 'center',
    borderColor: theme.colors.textMuted,
    borderWidth: 1,
  },
  googleButtonText: {
    color: theme.colors.text,
    fontWeight: 'bold',
    fontSize: theme.typography.sizes.body,
  },
  offlineButton: {
    marginTop: theme.spacing.xl,
    alignItems: 'center',
  },
  offlineText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.sizes.body,
    textDecorationLine: 'underline',
  }
});
