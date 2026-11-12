import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors, radii, spacing, typography } from '@/src/theme';
import { PhaseAction } from './patterns';

type BreathingOrbProps = {
  label: string;
  seconds: number;
  action: PhaseAction;
  isRunning: boolean;
  reducedMotion: boolean;
};

export function BreathingOrb({
  label,
  seconds,
  action,
  isRunning,
  reducedMotion,
}: BreathingOrbProps) {
  const scale = useSharedValue(1);
  const haloScale = useSharedValue(1);
  const [countdown, setCountdown] = useState(seconds);

  // Countdown timer inside the orb
  useEffect(() => {
    if (!isRunning) {
      setCountdown(seconds);
      return;
    }
    setCountdown(seconds);
    const interval = setInterval(() => {
      setCountdown((prev) => Math.max(1, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, seconds, label]);

  // Orb scale animation based on breathing action
  useEffect(() => {
    if (!isRunning) {
      scale.value = withTiming(1, { duration: 600 });
      haloScale.value = withTiming(1, { duration: 600 });
      return;
    }

    if (reducedMotion) {
      scale.value = 1;
      haloScale.value = 1;
      return;
    }

    const duration = seconds * 1000;
    const easing = Easing.inOut(Easing.ease);

    switch (action) {
      case 'in':
        scale.value = withTiming(1.35, { duration, easing });
        haloScale.value = withTiming(1.5, { duration, easing });
        break;
      case 'hold':
        // Stay full
        scale.value = 1.35;
        haloScale.value = withTiming(1.4, { duration, easing });
        break;
      case 'out':
        scale.value = withTiming(0.95, { duration, easing });
        haloScale.value = withTiming(1.05, { duration, easing });
        break;
      case 'rest':
        // Stay small
        scale.value = 0.95;
        haloScale.value = 1.0;
        break;
    }
  }, [action, isRunning, reducedMotion, scale, haloScale, seconds]);

  const animatedOrbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedHaloStyle = useAnimatedStyle(() => ({
    transform: [{ scale: haloScale.value }],
    opacity: isRunning ? 0.35 : 0.15,
  }));

  return (
    <View style={styles.container}>
      {/* Soft glowing ambient halo */}
      <Animated.View style={[styles.halo, animatedHaloStyle]} />

      {/* Main interactive breathing orb */}
      <Animated.View style={[styles.orb, animatedOrbStyle]}>
        <Text style={styles.label}>{label}</Text>
        {isRunning && <Text style={styles.countdown}>{countdown}</Text>}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 280,
    position: 'relative',
  },
  halo: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: radii.pill,
    backgroundColor: colors.teal,
  },
  orb: {
    alignItems: 'center',
    backgroundColor: colors.teal,
    borderRadius: radii.pill,
    height: 180,
    justifyContent: 'center',
    shadowColor: colors.teal,
    shadowOpacity: 0.45,
    shadowRadius: spacing.xl,
    width: 180,
  },
  label: {
    color: colors.backgroundDeep,
    fontSize: typography.body,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  countdown: {
    color: colors.backgroundDeep,
    fontSize: 26,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
});
