import { Link, Stack } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { Background, GlassCard, Screen } from '@/src/components';
import { colors, typography, spacing } from '@/src/theme';

export default function NotFoundScreen() {
  return (
    <Background>
      <Screen>
        <Stack.Screen options={{ title: 'Oops!', headerShown: false }} />
        <GlassCard style={styles.card}>
          <Text style={styles.title}>This screen doesn't exist.</Text>
          <Link href="/" style={styles.link}>
            <Text style={styles.linkText}>Go to home screen!</Text>
          </Link>
        </GlassCard>
      </Screen>
    </Background>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  title: {
    fontSize: typography.title,
    fontWeight: 'bold',
    color: colors.text,
  },
  link: {
    marginTop: spacing.lg,
    paddingVertical: spacing.md,
  },
  linkText: {
    fontSize: typography.body,
    color: colors.teal,
  },
});
