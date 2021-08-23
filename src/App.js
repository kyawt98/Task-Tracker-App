import Header from "./components/Header";
import Footer from "./components/Footer";
import Tasks from './components/Tasks';
import { useState, useEffect } from "react"
import AddTask from "./components/AddTask";
import About from "./components/About";
import { BrowserRouter as Router, Route} from 'react-router-dom'

const App = () => {

  const [showAddTask, setShowAddTask] = useState(false)

  // state of tasks
  const [tasks, setTasks] = useState([])

  // Fetch Tasksss from server
  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks()
  }, [])

  // Fetch tasks
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()

    // console.log(data);
    return data
  }

  // Fetch task
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()

    // console.log(data);
    return data
  }

// Add Task
const addTask = async (task) => {
  // // console.log(task);
  // const id = Math.floor(Math.random() * 10000) + 1
  // // console.log(id);
  // const newTask = { id, ...task }
  // setTasks([...tasks, newTask])

  const res = await fetch('http://localhost:5000/tasks', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(task)
  })

  const data = await res.json()

  setTasks([...tasks, data])
}

// Delete Task
const deleteTask = async (id) => {
  await fetch(`http://localhost:5000/tasks/${id}`, {
    method: 'DELETE'
  })
  setTasks(tasks.filter((task) => task.id !== id))
}

// Toggle Reminder
const toggleReminder = async (id) => {
  const taskToToggle = await fetchTask(id)
  const updateTask = { ...taskToToggle,
  reminder: !taskToToggle.reminder }

  const res = await fetch(`http://localhost:5000/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(updateTask)
  })

  const data = await res.json()

  setTasks(tasks.map((task) => task.id === id ? {...task, reminder: data.reminder} : task))
}


  return (
    <Router>
      <div className="container">
      <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask}/>
      <Route path='/about' component={About} />
      <Route path='/' exact render={(props) => (
        <>
          {showAddTask && <AddTask onAdd={addTask} />}

          {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} /> : 'No tasks to show'}
        </>
      )} />
      <Footer />
      </div>
    </Router>

  );
}

export default App;
