import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Background, GlassCard, Screen } from '@/src/components';
import { SandCanvas } from '@/src/features/sand';
import { useCalmStore } from '@/src/store/useCalmStore';
import { colors, radii, spacing, typography } from '@/src/theme';

export default function SandScreen() {
  const [drawingKey, setDrawingKey] = useState(0);
  const [hasDrawn, setHasDrawn] = useState(false);
  const addCalm = useCalmStore((state) => state.addCalm);
  const markDrawn = useCallback(() => setHasDrawn(true), []);

  const clearSand = () => {
    if (hasDrawn) addCalm(1);
    setHasDrawn(false);
    setDrawingKey((key) => key + 1);
  };

  return (
    <Background>
      <Screen>
        <View style={styles.header}>
          <Text style={styles.title}>Sand</Text>
          <Text style={styles.body}>Draw a quiet pattern, then smooth the sand.</Text>
        </View>
        <SandCanvas key={drawingKey} onDraw={markDrawn} />
        <GlassCard style={styles.controls}>
          <Pressable
            accessibilityLabel="Smooth sand"
            accessibilityRole="button"
            onPress={clearSand}
            style={styles.primaryButton}>
            <Text style={styles.buttonText}>Smooth sand</Text>
          </Pressable>
        </GlassCard>
      </Screen>
    </Background>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: typography.title,
    marginBottom: spacing.xs,
  },
  body: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
  header: {
    marginBottom: spacing.lg,
  },
  controls: {
    marginTop: spacing.lg,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.sand,
    borderRadius: radii.pill,
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonText: {
    color: colors.backgroundDeep,
    fontSize: typography.body,
  },
});
