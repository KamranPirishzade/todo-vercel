import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoFilter from './TodoFilter.functional'

// EXERCISE: Fill in each test body using render, screen, and userEvent
// Props: currentFilter: FilterType, onFilterChange: (filter: FilterType) => void

describe('TodoFilter', () => {
  it('renders toggle button', () => {
    // TODO: render <TodoFilter currentFilter="all" onFilterChange={vi.fn()} />
    // TODO: assert a button matching /filter/i is in the document
  })

  it('shows filter buttons when open by default', () => {
    // TODO: render TodoFilter
    // TODO: assert buttons 'All', 'Active', 'Completed' are visible
  })

  it('hides filter buttons after clicking toggle', async () => {
    const user = userEvent.setup()
    // TODO: render TodoFilter
    // TODO: click the toggle button
    // TODO: assert the 'All' button is NOT in the document
  })

  it('shows filter buttons again after second toggle click', async () => {
    const user = userEvent.setup()
    // TODO: render TodoFilter
    // TODO: click toggle twice
    // TODO: assert 'All' button is visible again
  })

  it('calls onFilterChange with correct value', async () => {
    const user = userEvent.setup()
    // TODO: render TodoFilter with a mock onFilterChange
    // TODO: click 'Active' → assert called with 'active'
    // TODO: click 'Completed' → assert called with 'completed'
  })

  it('marks active filter button with active class', () => {
    // TODO: render <TodoFilter currentFilter="active" ... />
    // TODO: assert 'Active' button has class 'todo-filter__btn--active'
    // TODO: assert 'All' button does NOT have that class
  })
})
