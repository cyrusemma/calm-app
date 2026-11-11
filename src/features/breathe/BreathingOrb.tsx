import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { colors, durations, radii, spacing, typography } from '@/src/theme';

type BreathingOrbProps = {
  label: string;
  seconds: number;
  expanding: boolean;
  reducedMotion: boolean;
};

export function BreathingOrb({
  label,
  seconds,
  expanding,
  reducedMotion,
}: BreathingOrbProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = reducedMotion
      ? 1
      : withTiming(expanding ? 1.35 : 0.9, {
          duration: seconds * 1000,
          easing: Easing.inOut(Easing.ease),
        });
  }, [expanding, reducedMotion, scale, seconds]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.orb, animatedStyle]}>
        <Text style={styles.label}>{label}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 280,
  },
  orb: {
    alignItems: 'center',
    backgroundColor: colors.teal,
    borderRadius: radii.pill,
    height: 180,
    justifyContent: 'center',
    shadowColor: colors.teal,
    shadowOpacity: 0.4,
    shadowRadius: spacing.xl,
    width: 180,
  },
  label: {
    color: colors.backgroundDeep,
    fontSize: typography.body,
  },
});
