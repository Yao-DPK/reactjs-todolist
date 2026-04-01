import { useState, useEffect } from "react"
import TodoInput from "./components/TodoInput"
import TodoList from "./components/TodoList"

const FILTERS = ['all', 'todo', 'in-progress', 'done']
const FILTER_LABELS = { all: 'All', todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' }
const FILTER_COLORS = { todo: 'var(--color-todo)', 'in-progress': 'var(--color-in-progress)', done: 'var(--color-done)' }

function App() {
  const [todos, setTodos] = useState([])
  const [todoValue, setTodoValue] = useState('')
  const [filter, setFilter] = useState('all')
  const [theme, setTheme] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('theme') || 'light'
    }
    return 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  function persistData(newList) {
    localStorage.setItem('todos', JSON.stringify({ todos: newList }))
  }

  function handleAddTodos(newTodo) {
    if (!newTodo.trim()) return
    const newTodoList = [...todos, { text: newTodo.trim(), status: 'todo' }]
    persistData(newTodoList)
    setTodos(newTodoList)
  }

  function handleDeleteTodos(id) {
    const newTodoList = todos.filter((_, todoIndex) => todoIndex !== id)
    persistData(newTodoList)
    setTodos(newTodoList)
  }

  function handleEditTodos(id) {
    const valueToBeEdited = todos[id]
    setTodoValue(valueToBeEdited.text)
    handleDeleteTodos(id)
  }

  function handleCycleStatus(id) {
    const statusOrder = ['todo', 'in-progress', 'done']
    const newTodoList = todos.map((todo, index) => {
      if (index !== id) return todo
      const currentIdx = statusOrder.indexOf(todo.status)
      const nextStatus = statusOrder[(currentIdx + 1) % statusOrder.length]
      return { ...todo, status: nextStatus }
    })
    persistData(newTodoList)
    setTodos(newTodoList)
  }

  function handleSaveEdit(id, newText) {
    if (!newText.trim()) return
    const newTodoList = todos.map((todo, index) =>
      index === id ? { ...todo, text: newText.trim() } : todo
    )
    persistData(newTodoList)
    setTodos(newTodoList)
  }

  useEffect(() => {
    if (!localStorage) return
    let localTodos = localStorage.getItem("todos")
    if (!localTodos) return

    let parsed = JSON.parse(localTodos).todos
    // Migrate old formats
    let needsSave = false
    parsed = parsed.map(item => {
      if (typeof item === 'string') {
        needsSave = true
        return { text: item, status: 'todo' }
      }
      if (item.completed !== undefined && item.status === undefined) {
        needsSave = true
        return { text: item.text, status: item.completed ? 'done' : 'todo' }
      }
      return item
    })
    if (needsSave) persistData(parsed)
    setTodos(parsed)
  }, [])

  const counts = {
    todo: todos.filter(t => t.status === 'todo').length,
    'in-progress': todos.filter(t => t.status === 'in-progress').length,
    done: todos.filter(t => t.status === 'done').length,
  }

  const filteredTodos = filter === 'all'
    ? todos
    : todos.filter(t => t.status === filter)

  return (
    <div className="appContainer">
      <div className="topBar">
        <h1 className="appTitle">QTodoApp</h1>
        <button
          className="themeToggle"
          onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          aria-label="Toggle theme"
        >
          <i className={theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun'}></i>
        </button>
      </div>

      <TodoInput
        todoValue={todoValue}
        handleAddTodos={handleAddTodos}
        setTodoValue={setTodoValue}
      />

      {todos.length > 0 && (
        <div className="filterBar">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`filterBtn${filter === f ? ' filterActive' : ''}`}
              onClick={() => setFilter(f)}
              style={filter === f && f !== 'all' ? { '--active-color': FILTER_COLORS[f] } : {}}
            >
              {FILTER_LABELS[f]}
              {f !== 'all' && <span className="filterCount" style={{ background: FILTER_COLORS[f] }}>{counts[f]}</span>}
              {f === 'all' && <span className="filterCount filterCountAll">{todos.length}</span>}
            </button>
          ))}
        </div>
      )}

      <TodoList
        handleDeleteTodos={handleDeleteTodos}
        todos={todos}
        filteredTodos={filteredTodos}
        handleEditTodos={handleEditTodos}
        handleCycleStatus={handleCycleStatus}
        handleSaveEdit={handleSaveEdit}
      />

      {filteredTodos.length === 0 && todos.length > 0 && (
        <p className="emptyMessage">No {FILTER_LABELS[filter].toLowerCase()} tasks</p>
      )}
      {todos.length === 0 && (
        <p className="emptyMessage">Add your first task above!</p>
      )}
    </div>
  )
}

export default App
