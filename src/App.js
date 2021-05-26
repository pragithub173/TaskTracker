import Header from "./components/Header"
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import Footer from './components/Footer'
import About from './components/About'
import {useState, useEffect} from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'



function App() {
  //const name = 'Pradeep'

  const [showAddTask, setShowAddTask] = useState(false)

  const [tasks, setTasks] = useState([ ])

  useEffect(()=>{
    const getTasks = async () =>{
      const taskFormServer = await fetchTasks()
      setTasks(taskFormServer)
    }
    

    getTasks()
  }, [])

  //fecth tasks
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()
    return data

  }

  //fecth task
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()
    return data

  }

//// add task 

const addTask = async(task) =>{
  const res = await fetch('http://localhost:5000/tasks',{
    method:'POST',
    headers: {
      'Content-type':'application/json',
    },
    body: JSON.stringify(task),
  })

  const data = await res.json()

  setTasks([...tasks, data])
  // const id = Math.floor(Math.random()*10000)+1

  // const newTask = {id, ...task}

  // setTasks([...tasks, newTask])


}



//Delete Task
const deleteTask = async (id) => {
  //console.log('delete', id)
  await fetch(`http://localhost:5000/tasks/${id}`, {method: 'DELETE',})
  setTasks(tasks.filter((task)=> task.id !== id))
} //delete task who's id matched with the id clicked, we r not shoing the id which is clicked by filtering

//toogle reminder
const toogleReminder = async (id) => {
  const taskToToggle = await fetchTask(id)
  const updateTask = {...taskToToggle, reminder: !taskToToggle.reminder}

  const res = await fetch(`http://localhost:5000/tasks/${id}`,{
    method:'PUT',
    headers: {
      'Content-type':'application/json',
    },
    body: JSON.stringify(updateTask),
  })

  const data = await res.json()

  setTasks(tasks.map((task)=> task.id === id? {...task, reminder: data.reminder } : task))
} //if id then change the reminder or display task


  return (
    <Router>
      <div className="container">
        <Header onAdd={()=> setShowAddTask(!showAddTask) } showAdd={showAddTask}/>
        {/* <Header /> ssecond header*/}
        <Route path='/' exact render = {(props)=>(
          <>
            {showAddTask && <AddTask onAdd ={addTask}/> }
        
        {/* <Tasks tasks={tasks} onDelete={deleteTask}/> */}

        {tasks.length > 0? <Tasks tasks={tasks} onDelete={deleteTask} onToogle ={toogleReminder}/> : 'No Task to show'}

          </>
        )}/>
        <Route path='/about' component={About}/>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
