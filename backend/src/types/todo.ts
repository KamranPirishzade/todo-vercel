export const FILTER_VALUES = ['all', 'active', 'completed'] as const
export type FilterType = (typeof FILTER_VALUES)[number]

export const SORT_VALUES = ['alphabetical', 'status'] as const
export type SortType = (typeof SORT_VALUES)[number]

export interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}
