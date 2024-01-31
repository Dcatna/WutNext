import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { unsubscribe } from 'diagnostics_channel';

export async function signIn(email : string, password : string) {
    const { data,error } = await supabase.auth.signInWithPassword({
        email:email,
        password:password
    })
    return {data, error}
}

export async function signOut() {
    return supabase.auth.signOut()
}


export function useSubscription(){ //session
    const [session, setSession] = useState<Session | null>()
    async function initSes() {
        const {data, error} = await supabase.auth.getSession()
        setSession(data.session)
    }
    useEffect(() => {
        initSes()
        const subscription = supabase.auth.onAuthStateChange((event, session) => {
            console.log(event, session)
            setSession(session)

        })
        return () =>{
           subscription.data.subscription.unsubscribe()
        }
    }, [])
    return session
}
  // call unsubscribe to remove the callback
