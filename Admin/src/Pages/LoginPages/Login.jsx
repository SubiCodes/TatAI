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
        <div
        className="w-screen h-screen flex justify-center items-center flex-row"
        style={{
            backgroundImage: `url(${loginWallpaper})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}
        >
        <div className='w-full md:w-2/5 h-auto flex items-center justify-center'>
        <div className='w-auto h-auto md:h-[90%] flex flex-col justify-center items-center bg-white/50 backdrop-blur-md border border-white/50 shadow-lg rounded-3xl gap-4 md:gap-8 p-3 md:p-6 overflow-auto'>
                {/* Logo and Welcome Text */}
                <div className='w-full h-fit flex flex-col justify-center items-center object-contain border-0 mb-2'>
                    <img src={loginLogo} className='max-w-[40%] sm:max-w-[20%] md:max-w-[30%] mb-2' />
                    <h1 className='text-2xl sm:text-3xl md:text-3xl font-bold text-black'>Welcome Admin!</h1>
                </div>
                
                {/* Login Form */}
                <div className='w-full flex flex-col items-center'>
                    <div className='w-full flex flex-col items-center gap-3'>
                        {/* Email Input */}
                        <input 
                            type="text" 
                            placeholder='Email' 
                            className='w-[90%] sm:w-[80%] md:w-[70%] h-10 md:h-10 rounded-xl border-2 border-gray-400 px-4 mb-2' 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                        
                        {/* Password Input */}
                        <input 
                            type={type} 
                            placeholder='Password' 
                            className='w-[90%] sm:w-[80%] md:w-[70%] h-10 md:h-10 rounded-xl border-2 border-gray-400 px-4 mb-2' 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                        
                        {/* Checkbox and Forgot Password Row */}
                        <div className='w-[90%] sm:w-[80%] md:w-[70%] h-auto flex flex-row items-center justify-between px-1 gap-1 flex-wrap'>
                            {/* Show Password Checkbox */}
                            <div className="flex items-center gap-1">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4" 
                                    color='white' 
                                    onChange={showPassword} 
                                    checked={type === 'text'} 
                                />
                                <span className='text-xs sm:text-sm text-black'>Show Password</span>
                            </div>
                            
                            {/* Forgot Password Link */}
                            <Link to="/forgot-password">
                                <h1 className='text-sm sm:text-base font-bold text-primary cursor-pointer hover:underline'>Forgot Password?</h1>
                            </Link>
                        </div>
                        
                        {/* Login Button */}
                        <button 
                            className={`w-[90%] sm:w-[80%] md:w-[70%] h-10 md:h-10 text-white rounded-xl mt-3 transition mb-4
                                ${loading ? 'bg-primary cursor-not-allowed opacity-70' : 'bg-primary hover:bg-blue-600 cursor-pointer'}`}
                            onClick={handleLogin} 
                            disabled={loading}
                        >
                            {loading ? <BeatLoader loading={true} color='white' size={8}/> : 'Login'}
                        </button>
                    </div>
                </div>
            </div>
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