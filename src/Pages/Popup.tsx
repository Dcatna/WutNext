import React, {useContext, useRef, useState} from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { supabase } from '../lib/supabaseClient';
import { Button } from '../Components/Button';
import { CurrentUserContext } from '../App';
import "./rand.css"
const Pop = () => {
    const [name, setName] = useState("");
    const client = useContext(CurrentUserContext)

    const handleSubmit = async (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent the default form submission behavior
        console.log(client?.user.id)
        const { data, error } = await supabase.from("userlist").insert([
            { 'name': name,
              'user_id' :  client?.user.id}]);
        if (error) {
            console.error(error);
        } else {
            console.log('Inserted:', data);
            setName(''); // Reset name field
        }
    };

    return (
        <Popup modal nested contentStyle={{ width: '400px', margin: 'auto' }} trigger={<Button className='w-full h-[50px] rounded-md bg-button-blue'>Create List</Button>}>
            <div className=''>
                <div className='flex justify-center items-center'>
                    <div className='p-10 bg-white rounded shadow-md  min-w-sm'>
                        <h1 className='text-xl font-bold text-center mb- text-black'>Create A New List</h1>
                        <form onSubmit={handleSubmit} className='flex flex-col items-center justify-center'>
                            <input type="text" placeholder='List Name' className='mx-2 border-2 text-black border-blue-700 hover:border-blue-800 rounded-md' value={name} onChange={(e) => setName(e.target.value)} />
                            <button type='submit' className='bg-blue-700 hover:bg-blue-800 px-8 py-2 rounded-md text-white'>Create!</button>
                        </form>
                    </div>
                </div>
            </div>
        </Popup>
    );
};

export default Pop;
