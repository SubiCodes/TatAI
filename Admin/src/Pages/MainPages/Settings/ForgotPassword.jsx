import React, {  useRef, useState } from 'react'
import { Info } from 'lucide-react'
import axios from 'axios';
import { URI } from '../../../constants/URI';
import ModalMessage from '../../../components/ModalMessage.jsx';
import PropagateLoader from 'react-spinners/PropagateLoader';
import BeatLoader from 'react-spinners/BeatLoader';
import { useNavigate } from 'react-router-dom';

import VerificationInput from "react-verification-input";

function ForgotPassword() {
    const navigate = useNavigate();

    const modalRef = useRef();

    const [loading, setLoading] = useState(false);

    const [modalMessage, setModalMessage] = useState({title: '', text: ''}); 

    const [email ,setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [page, setPage] = useState('forgot');

    const handleSubmitEmail = async () => {
        console.log(email);
        setLoading(true);
        if (!email || !isValidEmail(email)) {
            setModalMessage({ 
              title: "Invalid Field", 
              text: "Make sure you fill in all fields and input a valid email address."
            });
            modalRef.current?.open();
            setLoading(false);
            return;
        }
        try {
            const res = await axios.post(`${URI}auth/forgot-password`, {email: email});
            setModalMessage({ title: "Sending email sucess", text: "Password reset token sent to your account."});
            modalRef.current?.open();
            console.log(res.data.message);
            setPage('otp')
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setModalMessage({ title: "Sending email error", text: "User does not exists / Server error"});
                modalRef.current?.open();
                return
            }
            if (error.response && error.response.status === 400) {
                setModalMessage({ title: "Password Change Error", text: "Email sent for the day reached" });
                modalRef.current?.open();
                return;
            };
            setModalMessage({ title: "Password Change Error", text: error.message ||  "Something went wrong"});
            modalRef.current?.open();
        } finally {
            setLoading(false);
        };
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmitToken = async () => {
        console.log(otp);
        setLoading(true);
        if (!otp || otp.length < 6) {
            setModalMessage({ 
              title: "Invalid Field", 
              text: "Make sure you fill in all fields."
            });
            modalRef.current?.open();
            setLoading(false);
            return;
        }
        try {
            const res = await axios.post(`${URI}auth/get-reset-token`, {email: email});
            if (otp.toUpperCase() === res.data.resetToken) {
                setModalMessage({ title: "Verification successfull", text: "Change you password now."});
                modalRef.current?.open();
                console.log(res.data.message);
                setPage('pass')
                return;
            };
            setModalMessage({ title: "Verification unsuccessfull", text: "Verfication code mismatch."});
            modalRef.current?.open();
            console.log(res.data.message);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setModalMessage({ title: "Sending email error", text: "User does not exists / Server error"});
                modalRef.current?.open();
            } else {
                setModalMessage({ title: "Password Change Error", text: error.message || "Unknown error" });
                modalRef.current?.open();
            }
        } finally {
            setLoading(false);
        };
    }

    const handleChangePassword = async () => {
        console.log(newPassword, confirmPassword);
        setLoading(true);
        if (!newPassword || newPassword.length < 8 || !/^(?=.*[0-9])(?=.*[a-zA-Z])/.test(newPassword)) {
            setModalMessage({ 
                title: "Invalid password", 
                text: "Make sure password is 8 characters in length and has alphanumeric characters."
            });
            modalRef.current?.open();
            setLoading(false);
            return;
        };

        if(newPassword !== confirmPassword){
            setModalMessage({ 
                title: "Invalid password", 
                text: "Passwords did not match."
            });
            modalRef.current?.open();
            setLoading(false);
            return;
        }
        try {
            const res = await axios.post(`${URI}auth/reset-password`, {email: email, resetToken: otp.toUpperCase(), newPassword: newPassword});
            setModalMessage({ title: "Passwordd change successful", text: "Login to continue."});
            modalRef.current?.open();
            setTimeout(() => {
                navigate('/login');
            }, 2000); 
            console.log(res.data.message);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setModalMessage({ title: "Change password error", text: `No reset token found for ${email} or invalid token.`});
                modalRef.current?.open();
            } else {
                setModalMessage({ title: "Password Change Error", text: error.message || "Unknown error" });
                modalRef.current?.open();
            }
        } finally {
            setLoading(false);
        };
    }

  return (
    <div className='w-screen h-screen flex justify-center bg-[#F5F7FA] py-12'>

        <div className='w-140 h-auto flex flex-col py-24 px-12 rounded-lg gap-12 bg-white'>

            {page === 'forgot' && (<>
                <h1 className='text-center text-4xl font-bold'>
                    Forgot Password
                </h1>

                <div className='w-full flex flex-col gap-4'>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend text-lg">Enter your email address</legend>
                        <input type="text" className="input w-full border-1 rounded-lg" placeholder="Type here" value={email}
                        onChange={(e) => {
                            const newEmail = e.target.value;
                            setEmail(newEmail);
                        }}/>
                        <p className="fieldset-label text-base font-semibold"><Info size={16}/> Email Address</p>
                    </fieldset>

                    <button className='w-full h-12 flex justify-center items-center bg-primary rounded-lg text-white font-bold cursor-pointer' onClick={handleSubmitEmail}>
                        {loading ? <BeatLoader size={12} color={'white'}/> : ("Submit")}
                    </button>
                </div>
            </>)}

            {page === 'otp' && (<>
                <h1 className='text-center text-4xl font-bold'>
                    Verification code sent to
                </h1>

                <div className='w-full h-12 rounded-lg border-1 flex flex-col gap-4 items-center justify-center bg-[#F8F8FF]'>
                    <h1>
                        {email}
                    </h1>
                </div>

                <div className='w-full h-12 rounded-lg  flex flex-col gap-4 items-center justify-center'>
                    <VerificationInput 
                    onChange={(value) => setOtp(value)}
                    value={otp}
                    />
                </div>

                <button className='w-full h-12 flex justify-center items-center bg-primary rounded-lg text-white font-bold cursor-pointer' onClick={handleSubmitToken}>
                    {loading ? <BeatLoader size={12} color={'white'}/> : ("Submit")}
                </button>
            </>)}

            {page === 'pass' && (<>
                <h1 className='text-center text-4xl font-bold'>
                   Create new pasword
                </h1>

                <div className='w-full flex flex-col gap-4'>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend font-bold">New Password</legend>
                        <input type={showNewPassword ? 'text' : 'password'}  className="input w-full border-gray-600 border-1 rounded-lg mb-2 font-normal bg-[#F8F8FF]" placeholder=""
                        value={newPassword}  onChange={(e) => {
                            const newPass = e.target.value;
                            setNewPassword(newPass);
                        }}/>
                        <div className='flex flex-row justify-between w-full '>
                            <h1 className='font-bold'>Enter 8+ characters</h1>
                            <h1 className='flex flex-row justify-between items-center gap-1 text-md font-semibold '>
                                <input type="checkbox" className="checkbox checkbox-sm border-1 border-gray-200" 
                                checked={showNewPassword} onChange={() => setShowNewPassword(!showNewPassword)}/>Show Password
                            </h1>
                        </div>
                    </fieldset>
                </div>
                <div className='w-full flex flex-col gap-4'>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend font-bold">Confirm Password</legend>
                        <input type={showConfirmPassword ? 'text' : 'password'} className="input border-gray-600 border-1 rounded-lg mb-2 font-normal w-full bg-[#F8F8FF]" placeholder="" 
                        value={confirmPassword}  onChange={(e) => {
                            const conPass = e.target.value;
                            setConfirmPassword(conPass);
                        }}/>
                        <div className='flex flex-row justify-between w-full '>
                            <h1 className='font-bold'>Please, re-enter password</h1>
                            <h1 className='flex flex-row justify-between items-center gap-1 text-md font-semibold '>
                                <input type="checkbox" className="checkbox checkbox-sm border-1 border-gray-200" 
                                checked={showConfirmPassword} onChange={() => setShowConfirmPassword(!showConfirmPassword)}/>Show Password
                            </h1>
                        </div>
                    </fieldset>
                </div>

                <button className='w-full h-12 flex justify-center items-center bg-primary rounded-lg text-white font-bold cursor-pointer' onClick={handleChangePassword}>
                    {loading ? <BeatLoader size={12} color={'white'}/> : ("Submit")}
                </button>
            </>)}

        <ModalMessage ref={modalRef} modalTitle={modalMessage.title} modalText={modalMessage.text}/>
        </div> 

    </div>
  )
}

export default ForgotPassword