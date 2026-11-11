import { BlurView } from 'expo-blur';
import { StyleSheet, ViewProps } from 'react-native';

import { colors, radii, spacing } from '@/src/theme';

export function GlassCard({ style, children, ...props }: ViewProps) {
  return (
    <BlurView intensity={28} tint="dark" style={[styles.card, style]} {...props}>
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.glassFill,
    padding: spacing.xl,
    shadowColor: colors.backgroundDeep,
    shadowOffset: { width: 0, height: spacing.sm },
    shadowOpacity: 0.24,
    shadowRadius: spacing.xl,
  },
});
