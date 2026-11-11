import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

import { colors } from '@/src/theme';

type BackgroundProps = {
  children: React.ReactNode;
};

export function Background({ children }: BackgroundProps) {
  return (
    <LinearGradient
      colors={[colors.backgroundDeep, colors.background, colors.lavender]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
