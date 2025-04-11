import React, { useState } from 'react'
import axios from 'axios'
import { URI } from '../../constants/URI.js'

import loginWallpaper from '../../Images/login-wallpaper.jpg'
import loginLogo from '../../Images/login-logo.png'

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('password');

    const showPassword = () => {
        if(type === 'password'){
            setType('text')
        }else{
            setType('password')
        }
    };

    const handleLogin = async() => {
        console.log("Email:", email);
        console.log("Password:", password);
        try {
            const res = await axios.post(`${URI}auth/sign-in-admin`, {email: email, password: password},{withCredentials: true});
            console.log(URI);
            console.log(res.data.message);
        } catch (error) {
            console.log(error);
        }
    };

  return (
    <div className='w-screen h-screen flex justify-center items-center flex-row'>
        <div className='w-3/5 h-full bg-white flex items-center justify-center'>
            <div className='w-[720px] h-[90%] flex flex-col justify-start items-center px-12 py-8 bg-gray-100 rounded-3xl gap-20'>

                <div className='w-full h-fit flex flex-col justify-center items-center object-contain border-0'>
                    <img src={loginLogo} className='max-w-[40%]'/>
                    <h1 className='text-4xl font-bold'>Welcome Admin!</h1>
                </div>

                <div className='w-full flex flex-col items-center'>

                    <div className='w-full flex flex-col items-center gap-4'>
                        <input type="text" placeholder='Email' className='w-[70%] h-14 rounded-xl border-2 border-gray-400 px-4 mb-4' onChange={(e) => setEmail(e.target.value)}/>
                        <input type={type} placeholder='Password' className='w-[70%] h-14 rounded-xl border-2 border-gray-400 px-4 mb-4' onChange={(e) => setPassword(e.target.value)}/>
                        <div className='w-[70%] h-auto flex flex-row items-center justify-start px-2 gap-2'>
                            <input type="checkbox" className="w-5 h-5" onChange={showPassword} checked={type === 'text'}/>
                            <span className='text-base'>Show Password</span>
                            <div className='flex grow'/>
                            <span className='text-base text-secondary'>Forgot Password</span>
                        </div>
                        <button className='w-[70%] h-14 bg-primary text-white rounded-xl cursor-pointer hover:bg-blue-600 mt-4' onClick={handleLogin}>Login</button>
                    </div>
                </div>

            </div>
        </div>

        <div className='w-2/5 h-screen bg-white overflow-hidden object-cover'> 
            <img src={loginWallpaper} className='max-w-[100%] min-h-screen'/>
        </div>
    </div>
  )
}

export default Login