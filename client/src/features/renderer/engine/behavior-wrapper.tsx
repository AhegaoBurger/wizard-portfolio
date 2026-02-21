import { motion } from 'framer-motion'
import type { BehaviorRef } from '../types'
import { getBehaviorPreset, type BehaviorConfig } from '../registry/behavior-presets'

interface BehaviorWrapperProps {
  behaviors?: BehaviorRef[]
  children: React.ReactNode
}

function getMotionProps(config: BehaviorConfig) {
  switch (config.animation) {
    case 'fadeIn':
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: config.duration || 0.3, delay: config.delay || 0 },
      }
    case 'slideUp':
      return {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: config.duration || 0.4, delay: config.delay || 0 },
      }
    case 'slideDown':
      return {
        initial: { y: -20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: config.duration || 0.4, delay: config.delay || 0 },
      }
    case 'scaleIn':
      return {
        initial: { scale: 0.9, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { duration: config.duration || 0.3, delay: config.delay || 0 },
      }
    case 'pulse':
      return {
        animate: { scale: [1, 1.02, 1] },
        transition: { duration: config.duration || 1, repeat: config.repeat ?? Infinity },
      }
    default:
      return {}
  }
}

export function BehaviorWrapper({ behaviors, children }: BehaviorWrapperProps) {
  if (!behaviors || behaviors.length === 0) {
    return <>{children}</>
  }

  // Merge all behavior presets into a single motion config
  let mergedProps: Record<string, unknown> = {}

  for (const ref of behaviors) {
    const config = getBehaviorPreset(ref.preset)
    if (config?.animation) {
      mergedProps = { ...mergedProps, ...getMotionProps(config) }
    }
  }

  if (Object.keys(mergedProps).length === 0) {
    return <>{children}</>
  }

  return <motion.div {...(mergedProps as any)}>{children}</motion.div>
}
