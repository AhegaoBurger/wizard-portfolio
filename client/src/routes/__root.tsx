import { createRootRoute, Outlet } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MenuBar from '@/features/home/components/menu-bar'
import CustomCursor from '@/shared/components/interactive/custom-cursor'
import { useIsMobile } from '@/shared/hooks/use-mobile'
import { MenuBarActionsProvider, useMenuBarActions } from '@/features/home/components/menu-bar-context'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <MenuBarActionsProvider>
        <div className="ambient-particles">
          <DesktopMenuBar />
          <Outlet />
          <div className="crt-overlay" />
          <DesktopCursor />
        </div>
      </MenuBarActionsProvider>
    </QueryClientProvider>
  )
}

function DesktopCursor() {
  const isMobile = useIsMobile()
  if (isMobile) return null
  return <CustomCursor />
}

function DesktopMenuBar() {
  const isMobile = useIsMobile()
  const actions = useMenuBarActions()
  if (isMobile) return null
  return <MenuBar onReplayBoot={actions.onReplayBoot} onOpenTerminal={actions.onOpenTerminal} />
}
