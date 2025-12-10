export interface TrashItem {
  id: string
  name: string
  type: string
  dateDeleted?: string
  reason?: string
}

export interface TrashData {
  items: TrashItem[]
}
