
import React, { useState } from 'react'
import {useForm} from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient'
import Navbar from '../Navbar/Navbar'
interface IFormInput {
    email: string;
    password: string;
  }

const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(6).max(15).required()
})

const Loginbox = () => {
    const [isJiggling, setIsJiggling] = useState(false);
    const navigate = useNavigate();
    //console.log("IMEHERERERER")
    const handleButtonClick = () => {
        setIsJiggling(true);
        setTimeout(() => setIsJiggling(false), 500); // 500ms is the duration of the animation
      };
    

    const{register,handleSubmit,formState: { errors }} = useForm<IFormInput>({
        resolver:yupResolver(schema),
      });

    function showAlertAfterAnimation(message : string) {
        setTimeout(() => {
            alert(message);
        }, 100);
    }
async function submitForm (formData : IFormInput) {
    try {
        const { data,error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        
        if (error) {
          throw error;
        }
    
        if (data.user) {
          // Use the 'data.user' object as needed
          console.log(data.session)
          
        }
        navigate("/")
      } catch (error) {
        handleButtonClick()
        if (error instanceof Error) {  // Type guard
            showAlertAfterAnimation(error.message)
            
          } else {
            // Handle cases where error is not an instance of Error
            handleButtonClick()
            console.error("An unknown error occurred", error);
          }
      }
        }

  return (
    <body className='overflow-x-hidden'>
    <div>
      <Navbar></Navbar>
    <div className="flex items-center justify-center h-screen">
    
    <div className="p-10 bg-white rounded shadow-md w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4 text-black">Sign In!</h1>
        <p className="mb-8 text-black">Please enter your user and password</p>
        <form className="space-y-6" onSubmit={handleSubmit(submitForm)}>
            <input type="text" placeholder="Email" {...register('email')} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600 text-black"/>
            <p className='text-black'>{errors.email?.message}</p>
            <input type="password" placeholder="Password" {...register('password')} className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-600 text-black"/>
            <p className='text-black'>{errors.password?.message}</p>
            <button type="submit" className="w-full py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:bg-purple-700">Login</button>
        </form>
        <p className="mt-8 text-center text-black">By logging in you agree to terms and conditions;)</p>
        <div className="mt-4 text-center text-black">
            <p>Don't have an account yet?</p>
            <a href="/signup" className="text-purple-600 hover:underline">Create Account</a>
        </div>
    </div>
</div>
</div>
</body>
  )
}

export default Loginbox

