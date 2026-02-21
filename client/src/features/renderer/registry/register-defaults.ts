import { register } from './component-registry'
import {
  PageContainer,
  Box,
  Grid,
  Flex,
  Section,
  Columns,
  WindowComponent,
} from '../components/layout-components'
import {
  Text,
  ImageComponent,
  LinkComponent,
  ButtonComponent,
  ProgressBar,
  Badge,
} from '../components/content-components'
import { ListRepeater } from '../components/list-repeater'

let registered = false

export function registerDefaults() {
  if (registered) return
  registered = true

  // Layout components
  register('page', PageContainer)
  register('box', Box)
  register('grid', Grid)
  register('flex', Flex)
  register('section', Section)
  register('columns', Columns)
  register('window', WindowComponent)

  // Content components
  register('text', Text)
  register('image', ImageComponent)
  register('link', LinkComponent)
  register('button', ButtonComponent)
  register('list', ListRepeater)
  register('progress-bar', ProgressBar)
  register('badge', Badge)
}
