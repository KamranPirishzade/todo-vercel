import React, { useState } from 'react'
import TodoItem from '../TodoItem/TodoItem.functional'
import { Todo, SortType } from '../../types'

const SORT_OPTIONS: { value: SortType; label: string }[] = [
  { value: 'alphabetical', label: 'A → Z' },
  { value: 'status', label: 'Active first' },
]

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (id: number, text: string) => void
}

function TodoList({ todos, onToggle, onDelete, onEdit }: TodoListProps) {
  const [sortBy, setSortBy] = useState<SortType>('alphabetical')

  const getSortedTodos = (): Todo[] => {
    if (sortBy === 'status') {
      return [...todos].sort((a, b) => Number(a.completed) - Number(b.completed))
    }
    return [...todos].sort((a, b) => a.text.localeCompare(b.text))
  }

  const sortedTodos = getSortedTodos()

  return (
    <div className="todo-list-wrapper">
      <div className="todo-list__toolbar">
        <span className="todo-list__sort-label">Sort:</span>
        {SORT_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            className={`todo-list__sort-btn${sortBy === value ? ' todo-list__sort-btn--active' : ''}`}
            onClick={() => setSortBy(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {sortedTodos.length === 0 ? (
        <p className="todo-list__empty">No tasks here.</p>
      ) : (
        <ul className="todo-list">
          {sortedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

export default TodoList
