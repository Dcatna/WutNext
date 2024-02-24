import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import {useForm} from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient'
import { CurrentUserContext } from '../../App'

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const client = useContext(CurrentUserContext)
  
  const{register, handleSubmit, formState: { errors }} = useForm<IFormInput>({
      resolver:yupResolver(schema),
    });
async function addUser(formData : IFormInput){
  try{
    const {data, error} = await supabase.from("users").insert([{
      user_id: client?.user.id,
      email: formData.email,
      username: formData.email.slice(0, formData.email.indexOf("@")),
    }])
  }catch(error) {
    console.log(error)
  }
}
async function submitForm (formData : IFormInput) {
  setIsSubmitting(true);
  console.log(formData.email, formData.password)
  try{
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
  
    });
    addUser(formData)
    navigate("/")
  }
 catch (error) {
  if (error instanceof Error) {
    alert(error.message); // Displaying the actual error message
  } else {
    console.error('An unknown error occurred:', error);
  }
} finally {
  setIsSubmitting(false);
}
}
  return (
    <div className='main'>
    <div className='main-container'>
        <div className='content-container'>
            <h1>Sign UP!</h1>
            <p>Please enter you user and password</p>
            <form onSubmit={handleSubmit(submitForm)} className='inputs'>
                <input type="email" placeholder='Email' style={{
                    width:'70%',
                    height:'30px',
                }} {...register('email')}/>
                <p>{errors.email?.message}</p>
                <input type="password" placeholder='Password' style={{
                    width:'70%',
                    height:'30px',
                    marginTop:'6px'
                }} {...register('password')}/>
                <p>{errors.password?.message}</p>
                <button type = "submit"style={{
                width:'70%',
                height:'40px',
                backgroundColor:'#8b5cf6',
                border:'none',
                borderRadius:'4px',
    
            }} disabled={isSubmitting}>Sign Up</button>
            </form>
            <p>By signing up you agree to terms and conditions;)</p>
            
            <div className='create-account' style={{
                marginTop:'20px',
            }}>
                <Link to="/">Back to Home</Link>
            </div>
        </div>
    </div>
    </div>
  )
}


export default Signup