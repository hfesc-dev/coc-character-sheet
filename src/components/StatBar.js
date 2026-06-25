import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

export default function StatBar({ label, current, max, color }) {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.valueText}>{current} / {max}</Text>
      </View>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.s,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.body,
    fontWeight: 'bold',
  },
  valueText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.sizes.small,
  },
  barBackground: {
    height: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 6,
    overflow: 'hidden',
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
});
