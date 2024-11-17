import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

function App() {
  const [count, setCount] = useState(0)

  axios.post("api/v1/users/login",{
    userName:"user1",
    email:"user1@gmail.com",
    password:"user1"
  }).then((res)=>{
console.log(res.data)
  }).catch((errr)=>{
console.log(errr)
  })

  axios.get("api/v1/users/current-user").then((res)=>{
console.log(res.data)
  }).catch((errr)=>{
console.log(errr)
  })

  return (
    <>
      <h1>hello</h1>
    </>
  )
}

export default App
