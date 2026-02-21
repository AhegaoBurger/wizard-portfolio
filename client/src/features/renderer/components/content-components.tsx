import type { RendererComponentProps } from '../types'
import { cn } from '@/shared/utils'

export function Text({ node, data }: RendererComponentProps) {
  const variant = (node.props?.variant as string) || 'body'
  const value = data != null ? String(data) : ''

  const variantClasses: Record<string, string> = {
    heading: 'text-heading',
    subtitle: 'text-subtitle',
    body: 'text-white text-xs',
    label: 'text-white text-xs font-bold glow-text',
    caption: 'text-white text-xs opacity-70',
  }

  const Tag = variant === 'heading' ? 'h2' : variant === 'subtitle' ? 'h3' : 'span'

  return (
    <Tag className={cn(variantClasses[variant] || variantClasses.body, node.props?.className as string)}>
      {value}
    </Tag>
  )
}

export function ImageComponent({ node, data }: RendererComponentProps) {
  const src = data != null ? String(data) : (node.props?.src as string) || ''
  const alt = (node.props?.alt as string) || ''
  const className = (node.props?.className as string) || ''

  return (
    <img
      src={src}
      alt={alt}
      className={cn('image-rendering-pixelated', className)}
    />
  )
}

export function LinkComponent({ node, data }: RendererComponentProps) {
  const href = data != null ? String(data) : (node.props?.href as string) || '#'
  const label = (node.props?.label as string) || href

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-white underline text-xs hover:bg-white hover:text-black px-1"
    >
      {label}
    </a>
  )
}

export function ButtonComponent({ node }: RendererComponentProps) {
  const label = (node.props?.label as string) || 'Button'
  const variant = (node.props?.variant as string) || 'default'

  return (
    <button
      className={cn(
        'pixel-button px-2 py-1 text-xs',
        variant === 'primary' ? 'bg-white text-black' : 'text-white',
      )}
    >
      {label}
    </button>
  )
}

export function ProgressBar({ node, data }: RendererComponentProps) {
  const value = typeof data === 'number' ? data : 0
  const max = (node.props?.max as number) || 100
  const percentage = Math.min(100, (value / max) * 100)
  const pattern = (node.props?.pattern as string) || 'checker'

  const patternClass = pattern === 'diagonal' ? 'bg-pattern-diagonal'
    : pattern === 'dots' ? 'bg-pattern-dots'
    : pattern === 'solid' ? 'bg-white'
    : 'bg-pattern-checker'

  return (
    <div className="w-full h-4 border border-white flex">
      <div
        className={cn('h-full', patternClass)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

export function Badge({ node, data }: RendererComponentProps) {
  const value = data != null ? String(data) : (node.props?.label as string) || ''
  const variant = (node.props?.variant as string) || 'default'

  return (
    <span
      className={cn(
        'border border-white px-1 text-xs',
        variant === 'filled' ? 'bg-white text-black' : 'text-white',
      )}
    >
      {value}
    </span>
  )
}
