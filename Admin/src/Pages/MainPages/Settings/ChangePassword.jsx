import React, { useEffect, useRef, useState } from 'react'
import { Info } from 'lucide-react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { URI } from '../../../constants/URI';
import ModalMessage from '../../../components/ModalMessage.jsx';
import PropagateLoader from 'react-spinners/PropagateLoader';

function ChangePassword() {

    const modalRef = useRef();
    const [userID, setUserID] = useState('');

    const [loading, setLoading] = useState(true);
    const [loadingChange, setLoadingChange] = useState(false)
    const [errorFetching, setErrorFectching] = useState(false);
    const [errorChanging, setErrorChanging] = useState(false);
    const [modalContent, setModalContent] = useState({
        title: "", text: ""
    })

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChangePassword = async () => {
        setLoadingChange(true);
        setErrorChanging(false);

        if (!oldPassword || !newPassword || !confirmPassword) {
            setModalContent({ title: "Invalid field", text: "Please fill in all fields."});
            setErrorChanging(true);
            modalRef.current?.open(); 
            setLoadingChange(false);
            return;
        };

        if (newPassword && (newPassword.length < 8 || !/^(?=.*[0-9])(?=.*[a-zA-Z])/.test(newPassword))) {
            setModalContent({ title: "Invalid field", text: "Password must be 8 characters in length and contain alphanumeric characters."});
            setErrorChanging(true);
            modalRef.current?.open(); 
            setLoadingChange(false);
            return;
        };

        if (newPassword !== confirmPassword) {
            setModalContent({ title: "Password Mismatch", text: "New password and confirmation do not match."});
            setErrorChanging(true);
            modalRef.current?.open();
            setLoadingChange(false);
            return;
        };

        try {
             const res = await axios.post(`${URI}auth/change-password/${userID}`, {currentPassword: oldPassword, newPassword: newPassword});
             console.log(res.data);
             setModalContent({ title: "Change Password", text: res.data.message});
             modalRef.current?.open();
             clearFields();
        } catch (error) {
            console.log(error);
            if (error.response && error.response.status === 400) {
                setModalContent({ title: "Password Change Error", text: "Current password input did not match your old password."});
                setErrorChanging(true);
            } else {
                setModalContent({ title: "Password Change Error", text: error.message || "Unknown error" });
                setErrorChanging(true);
            }
        } finally{
            setLoadingChange(false);
        }
    };

    const clearFields = () => {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const getUserID = async () => {
        setLoading(true);
        setErrorFectching(false);
        try {
            const res = await axios.get(`${URI}admin/admin-data`, {
                withCredentials: true,
            });
            setUserID(res.data.data._id);
            console.log(res.data.data._id);
        } catch (error) {
            console.log(error);
            setModalContent({ title: "Error fetching", text: error.message || "Unknown error" });
            setErrorFectching(true);
        } finally{
            setLoading(false)
        }
    };

    useEffect(() => {
        if(errorFetching) {
            modalRef.current?.open();
        }
    }, [errorFetching]);

    useEffect(() => {
        if(errorChanging) {
            modalRef.current?.open();
        }
    }, [errorChanging]);

    useEffect(() => {
        getUserID();
    }, []);

    if(loading) {
        return(
          <div className='flex justify-center items-center w-full h-full flex-col gap-8'>
            <h1 className='text-xl font-bold text-[#343C6A]'>Fetching User ID</h1>
            <PropagateLoader loading={true} color='#0818A8' size={12} speedMultiplier={0.5}/>
          </div>
        )
    }

    if(errorFetching) {
        return(
          <div className='flex justify-center items-center w-full h-full flex-col gap-4'>
            <h1 className='text-xl font-bold text-[#343C6A]'>Erro Fetching User ID</h1>
            <button className='w-20 py-2 px-2 rounded-lg cursor-pointer bg-primary text-white' onClick={() => getUserID()}>
                Refetch
            </button>
            <ModalMessage ref={modalRef} modalTitle={modalContent.title} modalText={modalContent.text} shouldReload={false}/>
          </div>
        )
    }


  return (
    <div className='w-full h-full flex flex-col p-4 items-center gap-12 pr-24 overflow-visible'>

        <div className='w-full h-auto flex flex-col gap-2 mb-4'>
            <h1 className='text-xl font-bold text-[#343C6A]'>Change Password</h1>
            <span className='text-md text-black'>
                Your password must be at least 8 characters long and include a combination of letters and numbers or special characters (!$@%).
            </span>
        </div>

        <div className='w-full flex flex-col items-center'>

            <div className='flex flex-col'>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend font-bold">Current Password</legend>
                    <input type={showOldPassword ? 'text' : 'password'}  className="input border-gray-600 border-1 rounded-lg mb-2 font-normal w-sm bg-[#F8F8FF]" placeholder="" 
                    value={oldPassword}  onChange={(e) => {
                        const oldPass = e.target.value;
                        setOldPassword(oldPass);
                    }}/>
                    <div className='flex flex-row justify-end w-full '>
                        <h1 className='flex flex-row justify-between items-center gap-1 text-md font-semibold '>
                            <input type="checkbox" className="checkbox checkbox-sm border-1 border-gray-200" 
                            checked={showOldPassword} onChange={() => setShowOldPassword(!showOldPassword)}/>Show Password
                        </h1>
                    </div>
                </fieldset>
            </div>
            
            <div className='flex flex-col mb-4'>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend font-bold">New Password</legend>
                    <input type={showNewPassword ? 'text' : 'password'}  className="input border-gray-600 border-1 rounded-lg mb-2 font-normal w-sm bg-[#F8F8FF]" placeholder=""
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

            <div className='flex flex-col'>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend font-bold"></legend>
                    <input type={showConfirmPassword ? 'text' : 'password'} className="input border-gray-600 border-1 rounded-lg mb-2 font-normal w-sm bg-[#F8F8FF]" placeholder="" 
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

            <div className='flex flex-row justify-between mt-12 gap-8'>
                <button className='w-46 h-10 bg-gray-300 rounded-lg text-white font-bold cursor-pointer' onClick={() => clearFields()}>
                    Clear
                </button>
                <button className='w-46 h-10 bg-primary rounded-lg text-white font-bold cursor-pointer' onClick={() => handleChangePassword()} disabled={loadingChange}>
                    {loading ? (<PropagateLoader size={12}/>) : "Change"}
                </button>
            </div>
        </div>
        <ModalMessage ref={modalRef} modalTitle={modalContent.title} modalText={modalContent.text} shouldReload={false}/>
    </div>
  )
}

export default ChangePassword