import type { RendererComponentProps } from '../types'

export function ParticleEffectComponent(_props: RendererComponentProps) {
  // Placeholder - full particle effect is in shared/components/interactive
  return null
}

export function DraggableItemComponent({ node, children }: RendererComponentProps) {
  return (
    <div className="cursor-grab active:cursor-grabbing">
      {children}
    </div>
  )
}

export function ManaBarComponent(_props: RendererComponentProps) {
  // Re-exports the shared ManaBar - can be placed via layout
  const ManaBar = require('@/shared/components/navigation/mana-bar').default
  return <ManaBar />
}

export function ClockComponent(_props: RendererComponentProps) {
  const Clock = require('@/shared/components/navigation/clock').default
  return <Clock />
}

export function DialogBoxComponent(_props: RendererComponentProps) {
  // Placeholder - dialog is interactive and needs state
  return null
}
