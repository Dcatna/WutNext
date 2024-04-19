import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import {useForm} from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient'
import { CurrentUserContext } from '../../App'
import Navbar from '../Navbar/Navbar'

interface IFormInput {
    email: string;
    password: string;
  }

const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(3).max(15).required()
})
const Signup = () => {
  const navigate = useNavigate();
 // const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const client = useContext(CurrentUserContext)
  
  const{register, handleSubmit, formState: { errors }} = useForm<IFormInput>({
      resolver:yupResolver(schema),
    });


async function submitForm (formData : IFormInput) {
  setIsSubmitting(true);
  console.log(formData.email, formData.password)
  try{
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
  
    });
    if (data.user) {
      // Add additional user info to your custom 'users' table
      const { error: insertError } = await supabase.from("users").insert([{
        user_id: data.user.id, // Use the ID from the signed-up user
        email: formData.email,
        username: formData.email.slice(0, formData.email.indexOf("@")),
      }]);

      if (insertError) throw insertError
    navigate("/")
  }
  }
 catch (error) {
  if (error instanceof Error) {
    alert(error.message)
  } else {
    console.error('An unknown error occurred:', error)
  }
} finally {
  setIsSubmitting(false)
}
}
  return (
    <body className='overflow-x-hidden'>
      <Navbar></Navbar>
      <div className="flex items-center justify-center h-screen">
        <div className="p-10 bg-white rounded shadow-md w-full max-w-sm">
          <h1 className="text-xl font-bold mb-4 text-black">Sign Up!</h1>
          <p className="mb-8 text-black">Please enter your user and password</p>
          <form className="space-y-6" onSubmit={handleSubmit(submitForm)}>
            <input type="email" placeholder='Email' {...register('email')} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600 text-black"/>
            <p className='text-black'>{errors.email?.message}</p>
            <input type="password" placeholder='Password' {...register('password')} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600 text-black"/>
            <p className='text-black'>{errors.password?.message}</p>
            <button type="submit" className="w-full py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:bg-purple-700" disabled={isSubmitting}>Sign Up</button>
          </form>
          <p className="mt-8 text-center text-black">By signing up you agree to our terms and conditions;)</p>
          <div className="mt-4 text-center text-purple-600 hover:underline">
            <a href='/'>Back to Home</a>
          </div>
        </div>
      </div>
  </body>

  )
}


export default Signup