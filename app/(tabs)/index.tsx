import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useState } from 'react';
import { AccessibilityInfo, Pressable, StyleSheet, Text, View } from 'react-native';

import { Background, GlassCard, Screen } from '@/src/components';
import { BreathingOrb, patterns, PatternName } from '@/src/features/breathe';
import { useCalmStore } from '@/src/store/useCalmStore';
import { colors, radii, spacing, typography } from '@/src/theme';

export default function BreatheScreen() {
  const [patternName, setPatternName] = useState<PatternName>('4-4');
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const hapticsEnabled = useCalmStore((state) => state.hapticsEnabled);
  const addCalm = useCalmStore((state) => state.addCalm);
  const phases = patterns[patternName];
  const phase = phases[phaseIndex];
  const phaseKey = useMemo(() => `${patternName}-${phaseIndex}`, [patternName, phaseIndex]);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReducedMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReducedMotion);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setPhaseIndex((current) => (current + 1) % phases.length);
    }, phase.seconds * 1000);
    return () => clearInterval(timer);
  }, [isRunning, phase.seconds, phases.length, phaseKey]);

  useEffect(() => {
    if (isRunning && hapticsEnabled) {
      Haptics.selectionAsync();
    }
  }, [hapticsEnabled, isRunning, phaseKey]);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => addCalm(1), 60_000);
    return () => clearInterval(timer);
  }, [addCalm, isRunning]);

  const selectPattern = (name: PatternName) => {
    setPatternName(name);
    setPhaseIndex(0);
  };

  return (
    <Background>
      <Screen>
        <Text style={styles.title}>Breathe</Text>
        <Text style={styles.body}>Follow the gentle pace.</Text>
        <BreathingOrb
          label={isRunning ? phase.label : 'Ready'}
          seconds={isRunning ? phase.seconds : 1}
          expanding={isRunning && phaseIndex === 0}
          reducedMotion={reducedMotion}
        />
        <GlassCard>
          <View style={styles.patterns}>
            {(Object.keys(patterns) as PatternName[]).map((name) => (
              <Pressable
                accessibilityLabel={`Choose ${name} breathing`}
                accessibilityRole="button"
                key={name}
                onPress={() => selectPattern(name)}
                style={[styles.pattern, patternName === name && styles.selectedPattern]}>
                <Text style={styles.patternText}>{name}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            accessibilityLabel={isRunning ? 'Stop breathing' : 'Start breathing'}
            accessibilityRole="button"
            onPress={() => setIsRunning((running) => !running)}
            style={styles.primaryButton}>
            <Text style={styles.buttonText}>{isRunning ? 'Stop' : 'Begin'}</Text>
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
    marginBottom: spacing.sm,
  },
  patterns: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  pattern: {
    alignItems: 'center',
    borderColor: colors.glassBorder,
    borderRadius: radii.pill,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  selectedPattern: {
    backgroundColor: colors.teal,
  },
  patternText: {
    color: colors.text,
    fontSize: typography.body,
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
