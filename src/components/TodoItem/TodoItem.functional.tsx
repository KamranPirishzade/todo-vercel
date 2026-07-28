import React from 'react'
import { Todo } from '../../types'
import useTodoEdit from '../../hooks/useTodoEdit'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (id: number, text: string) => void
}

function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const {
    isEditing,
    editValue,
    inputRef,
    startEditing,
    submitEdit,
    handleChange,
    handleKeyDown,
  } = useTodoEdit(todo.text, onEdit, todo.id)

  return (
    <li className={`todo-item${todo.completed ? ' todo-item--completed' : ''}`}>
      <input
        className="todo-item__checkbox"
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />

      {isEditing ? (
        <input
          ref={inputRef}
          className="todo-item__edit-input"
          type="text"
          value={editValue}
          onChange={handleChange}
          onBlur={submitEdit}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span
          className="todo-item__text"
          onDoubleClick={startEditing}
          title="Double-click to edit"
        >
          {todo.text}
        </span>
      )}

      <button className="todo-item__delete-btn" onClick={() => onDelete(todo.id)}>
        ✕
      </button>
    </li>
  )
}

export default TodoItem
