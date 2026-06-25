import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { theme } from '../theme';

export default function ModeSelectScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Call of Cthulhu</Text>
          <Text style={styles.subtitle}>7th Edition Companion</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.modeButton} 
            onPress={() => navigation.navigate('GMDashboard')}
          >
            <Text style={styles.modeIcon}>🎭</Text>
            <Text style={styles.modeTitle}>Game Master</Text>
            <Text style={styles.modeDescription}>
              Create adventures, manage NPCs, and control the narrative.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.modeButton} 
            onPress={() => navigation.navigate('PlayerHub')}
          >
            <Text style={styles.modeIcon}>🔍</Text>
            <Text style={styles.modeTitle}>Player</Text>
            <Text style={styles.modeDescription}>
              Create your investigator, join adventures, and survive the horrors.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={async () => {
              const { authService } = require('../services/authService');
              await authService.logout();
              navigation.replace('Login');
            }}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Ph'nglui mglw'nafh Cthulhu R'lyeh wgah'nagl fhtagn</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.m,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl * 2,
  },
  title: {
    color: theme.colors.gold,
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: theme.typography.fontFamilyPrimary,
    textAlign: 'center',
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.sizes.body,
    marginTop: theme.spacing.xs,
  },
  buttonContainer: {
    width: '100%',
    gap: theme.spacing.m,
  },
  modeButton: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: theme.spacing.l,
    alignItems: 'center',
  },
  modeIcon: {
    fontSize: 40,
    marginBottom: theme.spacing.s,
  },
  modeTitle: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.h2,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  modeDescription: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.sizes.small,
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.m,
    alignItems: 'center',
  },
  logoutText: {
    color: '#E57373', // A soft red for logout
    fontSize: theme.typography.sizes.body,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    color: theme.colors.border,
    fontSize: 10,
    fontStyle: 'italic',
  }
});
