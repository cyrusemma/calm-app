import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Background, Screen } from '@/src/components';
import { useCalmStore } from '@/src/store/useCalmStore';
import { colors, radii, spacing, typography } from '@/src/theme';

const PLANTS = [
  { name: 'First Sprout', needed: 0, symbol: '🌱' },
  { name: 'Quiet Fern', needed: 1, symbol: '🌿' },
  { name: 'Lucky Clover', needed: 3, symbol: '🍀' },
  { name: 'Cherry Blossom', needed: 5, symbol: '🌸' },
  { name: 'Hibiscus', needed: 10, symbol: '🌺' },
  { name: 'Sunflower', needed: 15, symbol: '🌻' },
  { name: 'Old Oak', needed: 25, symbol: '🌳' },
  { name: 'Palm Shade', needed: 40, symbol: '🌴' },
  { name: 'Desert Calm', needed: 60, symbol: '🌵' },
  { name: 'Free Spirit', needed: 90, symbol: '🦋' },
  { name: 'After Rain', needed: 120, symbol: '🌈' },
  { name: 'Guiding Star', needed: 180, symbol: '⭐' },
] as const;

export default function GardenScreen() {
  const calmMinutes = useCalmStore((state) => state.calmMinutes);
  const unlockedCount = PLANTS.filter((p) => calmMinutes >= p.needed).length;

  return (
    <Background>
      <Screen>
        <FlatList
          data={PLANTS}
          keyExtractor={(item) => item.name}
          numColumns={3}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.title}>Garden</Text>
              <Text style={styles.minutes}>{calmMinutes} calm minutes</Text>
              <Text style={styles.blooming}>
                {unlockedCount} / {PLANTS.length} blooming
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const unlocked = calmMinutes >= item.needed;
            return (
              <View style={[styles.plantCard, !unlocked && styles.lockedCard]}>
                <Text style={styles.symbol}>{unlocked ? item.symbol : '·'}</Text>
                <Text style={styles.plantName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.plantMinutes}>{item.needed} min</Text>
              </View>
            );
          }}
        />
      </Screen>
    </Background>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    marginBottom: spacing.xs,
  },
  minutes: {
    color: colors.textMuted,
    fontSize: typography.body,
  },
  blooming: {
    color: colors.teal,
    fontSize: typography.caption,
    marginTop: spacing.xs,
  },
  listContent: {
    paddingBottom: spacing.huge,
  },
  row: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  plantCard: {
    alignItems: 'center',
    backgroundColor: colors.glassFill,
    borderColor: colors.glassBorder,
    borderRadius: radii.card,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.lg,
  },
  lockedCard: {
    opacity: 0.4,
  },
  symbol: {
    fontSize: 36,
    marginBottom: spacing.sm,
  },
  plantName: {
    color: colors.text,
    fontSize: typography.caption,
    textAlign: 'center',
  },
  plantMinutes: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: spacing.xs,
  },
});
