export interface BehaviorConfig {
  animation?: string
  duration?: number
  delay?: number
  repeat?: number
  trigger?: string
  effect?: string
  count?: number
  color?: string
  particles?: number
  threshold?: number
}

export const behaviorPresets: Record<string, BehaviorConfig> = {
  fadeIn: { animation: 'fadeIn', duration: 0.3 },
  fadeInSlow: { animation: 'fadeIn', duration: 0.6 },
  slideUp: { animation: 'slideUp', duration: 0.4 },
  slideDown: { animation: 'slideDown', duration: 0.4 },
  scaleIn: { animation: 'scaleIn', duration: 0.3 },
  'hover-sparkles': { trigger: 'hover', effect: 'particles', count: 15, color: 'white' },
  'explode-on-drop': { trigger: 'dragEnd', effect: 'explosion', particles: 12 },
  pulse: { animation: 'pulse', duration: 1, repeat: Infinity },
  'flicker-low': { trigger: 'threshold', effect: 'flicker', threshold: 0.2 },
}

export function getBehaviorPreset(name: string): BehaviorConfig | undefined {
  return behaviorPresets[name]
}
