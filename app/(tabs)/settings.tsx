import { Alert, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { Background, GlassCard, Screen } from '@/src/components';
import { useCalmStore } from '@/src/store/useCalmStore';
import { colors, radii, spacing, typography } from '@/src/theme';

export default function SettingsScreen() {
  const hapticsEnabled = useCalmStore((state) => state.hapticsEnabled);
  const soundEnabled = useCalmStore((state) => state.soundEnabled);
  const setHapticsEnabled = useCalmStore((state) => state.setHapticsEnabled);
  const setSoundEnabled = useCalmStore((state) => state.setSoundEnabled);
  const calmMinutes = useCalmStore((state) => state.calmMinutes);
  const totalSessions = useCalmStore((state) => state.totalSessions);
  const streakDays = useCalmStore((state) => state.streakDays);
  const resetData = useCalmStore((state) => state.resetData);

  const handleReset = () => {
    if (Platform.OS === 'web') {
      if (
        typeof window !== 'undefined' &&
        window.confirm('Reset All Data? This will reset your calm minutes, sessions, and streak to zero.')
      ) {
        resetData();
      }
      return;
    }

    Alert.alert(
      'Reset All Data',
      'This will reset your calm minutes, sessions, and streak to zero. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => resetData(),
        },
      ],
    );
  };

  return (
    <Background>
      <Screen>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Settings</Text>

          {/* Stats */}
          <GlassCard style={styles.section}>
            <Text style={styles.sectionTitle}>Your Journey</Text>
            <View style={styles.statsRow}>
              <StatItem label="Calm minutes" value={calmMinutes} />
              <StatItem label="Sessions" value={totalSessions} />
              <StatItem label="Streak" value={`${streakDays}d`} />
            </View>
          </GlassCard>

          {/* Preferences */}
          <GlassCard style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.rows}>
              <SettingRow
                label="Haptics"
                value={hapticsEnabled}
                onValueChange={setHapticsEnabled}
              />
              <SettingRow
                label="Sound"
                value={soundEnabled}
                onValueChange={setSoundEnabled}
              />
            </View>
          </GlassCard>

          {/* About */}
          <GlassCard style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.aboutName}>Calm</Text>
            <Text style={styles.aboutVersion}>Version 1.0.0</Text>
            <Text style={styles.aboutTagline}>A gentle space for your mind.</Text>
          </GlassCard>

          {/* Reset */}
          <View style={styles.section}>
            <Pressable
              accessibilityLabel="Reset all data"
              accessibilityRole="button"
              onPress={handleReset}
              style={styles.resetButton}>
              <Text style={styles.resetText}>Reset All Data</Text>
            </Pressable>
          </View>
        </ScrollView>
      </Screen>
    </Background>
  );
}

type StatItemProps = {
  label: string;
  value: number | string;
};

function StatItem({ label, value }: StatItemProps) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

type SettingRowProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

function SettingRow({ label, value, onValueChange }: SettingRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch
        accessibilityLabel={`${label} toggle`}
        onValueChange={onValueChange}
        thumbColor={colors.text}
        trackColor={{ false: colors.backgroundDeep, true: colors.teal }}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: typography.title,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.body,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: colors.teal,
    fontSize: typography.title,
    marginBottom: spacing.xs,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
  rows: {
    gap: spacing.sm,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 52,
  },
  rowLabel: {
    color: colors.text,
    fontSize: typography.body,
  },
  aboutName: {
    color: colors.text,
    fontSize: typography.body,
  },
  aboutVersion: {
    color: colors.textMuted,
    fontSize: typography.caption,
    marginTop: spacing.xs,
  },
  aboutTagline: {
    color: colors.textMuted,
    fontSize: typography.caption,
    fontStyle: 'italic',
    marginTop: spacing.sm,
  },
  resetButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(220, 80, 80, 0.15)',
    borderColor: 'rgba(220, 80, 80, 0.4)',
    borderRadius: radii.pill,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 48,
  },
  resetText: {
    color: '#DC5050',
    fontSize: typography.body,
  },
});
