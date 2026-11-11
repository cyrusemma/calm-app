declare module 'expo-blur' {
  import { ComponentType, ReactNode } from 'react';
  import { ViewProps } from 'react-native';

  export const BlurView: ComponentType<
    ViewProps & {
      intensity?: number;
      tint?: 'default' | 'light' | 'dark' | 'extraLight' | 'prominent';
      children?: ReactNode;
    }
  >;
}

declare module 'expo-linear-gradient' {
  import { ComponentType } from 'react';
  import { ViewProps } from 'react-native';

  export const LinearGradient: ComponentType<
    ViewProps & {
      colors: readonly string[];
      start?: { x: number; y: number };
      end?: { x: number; y: number };
    }
  >;
}
