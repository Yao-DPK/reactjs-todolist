import React from 'react'
import TodoCard from './TodoCard'

export default function TodoList(props) {
  const { filteredTodos } = props

  return (
    <ul className='main'>
      {filteredTodos.map((todo, todoIndex) => {
        // Find the real index in the full todos array
        const realIndex = props.todos.indexOf(todo)
        return (
          <TodoCard {...props} key={realIndex} index={realIndex}>
            <p className={todo.status === 'done' ? 'completed' : ''}>{todo.text}</p>
          </TodoCard>
        )
      })}
    </ul>
  )
}
