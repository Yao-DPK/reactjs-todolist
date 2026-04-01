import React from 'react'

export default function TodoInput(props) {
  const { handleAddTodos, todoValue, setTodoValue } = props

  function handleSubmit() {
    if (!todoValue.trim()) return
    handleAddTodos(todoValue)
    setTodoValue('')
  }

  return (
    <header>
      <input
        value={todoValue}
        onChange={(e) => setTodoValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit() }}
        placeholder="Enter todo..."
      />
      <button onClick={handleSubmit}>Add</button>
    </header>
  )
}
