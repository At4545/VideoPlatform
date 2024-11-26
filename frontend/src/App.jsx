import './App.css'
import AuthService from './auth/auth'
import { Outlet } from 'react-router-dom'
import {Header} from "./Components/index.js"

function App() {
 

  return (
    <div >
      <Header/>
      <Outlet></Outlet>
     
    </div>
  )
}

export default App
