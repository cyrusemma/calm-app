import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Pressable, StyleSheet, Text, View } from 'react-native';

import { Background, GlassCard, Screen } from '@/src/components';
import { BreathingOrb, patterns, PatternName } from '@/src/features/breathe';
import { useCalmStore } from '@/src/store/useCalmStore';
import { colors, radii, spacing, typography } from '@/src/theme';
import { playCalmChime } from '@/src/utils/sound';

export default function BreatheScreen() {
  const [patternName, setPatternName] = useState<PatternName>('4-4');
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);

  const hapticsEnabled = useCalmStore((state) => state.hapticsEnabled);
  const soundEnabled = useCalmStore((state) => state.soundEnabled);
  const addCalm = useCalmStore((state) => state.addCalm);
  const addSession = useCalmStore((state) => state.addSession);

  const phases = patterns[patternName];
  const phase = phases[phaseIndex];
  const phaseKey = useMemo(() => `${patternName}-${phaseIndex}`, [patternName, phaseIndex]);
  const creditedMinutesRef = useRef(0);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReducedMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReducedMotion);
    return () => subscription.remove();
  }, []);

  // Phase transition timer
  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setPhaseIndex((current) => (current + 1) % phases.length);
    }, phase.seconds * 1000);
    return () => clearInterval(timer);
  }, [isRunning, phase.seconds, phases.length, phaseKey]);

  // Haptics & Chime on phase change
  useEffect(() => {
    if (isRunning) {
      if (hapticsEnabled) {
        Haptics.selectionAsync().catch(() => {});
      }
      if (soundEnabled) {
        playCalmChime();
      }
    }
  }, [hapticsEnabled, soundEnabled, isRunning, phaseKey]);

  // Session elapsed seconds counter
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setElapsedSeconds((sec) => {
        const next = sec + 1;
        // Every 60 seconds of continuous breathing, credit 1 calm minute
        if (next % 60 === 0) {
          addCalm(1);
          creditedMinutesRef.current += 1;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, addCalm]);

  const selectPattern = (name: PatternName) => {
    setPatternName(name);
    setPhaseIndex(0);
  };

  const toggleRunning = useCallback(() => {
    setIsRunning((prev) => {
      const willRun = !prev;
      if (willRun) {
        // Start fresh
        setElapsedSeconds(0);
        creditedMinutesRef.current = 0;
        setCompletionMessage(null);
      } else {
        // Stopping: record session and remainder
        if (elapsedSeconds >= 15) {
          addSession();
          const totalEarned = Math.max(1, Math.round(elapsedSeconds / 60));
          const remainder = totalEarned - creditedMinutesRef.current;
          if (remainder > 0) {
            addCalm(remainder);
          }
          setCompletionMessage('✨ Session recorded! Well done.');
        }
      }
      return willRun;
    });
  }, [elapsedSeconds, addSession, addCalm]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Background>
      <Screen>
        <View style={styles.header}>
          <Text style={styles.title}>Breathe</Text>
          <Text style={styles.body}>
            {isRunning ? `In session · ${formatTimer(elapsedSeconds)}` : 'Follow the gentle pace.'}
          </Text>
        </View>

        <BreathingOrb
          label={isRunning ? phase.label : 'Ready'}
          seconds={isRunning ? phase.seconds : 4}
          action={isRunning ? phase.action : 'in'}
          isRunning={isRunning}
          reducedMotion={reducedMotion}
        />

        {completionMessage && !isRunning && (
          <View style={styles.messageBanner}>
            <Text style={styles.messageText}>{completionMessage}</Text>
          </View>
        )}

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
            onPress={toggleRunning}
            style={styles.primaryButton}>
            <Text style={styles.buttonText}>{isRunning ? 'Stop' : 'Begin'}</Text>
          </Pressable>
        </GlassCard>
      </Screen>
    </Background>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.xs,
  },
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
  messageBanner: {
    alignItems: 'center',
    backgroundColor: 'rgba(93, 156, 154, 0.25)',
    borderColor: colors.teal,
    borderRadius: radii.pill,
    borderWidth: 1,
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
  },
  messageText: {
    color: colors.text,
    fontSize: typography.caption,
  },
  patterns: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  pattern: {
    flex: 1,
    alignItems: 'center',
    borderColor: colors.glassBorder,
    borderRadius: radii.pill,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
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
    fontWeight: '600',
  },
});
