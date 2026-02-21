import { useQuery } from '@tanstack/react-query'
import { pagesListQueryOptions } from '../api/editor.queries'
import { useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'

export function PageSelector() {
  const { data: pages, isLoading } = useQuery(pagesListQueryOptions)
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black p-4 font-pixel flex items-center justify-center">
        <div className="text-white text-xl">Loading pages...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-4 font-pixel">
      <div className="max-w-lg mx-auto mt-8">
        <div className="border border-white bg-black">
          <div className="border-b border-white bg-white text-black text-center py-2 font-bold">
            Page_Editor
          </div>
          <div className="p-4">
            <div className="border border-white p-2 mb-4">
              <h2 className="text-white text-center font-bold mb-2">SELECT A PAGE TO EDIT</h2>
              <p className="text-white text-xs text-center">Choose a page definition to modify</p>
            </div>

            <div className="flex flex-col gap-2">
              {pages?.map((page) => (
                <motion.div
                  key={page.id}
                  className="p-3 border border-white cursor-pointer"
                  onClick={() => navigate({ to: '/admin/editor/$pageId', params: { pageId: page.id } })}
                  whileHover={{ scale: 1.02, backgroundColor: '#111' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold text-sm">{page.title}</span>
                    <span className="text-white text-xs opacity-70">v{page.version}</span>
                  </div>
                  <div className="text-white text-xs mt-1 opacity-70">{page.route}</div>
                </motion.div>
              ))}
            </div>

            <div className="mt-4">
              <motion.button
                className="w-full border border-white px-3 py-2 text-white text-xs text-center"
                onClick={() => navigate({ to: '/' })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                BACK TO DESKTOP
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
