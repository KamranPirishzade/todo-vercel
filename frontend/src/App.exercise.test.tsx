import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App.functional'

// EXERCISE: Fill in each test body using render, screen, and userEvent
// App manages its own state — no props needed, just render <App />

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the title', () => {
    // TODO: render <App />
    // TODO: assert 'todos' heading is in the document
  })

  it('footer is hidden when there are no todos', () => {
    // TODO: render <App />
    // TODO: assert there is no text matching /items left/i
  })

  it('adds a todo and shows it in the list', async () => {
    const user = userEvent.setup()
    // TODO: render <App />
    // TODO: type 'Buy milk' into the textbox and click 'Add'
    // TODO: assert 'Buy milk' appears in the document
  })

  it('shows item count in footer after adding', async () => {
    const user = userEvent.setup()
    // TODO: add one todo
    // TODO: assert '1 item left' is visible
  })

  it('uses plural "items" for multiple todos', async () => {
    const user = userEvent.setup()
    // TODO: add two todos
    // TODO: assert '2 items left' is visible
  })

  it('toggles a todo via checkbox', async () => {
    const user = userEvent.setup()
    // TODO: add one todo
    // TODO: click the checkbox
    // TODO: assert '0 items left' is visible
  })

  it('deletes a todo', async () => {
    const user = userEvent.setup()
    // TODO: add 'To delete'
    // TODO: click the ✕ button
    // TODO: assert 'To delete' is no longer in the document
  })

  it('"Clear completed" removes completed todos', async () => {
    const user = userEvent.setup()
    // TODO: add 'Done', toggle its checkbox, click 'Clear completed'
    // TODO: assert 'Done' is no longer in the document
  })

  it('"Clear completed" is disabled when nothing is completed', async () => {
    const user = userEvent.setup()
    // TODO: add an active todo
    // TODO: assert the 'Clear completed' button is disabled
  })

  it('filter "Active" hides completed todos', async () => {
    const user = userEvent.setup()
    // TODO: add 'Pending task' and 'Finished task'
    // TODO: toggle the first checkbox (alphabetically 'Finished task')
    // TODO: click the 'Active' filter button
    // TODO: assert 'Pending task' is visible, 'Finished task' is not
  })

  it('persists a new todo through the API', async () => {
    const user = userEvent.setup()
    // TODO: add 'Persist me'
    // TODO: assert 'Persist me' is in the document (it now comes back from the backend, not localStorage)
  })
})
