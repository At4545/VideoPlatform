import './App.css'
import AuthService from './Apis/auth.jsx'
import { Outlet } from 'react-router-dom'
import {Header} from "./Components/index.js"

function App() {
 

  return (
    <div >
      <div className='fixed top-0 left-0 w-full'>
      <Header />
      </div>
      <main className='pt-24'>
      <Outlet></Outlet>
      </main>
     
    </div>
  )
}

export default App
