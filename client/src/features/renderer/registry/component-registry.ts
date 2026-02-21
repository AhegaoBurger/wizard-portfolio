import type { RendererComponentProps } from '../types'
import type React from 'react'

export interface RegistryEntry {
  component: React.ComponentType<RendererComponentProps>
}

const componentRegistry = new Map<string, RegistryEntry>()

export function register(type: string, component: React.ComponentType<RendererComponentProps>) {
  componentRegistry.set(type, { component })
}

export function getComponent(type: string): RegistryEntry | undefined {
  return componentRegistry.get(type)
}

export function getRegisteredTypes(): string[] {
  return Array.from(componentRegistry.keys())
}

export { componentRegistry }
