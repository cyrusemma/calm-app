import { StyleSheet, Switch, Text, View } from 'react-native';

import { Background, GlassCard, Screen } from '@/src/components';
import { useCalmStore } from '@/src/store/useCalmStore';
import { colors, spacing, typography } from '@/src/theme';

export default function SettingsScreen() {
  const hapticsEnabled = useCalmStore((state) => state.hapticsEnabled);
  const soundEnabled = useCalmStore((state) => state.soundEnabled);
  const setHapticsEnabled = useCalmStore((state) => state.setHapticsEnabled);
  const setSoundEnabled = useCalmStore((state) => state.setSoundEnabled);

  return (
    <Background>
      <Screen>
        <GlassCard>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.body}>Choose what supports your relaxing space.</Text>
          <View style={styles.rows}>
            <SettingRow
              label="Haptics"
              value={hapticsEnabled}
              onValueChange={setHapticsEnabled}
            />
            <SettingRow label="Sound" value={soundEnabled} onValueChange={setSoundEnabled} />
          </View>
        </GlassCard>
      </Screen>
    </Background>
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
    marginBottom: spacing.sm,
  },
  body: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
  rows: {
    gap: spacing.sm,
    marginTop: spacing.xxl,
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
});
