import { StyleSheet, Text } from 'react-native';

import { Background, GlassCard, Screen } from '@/src/components';
import { colors, spacing, typography } from '@/src/theme';

export default function GardenScreen() {
  return (
    <Background>
      <Screen>
        <GlassCard>
          <Text style={styles.title}>Garden</Text>
          <Text style={styles.body}>Your calm garden will grow with you.</Text>
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
