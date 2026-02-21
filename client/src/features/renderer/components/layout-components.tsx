import type { RendererComponentProps } from '../types'
import { cn } from '@/shared/utils'
import { useIsMobile } from '@/shared/hooks/use-mobile'

export function PageContainer({ node, children }: RendererComponentProps) {
  const isMobile = useIsMobile()
  const responsive = node.responsive
  const strategy = isMobile ? responsive?.mobile : responsive?.desktop

  const strategyClasses: Record<string, string> = {
    'grid-2col': 'grid grid-cols-2 gap-4',
    'grid-3col': 'grid grid-cols-3 gap-4',
    'flex-row': 'flex flex-row gap-4',
    stack: 'flex flex-col gap-4',
    tabs: 'flex flex-col gap-2',
    accordion: 'flex flex-col gap-2',
  }

  return (
    <div className={cn(
      'min-h-screen bg-black p-4 font-pixel relative',
      strategy && strategyClasses[strategy],
    )}>
      {children}
    </div>
  )
}

export function Box({ node, children }: RendererComponentProps) {
  const className = (node.props?.className as string) || ''
  return <div className={cn('', className)}>{children}</div>
}

export function Grid({ node, children }: RendererComponentProps) {
  const cols = (node.props?.cols as number) || 2
  const gap = (node.props?.gap as number) || 4
  return (
    <div className={cn(`grid gap-${gap}`, `grid-cols-${cols}`)}>
      {children}
    </div>
  )
}

export function Flex({ node, children }: RendererComponentProps) {
  const direction = (node.props?.direction as string) || 'row'
  const justify = (node.props?.justify as string) || 'start'
  const align = (node.props?.align as string) || 'start'
  const gap = (node.props?.gap as number) || 2
  return (
    <div className={cn(
      'flex',
      direction === 'column' ? 'flex-col' : 'flex-row',
      `justify-${justify}`,
      `items-${align}`,
      `gap-${gap}`,
    )}>
      {children}
    </div>
  )
}

export function Section({ node, children }: RendererComponentProps) {
  const title = node.props?.title as string | undefined
  return (
    <div className="border border-white p-2 glow-border">
      {title && (
        <div className="window-title-bar mb-2">
          {title}
        </div>
      )}
      {children}
    </div>
  )
}

export function Columns({ node, children }: RendererComponentProps) {
  const isMobile = useIsMobile()
  const cols = isMobile ? 1 : (node.props?.cols as number) || 2
  return (
    <div className={cn('grid', `grid-cols-${cols}`, 'gap-4')}>
      {children}
    </div>
  )
}

export function WindowComponent({ node, children }: RendererComponentProps) {
  const title = (node.props?.title as string) || 'Window'
  const width = (node.props?.width as string) || 'w-80'
  const height = (node.props?.height as string) || 'h-auto'
  const x = (node.props?.x as string) || 'left-4'
  const y = (node.props?.y as string) || 'top-4'
  const className = (node.props?.className as string) || ''

  return (
    <div className={cn('absolute window-chrome', width, height, x, y, className)}>
      <div className="window-title-bar">
        {title}
      </div>
      <div className="p-2">{children}</div>
    </div>
  )
}
