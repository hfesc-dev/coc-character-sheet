import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme';

export default function AttributeBox({ label, value, onPress }) {
  const halfValue = Math.floor(value / 2);
  const fifthValue = Math.floor(value / 5);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valuesWrapper}>
        <View style={styles.mainValueBox}>
          <Text style={styles.mainValue}>{value}</Text>
        </View>
        <View style={styles.subValuesContainer}>
          <View style={styles.subValueBox}>
            <Text style={styles.subValue}>{halfValue}</Text>
          </View>
          <View style={[styles.subValueBox, styles.extremeBox]}>
            <Text style={styles.subValue}>{fifthValue}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: theme.spacing.s,
    margin: theme.spacing.xs,
    width: '46%', // Fit two per row comfortably
    alignItems: 'center',
  },
  label: {
    color: theme.colors.gold,
    fontSize: theme.typography.sizes.body,
    fontWeight: 'bold',
    marginBottom: theme.spacing.s,
    textTransform: 'uppercase',
  },
  valuesWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  mainValueBox: {
    padding: theme.spacing.s,
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 4,
    marginRight: 4,
    minWidth: 46,
    alignItems: 'center',
  },
  mainValue: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.h2,
    fontWeight: 'bold',
  },
  subValuesContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  subValueBox: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: 'center',
    marginBottom: 2,
    minWidth: 32,
  },
  extremeBox: {
    marginBottom: 0,
  },
  subValue: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: 'bold',
  },
});
