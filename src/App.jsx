import { useState, useEffect } from "react"
import TodoInput from "./components/TodoInput"
import TodoList from "./components/TodoList"

function App() {
  /*let todos = [
    'finish course 1',
    'Train ',
    'Cooking meals'
  ]*/


  const [todos, setTodos] = useState([])
  const [todoValue, setTodoValue] = useState('')


  function persistData(newList){
    localStorage.setItem('todos', JSON.stringify({todos: newList}))
  }


  function handleAddTodos(newTodo){
    const newTodoList = [...todos, newTodo]
    persistData(newTodoList)
    setTodos(newTodoList)
  }

  function handleDeleteTodos(id){
    const newTodoList = todos.filter((todo, todoIndex)=> {
      return todoIndex !== id
    })
    persistData(newTodoList)
    setTodos(newTodoList)
  }

  function handleEditTodos(id){
    const valuetobeEdited = todos[id]
    setTodoValue(valuetobeEdited)
    handleDeleteTodos(index)
  }

  useEffect(() => {
    if(!localStorage){
      return
    }
    let localTodos = localStorage.getItem("todos")
    if(!localTodos){
      return

    }
    localTodos = JSON.parse(localTodos).todos
    setTodos(localTodos)
  }, []);
  return (
    <>
      <TodoInput todoValue={todoValue} handleAddTodos={handleAddTodos} setTodoValue={setTodoValue}/>
      <TodoList handleDeleteTodos={handleDeleteTodos} todos={todos} handleEditTodos={handleEditTodos} />
    </>  
  )
}

export default App
