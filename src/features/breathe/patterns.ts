export const patterns = {
  '4-4': [
    { label: 'Breathe in', seconds: 4 },
    { label: 'Breathe out', seconds: 4 },
  ],
  '4-7-8': [
    { label: 'Breathe in', seconds: 4 },
    { label: 'Hold gently', seconds: 7 },
    { label: 'Breathe out', seconds: 8 },
  ],
} as const;

export type PatternName = keyof typeof patterns;
