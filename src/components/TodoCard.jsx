import React, { useState } from 'react'

const STATUS_CONFIG = {
  'todo': { icon: 'fa-regular fa-circle', label: 'To Do', colorVar: 'var(--color-todo)' },
  'in-progress': { icon: 'fa-solid fa-circle-half-stroke', label: 'In Progress', colorVar: 'var(--color-in-progress)' },
  'done': { icon: 'fa-solid fa-circle-check', label: 'Done', colorVar: 'var(--color-done)' },
}

export default function TodoCard(props) {
  const { children, handleDeleteTodos, index, handleCycleStatus, handleSaveEdit, todos } = props
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState('')
  const todo = todos[index]
  const statusInfo = STATUS_CONFIG[todo.status] || STATUS_CONFIG['todo']

  function startEditing() {
    setEditText(todo.text)
    setIsEditing(true)
  }

  function saveEdit() {
    if (editText.trim()) {
      handleSaveEdit(index, editText)
      setIsEditing(false)
    }
  }

  function cancelEdit() {
    setIsEditing(false)
  }

  return (
    <li className={`todoItem todoStatus-${todo.status}`}>
      <div className="statusIndicator" style={{ background: statusInfo.colorVar }}></div>
      {isEditing ? (
        <div className="editContainer">
          <input
            className="editInput"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit()
              if (e.key === 'Escape') cancelEdit()
            }}
            autoFocus
          />
          <div className="actionsContainer">
            <button onClick={saveEdit} title="Save">
              <i className="fa-solid fa-check"></i>
            </button>
            <button onClick={cancelEdit} title="Cancel">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      ) : (
        <>
          <button
            className="checkBtn"
            onClick={() => handleCycleStatus(index)}
            title={`Status: ${statusInfo.label} (click to change)`}
            style={{ color: statusInfo.colorVar }}
          >
            <i className={statusInfo.icon}></i>
          </button>
          <div className="todoContent">
            {children}
            <span className="statusBadge" style={{ background: statusInfo.colorVar }}>
              {statusInfo.label}
            </span>
          </div>
          <div className="actionsContainer">
            <button onClick={startEditing} title="Edit">
              <i className="fa-regular fa-pen-to-square"></i>
            </button>
            <button onClick={() => handleDeleteTodos(index)} title="Delete">
              <i className="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </>
      )}
    </li>
  )
}
