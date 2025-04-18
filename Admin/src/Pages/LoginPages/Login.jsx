import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { URI } from '../../constants/URI.js'
import BeatLoader from 'react-spinners/BeatLoader'

import { Link } from 'react-router-dom';

import loginWallpaper from '../../Images/login-wallpaper.jpg'
import loginLogo from '../../Images/login-logo.png'

function Login() {

    const navigate = useNavigate();

    const dialogRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

    const closeModal = () => {
        dialogRef.current.close();
    };    

    const handleLogin = async() => {
        setLoading(true);
        try {
            if (!email || !password) {
                setError('Please fill in all fields.');
                dialogRef.current.showModal();
                return;
            }
            const res = await axios.post(`${URI}auth/sign-in-admin`, {email: email, password: password},{withCredentials: true});
            console.log(res.data.message);
            navigate('/dashboard');
        } catch (error) {
            console.log(error);
            dialogRef.current.showModal();
            setError(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const checkTokenExist = async() => {
            try {
                const res = await axios.get(`${URI}auth/get-cookie`, {withCredentials: true});
                console.log(res.data.message);
                navigate('/dashboard');
            } catch (error) {
                console.log("User unauthenticated, redirecting to login page.");
                console.log("Error:", error);
            }
        };
        checkTokenExist();
    }, [navigate]);

  return (
    <div className='w-screen h-screen flex justify-center items-center flex-row'>
        <div className='w-3/5 h-full bg-white flex items-center justify-center'>
            <div className='w-[720px] h-[90%] flex flex-col justify-start items-center px-12 py-8 bg-gray-100 rounded-3xl gap-20'>

                <div className='w-full h-fit flex flex-col justify-center items-center object-contain border-0'>
                    <img src={loginLogo} className='max-w-[40%]'/>
                    <h1 className='text-4xl font-bold text-black'>Welcome Admin!</h1>
                </div>

                <div className='w-full flex flex-col items-center'>

                    <div className='w-full flex flex-col items-center gap-4'>
                        <input type="text" placeholder='Email' className='w-[70%] h-14 rounded-xl border-2 border-gray-400 px-4 mb-4' onChange={(e) => setEmail(e.target.value)}/>
                        <input type={type} placeholder='Password' className='w-[70%] h-14 rounded-xl border-2 border-gray-400 px-4 mb-4' onChange={(e) => setPassword(e.target.value)}/>
                        <div className='w-[70%] h-auto flex flex-row items-center justify-start px-2 gap-2'>
                            <input type="checkbox" className="w-5 h-5" color='white' onChange={showPassword} checked={type === 'text'}/>
                            <span className='text-base text-black'>Show Password</span>
                            <div className='flex grow'/>
                            <Link to="/forgot-password">
                                <h1 className='text-lg font-bold text-primary cursor-pointer hover:underline'>Forgot Password?</h1>
                            </Link>
                        </div>
                        <button className={`w-[70%] h-14 text-white rounded-xl mt-4 transition 
                            ${loading ? 'bg-primary cursor-not-allowed opacity-70' : 'bg-primary hover:bg-blue-600 cursor-pointer'}`}
                            onClick={handleLogin} disabled={loading}>
                            {loading ? <BeatLoader loading={true} color='white' size={8}/> : 'Login'}
                        </button>
                    </div>
                </div>

            </div>
        </div>

        <div className='w-2/5 h-screen bg-white overflow-hidden object-cover'> 
            <img src={loginWallpaper} className='max-w-[100%] min-h-screen'/>
        </div>

        <dialog
        ref={dialogRef}
        className="p-6 w-96 rounded-lg bg-white shadow-lg backdrop:bg-black/50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
            <h2 className="text-xl font-semibold mb-4">Login Unsuccessful</h2>
            <p className="mb-4 text-gray-600">{error}</p>
            <div className="w-full flex justify-end">
                <button onClick={closeModal} className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary hover:cursor-pointer transition duration-400">
                    Close
                </button>
            </div>
            
        </dialog>

    </div>
  )
}

export default Login