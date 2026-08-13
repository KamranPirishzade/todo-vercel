import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoList from './TodoList.functional'
import { Todo } from '../types'

// EXERCISE: Fill in each test body using render, screen, and userEvent
// Props: todos: Todo[], onToggle, onDelete, onEdit — callbacks by id

const todos: Todo[] = [
  { id: 1, text: 'Zebra task', completed: false },
  { id: 2, text: 'Apple task', completed: true },
  { id: 3, text: 'Mango task', completed: false },
]

describe('TodoList', () => {
  it('shows empty message when no todos', () => {
    // TODO: render <TodoList todos={[]} ... />
    // TODO: assert 'No tasks here.' is in the document
  })

  it('renders all todos', () => {
    // TODO: render TodoList with todos
    // TODO: assert all three todo texts are visible
  })

  it('sorts alphabetically by default', () => {
    // TODO: render TodoList with todos
    // TODO: get all listitems
    // TODO: assert order: Apple task → Mango task → Zebra task
  })

  it('sorts active-first after clicking "Active first"', async () => {
    const user = userEvent.setup()
    // TODO: render TodoList
    // TODO: click 'Active first' button
    // TODO: assert first listitem does NOT have class 'todo-item--completed'
    // TODO: assert last listitem HAS class 'todo-item--completed'
  })

  it('marks the active sort button', () => {
    // TODO: render TodoList
    // TODO: assert 'A → Z' button has class 'todo-list__sort-btn--active'
  })

  it('switches active sort button on click', async () => {
    const user = userEvent.setup()
    // TODO: render TodoList
    // TODO: click 'Active first'
    // TODO: assert 'Active first' has active class, 'A → Z' does not
  })

  it('passes onToggle/onDelete down to TodoItem', async () => {
    const user = userEvent.setup()
    // TODO: render TodoList with mock onToggle and onDelete
    // TODO: click the first checkbox → assert onToggle was called
    // TODO: click the first ✕ button → assert onDelete was called
  })
})
