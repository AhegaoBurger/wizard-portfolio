import { createRootRoute } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WizardOSShell } from '@/features/wizard-os/shell/wizard-os'
import { DuelPage } from '@/features/wizard-os/pages/site-pages'
import { useOS } from '@/features/wizard-os/shell/os-context'

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
  notFoundComponent: NotFound,
})

// The whole site lives inside the Wizard OS shell: menu bar, dock, CRT frame.
// The shell renders <Outlet /> for the active route.
function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <WizardOSShell />
    </QueryClientProvider>
  )
}

function NotFound() {
  const os = useOS()
  return <DuelPage accent={os.accent} />
}
