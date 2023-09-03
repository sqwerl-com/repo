import { ReactNode } from 'react'

export interface Item {
  childIndex: number
  children: ReactNode
  childrenCount: number
  description: string
  id: string
  isLoading: boolean
  name: string
  path: string
  shortDescription: string
  showTypeName?: boolean,
  startOffset: number,
  typeName?: string
}
