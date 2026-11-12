export type PhaseAction = 'in' | 'hold' | 'out' | 'rest';

export interface BreathPhase {
  label: string;
  seconds: number;
  action: PhaseAction;
}

export const patterns = {
  '4-4': [
    { label: 'Breathe in', seconds: 4, action: 'in' },
    { label: 'Breathe out', seconds: 4, action: 'out' },
  ],
  '4-7-8': [
    { label: 'Breathe in', seconds: 4, action: 'in' },
    { label: 'Hold gently', seconds: 7, action: 'hold' },
    { label: 'Breathe out', seconds: 8, action: 'out' },
  ],
  'Box': [
    { label: 'Breathe in', seconds: 4, action: 'in' },
    { label: 'Hold gently', seconds: 4, action: 'hold' },
    { label: 'Breathe out', seconds: 4, action: 'out' },
    { label: 'Rest gently', seconds: 4, action: 'rest' },
  ],
} as const;

export type PatternName = keyof typeof patterns;
