import { StyleSheet, Text, View } from 'react-native';

import { Background, GlassCard, Screen } from '@/src/components';
import { useCalmStore } from '@/src/store/useCalmStore';
import { colors, spacing, typography } from '@/src/theme';

export default function GardenScreen() {
  const calmMinutes = useCalmStore((state) => state.calmMinutes);
  const plants = [
    { name: 'First sprout', needed: 0, symbol: '✦' },
    { name: 'Quiet fern', needed: 3, symbol: '❋' },
    { name: 'Soft tree', needed: 10, symbol: '✿' },
  ];

  return (
    <Background>
      <Screen>
        <GlassCard>
          <Text style={styles.title}>Garden</Text>
          <Text style={styles.body}>{calmMinutes} calm minutes</Text>
          <View style={styles.garden}>
            {plants.map((plant) => {
              const unlocked = calmMinutes >= plant.needed;
              return (
                <View key={plant.name} style={[styles.plant, !unlocked && styles.lockedPlant]}>
                  <Text accessibilityLabel={unlocked ? plant.name : 'Plant waiting to grow'} style={styles.symbol}>
                    {unlocked ? plant.symbol : '·'}
                  </Text>
                  <Text style={styles.plantName}>{unlocked ? plant.name : 'Growing gently'}</Text>
                </View>
              );
            })}
          </View>
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
  garden: {
    gap: spacing.lg,
    marginTop: spacing.xxl,
  },
  plant: {
    alignItems: 'center',
    backgroundColor: 'rgba(93, 156, 154, 0.22)',
    borderRadius: typography.title,
    flexDirection: 'row',
    minHeight: 64,
    paddingHorizontal: spacing.lg,
  },
  lockedPlant: {
    opacity: 0.55,
  },
  symbol: {
    color: colors.sand,
    fontSize: typography.title,
    marginRight: spacing.lg,
  },
  plantName: {
    color: colors.text,
    fontSize: typography.body,
  },
});
