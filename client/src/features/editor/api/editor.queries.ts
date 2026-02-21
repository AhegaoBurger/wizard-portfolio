import { queryOptions } from '@tanstack/react-query'
import { listPages, getPage } from './editor.service'

export const editorKeys = {
  all: ['editor'] as const,
  pages: () => [...editorKeys.all, 'pages'] as const,
  page: (id: string) => [...editorKeys.all, 'page', id] as const,
}

export const pagesListQueryOptions = queryOptions({
  queryKey: editorKeys.pages(),
  queryFn: listPages,
})

export function pageQueryOptions(id: string) {
  return queryOptions({
    queryKey: editorKeys.page(id),
    queryFn: () => getPage(id),
    enabled: !!id,
  })
}
