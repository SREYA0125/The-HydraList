import { useState } from 'react'
import './App.css'
import TaskBlock from './components/TaskBlock'
import Button from './components/Button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Button />
        <TaskBlock />
      </div>
    </>
  )
}
export default App
