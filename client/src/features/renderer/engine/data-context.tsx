import { createContext, useContext } from 'react'

interface DataContextValue {
  rootData: Record<string, unknown>
  scopedData: Record<string, unknown>
}

const DataContext = createContext<DataContextValue>({
  rootData: {},
  scopedData: {},
})

export function DataProvider({
  rootData,
  scopedData,
  children,
}: {
  rootData: Record<string, unknown>
  scopedData: Record<string, unknown>
  children: React.ReactNode
}) {
  return (
    <DataContext.Provider value={{ rootData, scopedData }}>
      {children}
    </DataContext.Provider>
  )
}

export function useDataContext() {
  return useContext(DataContext)
}

/**
 * Resolve a dot-path like "profile.name" from a data object.
 */
export function resolveField(data: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((obj, key) => {
    if (obj != null && typeof obj === 'object') {
      return (obj as Record<string, unknown>)[key]
    }
    return undefined
  }, data)
}
