import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoItem from './TodoItem.functional'
import { Todo } from '../types'

// EXERCISE: Fill in each test body using render, screen, and userEvent
// Props: todo: Todo, onToggle, onDelete, onEdit — all (id: number) => void

const todo: Todo = { id: 1, text: 'Buy milk', completed: false }
const completedTodo: Todo = { id: 2, text: 'Done task', completed: true }

describe('TodoItem', () => {
  it('renders todo text', () => {
    // TODO: render <TodoItem todo={todo} ... />
    // TODO: assert 'Buy milk' is in the document
  })

  it('renders unchecked checkbox for incomplete todo', () => {
    // TODO: render TodoItem with todo (completed: false)
    // TODO: assert the checkbox is NOT checked
  })

  it('renders checked checkbox for completed todo', () => {
    // TODO: render TodoItem with completedTodo (completed: true)
    // TODO: assert the checkbox IS checked
  })

  it('adds completed class for completed todo', () => {
    // TODO: render TodoItem with completedTodo
    // TODO: assert the listitem has class 'todo-item--completed'
  })

  it('calls onToggle with id when checkbox clicked', async () => {
    const user = userEvent.setup()
    // TODO: render TodoItem with a mock onToggle
    // TODO: click the checkbox
    // TODO: assert onToggle was called with todo.id (1)
  })

  it('calls onDelete with id when delete button clicked', async () => {
    const user = userEvent.setup()
    // TODO: render TodoItem with a mock onDelete
    // TODO: click the delete button (✕)
    // TODO: assert onDelete was called with todo.id (1)
  })

  it('shows edit input on double-click', async () => {
    const user = userEvent.setup()
    // TODO: render TodoItem
    // TODO: double-click the text span 'Buy milk'
    // TODO: assert a textbox appears with value 'Buy milk'
  })

  it('calls onEdit and exits edit mode on Enter', async () => {
    const user = userEvent.setup()
    // TODO: render TodoItem with a mock onEdit
    // TODO: double-click the text to enter edit mode
    // TODO: clear the input and type 'New text{Enter}'
    // TODO: assert onEdit was called with (1, 'New text')
    // TODO: assert the textbox is gone
  })

  it('cancels edit on Escape without calling onEdit', async () => {
    const user = userEvent.setup()
    // TODO: render TodoItem with a mock onEdit
    // TODO: double-click to enter edit mode
    // TODO: press Escape
    // TODO: assert onEdit was NOT called
    // TODO: assert the textbox is gone
  })

  it('calls onEdit and exits edit mode on blur', async () => {
    const user = userEvent.setup()
    // TODO: render TodoItem with a mock onEdit
    // TODO: double-click to enter edit mode
    // TODO: clear + type 'Blurred', then tab away
    // TODO: assert onEdit was called with (1, 'Blurred')
  })
})
