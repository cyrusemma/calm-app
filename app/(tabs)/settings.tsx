import { StyleSheet, Text } from 'react-native';

import { Background, GlassCard, Screen } from '@/src/components';
import { colors, spacing, typography } from '@/src/theme';

export default function SettingsScreen() {
  return (
    <Background>
      <Screen>
        <GlassCard>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.body}>Choose what supports your relaxing space.</Text>
        </GlassCard>
      </Screen>
    </Background>
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
});
