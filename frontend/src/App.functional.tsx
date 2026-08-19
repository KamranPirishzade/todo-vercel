import React from 'react'
import AddTodo from './components/AddTodo/AddTodo.functional'
import TodoList from './components/TodoList/TodoList.functional'
import TodoFilter from './components/TodoFilter/TodoFilter.functional'
import useTodos from './hooks/useTodos'
import './App.css'

const environment = import.meta.env.VITE_VERCEL_ENV ?? 'local'

function App() {
  const {
    todos,
    filteredTodos,
    activeCount,
    filter,
    setFilter,
    sort,
    setSort,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    loading,
    error,
  } = useTodos()

  return (
    <div className="app">
      <span className={`env-badge env-badge--${environment}`}>{environment}</span>

      <header className="app__header">
        <h1 className="app__title">todos</h1>
      </header>

      <main className="app__main">
        <AddTodo onAdd={addTodo} />

        {error && <p className="app__error">{error}</p>}
        {loading && <p className="app__loading">Loading todos...</p>}

        <TodoList
          todos={filteredTodos}
          sortBy={sort}
          onSortChange={setSort}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
        />

        {todos.length > 0 && (
          <footer className="app__footer">
            <span className="app__count">
              {activeCount} item{activeCount !== 1 ? 's' : ''} left
            </span>
            <TodoFilter currentFilter={filter} onFilterChange={setFilter} />
            <button
              className="app__clear-btn"
              onClick={clearCompleted}
              disabled={activeCount === todos.length}
            >
              Clear completed
            </button>
          </footer>
        )}
      </main>
    </div>
  )
}

export default App
