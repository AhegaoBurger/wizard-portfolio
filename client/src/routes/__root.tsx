import { createRootRoute, Outlet } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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
      <div className="ambient-particles">
        <Outlet />
        <div className="crt-overlay" />
      </div>
    </QueryClientProvider>
  )
}
