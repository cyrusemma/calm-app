import { StyleSheet, Text } from 'react-native';

import { Background, GlassCard, Screen } from '@/src/components';
import { colors, spacing, typography } from '@/src/theme';

export default function TabOneScreen() {
  return (
    <Background>
      <Screen>
        <GlassCard>
          <Text style={styles.title}>Breathe</Text>
          <Text style={styles.body}>Make space for a quiet breath.</Text>
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
