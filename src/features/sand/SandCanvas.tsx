import { useMemo, useRef, useState } from 'react';
import { PanResponder, StyleSheet, View } from 'react-native';

import { colors } from '@/src/theme';

type Point = { x: number; y: number };

type SandCanvasProps = {
  onDraw: () => void;
};

export function SandCanvas({ onDraw }: SandCanvasProps) {
  const [points, setPoints] = useState<Point[]>([]);
  const currentPoints = useRef<Point[]>([]);
  const lastRender = useRef(0);

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: (event) => {
          const point = { x: event.nativeEvent.locationX, y: event.nativeEvent.locationY };
          currentPoints.current = [point];
          setPoints([point]);
          onDraw();
        },
        onPanResponderMove: (event) => {
          const point = { x: event.nativeEvent.locationX, y: event.nativeEvent.locationY };
          currentPoints.current.push(point);
          const now = Date.now();
          if (now - lastRender.current > 50) {
            lastRender.current = now;
            setPoints([...currentPoints.current]);
          }
        },
        onPanResponderRelease: () => setPoints([...currentPoints.current]),
        onPanResponderTerminate: () => setPoints([...currentPoints.current]),
      }),
    [onDraw],
  );

  return (
    <View style={styles.canvas} {...responder.panHandlers}>
      {points.slice(1).map((point, index) => {
        const previous = points[index];
        const length = Math.hypot(point.x - previous.x, point.y - previous.y);
        const angle = Math.atan2(point.y - previous.y, point.x - previous.x);
        return (
          <View
            key={`${index}-${point.x}-${point.y}`}
            style={[
              styles.line,
              {
                left: previous.x,
                top: previous.y,
                transform: [{ rotate: `${angle}rad` }],
                width: length,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    backgroundColor: 'rgba(213, 185, 135, 0.18)',
    borderColor: colors.glassBorder,
    borderRadius: 24,
    borderWidth: 1,
    flex: 1,
    overflow: 'hidden',
  },
  line: {
    backgroundColor: colors.sand,
    borderRadius: 4,
    height: 4,
    position: 'absolute',
    transformOrigin: 'left center',
  },
});
