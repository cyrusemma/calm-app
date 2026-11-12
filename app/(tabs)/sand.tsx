import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

import { Background, GlassCard, Screen } from '@/src/components';
import { SandCanvas } from '@/src/features/sand';
import { useCalmStore } from '@/src/store/useCalmStore';
import { colors, radii, spacing, typography } from '@/src/theme';

const PRESET_COLORS: { label: string; value: string }[] = [
  { label: 'Sand', value: '#D5B987' },
  { label: 'Teal', value: '#5D9C9A' },
  { label: 'Lavender', value: '#8E88B8' },
  { label: 'Cream', value: '#F3F0E8' },
  { label: 'Coral', value: '#E8A87C' },
];

const STROKE_WIDTHS = [
  { label: 'Thin', value: 2 },
  { label: 'Medium', value: 4 },
  { label: 'Thick', value: 8 },
] as const;

export default function SandScreen() {
  const [drawingKey, setDrawingKey] = useState(0);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [strokeColor, setStrokeColor] = useState(PRESET_COLORS[0].value);
  const [strokeWidth, setStrokeWidth] = useState<number>(STROKE_WIDTHS[1].value);
  const addCalm = useCalmStore((state) => state.addCalm);
  const addSession = useCalmStore((state) => state.addSession);
  const markDrawn = useCallback(() => setHasDrawn(true), []);

  const fadeOpacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeOpacity.value,
    flex: 1,
  }));

  const resetCanvas = useCallback(() => {
    setHasDrawn(false);
    setDrawingKey((key) => key + 1);
    fadeOpacity.value = 1;
  }, [fadeOpacity]);

  const clearSand = () => {
    if (hasDrawn) {
      addCalm(1);
      addSession();
    }
    fadeOpacity.value = withTiming(0, { duration: 400 }, (finished) => {
      if (finished) {
        runOnJS(resetCanvas)();
      }
    });
  };

  return (
    <Background>
      <Screen>
        <View style={styles.header}>
          <Text style={styles.title}>Sand</Text>
          <Text style={styles.body}>Draw a quiet pattern, then smooth the sand.</Text>
        </View>

        <Animated.View style={animatedStyle}>
          <SandCanvas
            key={drawingKey}
            onDraw={markDrawn}
            strokeColor={strokeColor}
            strokeWidth={strokeWidth}
          />
        </Animated.View>

        {/* Color Picker */}
        <View style={styles.pickerRow}>
          {PRESET_COLORS.map((c) => (
            <Pressable
              key={c.value}
              accessibilityLabel={`${c.label} color`}
              onPress={() => setStrokeColor(c.value)}
              style={[
                styles.colorDot,
                { backgroundColor: c.value },
                strokeColor === c.value && styles.colorDotSelected,
              ]}
            />
          ))}
        </View>

        {/* Stroke Width Toggle */}
        <View style={styles.widthRow}>
          {STROKE_WIDTHS.map((w) => (
            <Pressable
              key={w.label}
              accessibilityLabel={`${w.label} stroke`}
              onPress={() => setStrokeWidth(w.value)}
              style={[
                styles.widthPill,
                strokeWidth === w.value && styles.widthPillActive,
              ]}>
              <Text
                style={[
                  styles.widthLabel,
                  strokeWidth === w.value && styles.widthLabelActive,
                ]}>
                {w.label}
              </Text>
            </Pressable>
          ))}
        </View>

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
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  colorDot: {
    borderRadius: 14,
    height: 28,
    width: 28,
  },
  colorDotSelected: {
    borderColor: colors.text,
    borderWidth: 2,
  },
  widthRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  widthPill: {
    borderColor: colors.glassBorder,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  widthPillActive: {
    backgroundColor: colors.teal,
    borderColor: colors.teal,
  },
  widthLabel: {
    color: colors.textMuted,
    fontSize: typography.caption,
  },
  widthLabelActive: {
    color: colors.text,
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
