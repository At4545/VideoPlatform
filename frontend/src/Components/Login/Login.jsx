import React from 'react'
import Input from '../Input/Input.jsx'
import logo from "../../assets/logo.png"
import Button from '../Button/Button.jsx'
import { useForm } from "react-hook-form"
import AuthService from '../../Apis/auth.jsx'
import { useState } from 'react'
import {login} from "../../redux/authSlice.jsx"
import {useDispatch} from "react-redux"
import { useNavigate } from 'react-router-dom'
//validation need to be done 
//show error on screen
//could show a model after a success full login

function Login() {
  const [error, seterror] = useState(null)
  const dispatch= useDispatch()
  const navigate= useNavigate()

    const { register, handleSubmit } = useForm()
    const onSubmit = async(data) => {
       const isEmail = data?.cred?.includes("@")
       let user
       if(isEmail && data){
        user  = await AuthService.login({userName:"",email:data.cred,password:data.password})
       }
       else if (!isEmail && data ){
        user  = await AuthService.login({userName:data.cred,email:"",password:data.password})
       }

       if(user.status<299){
        console.log(user.data.data)
        //put data into redux toolkit and remove password
        if(user.data.data){
          dispatch(login(user.data.data))
          navigate("/")
        }
       }
       else if(user.status<= 400){
        seterror("check you username/email or password")
       }
       else{
        seterror("server error")
       }
    }

  return (
    <div>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        alt="Your Company"
        src={logo}
        className="mx-auto h-16 w-auto"
      />
      <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
        Sign in to your account
      </h2>
    </div>

    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {error && <p className='text-xs text-violet-500'>{error}</p>}
        {/* form start here  */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="cred" className="block text-sm/6 font-medium text-gray-900">
            Email address
          </label>
          <div className="mt-2">
            <Input name='cred' type='text' placeholder="enter your username or email" required='true'{...register("cred",{required:"Enter valid email or username"})}></Input>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
              Password
            </label>
            <div className="text-sm">
              <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </a>
            </div>
          </div>
          <div className="mt-2">
           <Input name='password' type='password' placeholder="Enter password" required='true'{...register("password",{required:"please enter valid password"})}></Input>
          </div>
        </div>

        <div>
          <Button type='submit'>Sign In</Button>
        </div>
      </form>

      <p className="mt-10 text-center text-sm/6 text-gray-500">
        Not a member?{' '}
        <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Start a 14 day free trial
        </a>
      </p>
    </div>
  </div>
  </div>
  )
}

export default Login