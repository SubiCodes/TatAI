import React, { useRef, useState } from 'react';
import { URI } from '../constants/URI.js';

import { Ellipsis, Eye, CircleCheck, CircleX, PencilOff, OctagonMinus, Trash2 } from 'lucide-react';
import ModalConfirmStatusChange from './ModalConfirmStatusChange.jsx';
import ModalConfirmDelete from './ModalConfirmDelete.jsx';
import axios from 'axios';

function DropDown({user, isSuperAdmin}) {

    const confirmationRef = useRef(null);
    const deleteRef = useRef(null);

    const [statusChangedTo, setStatusChangedTo] = useState('');

    const openModalStatus = () => {
        confirmationRef.current.open();
    };
    const openModalDelete = () => {
        deleteRef.current.open();
    };

    const confirmationStatusChange = async (action) => {
        if (!action) return;
        setStatusChangedTo(action);
        openModalStatus();
    };

    const confirmationDelete = async () => {
        openModalDelete();
    };

    const deleteAccount = async () => {
        try {
            const res = await axios.post(`${URI}admin/delete-account/${user._id}`);
            console.log(res);
            return `Successfully Deleted ${user.email}`;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong.";
            console.error("Delete failed:", errorMessage);
            return errorMessage
        }
    }

  return (
    <>
    <div  className={`dropdown dropdown-end ${user.role === 'super admin' ? 'pointer-events-none opacity-50 hover:cursor-not-allowed' : ''}`}>
        <div tabIndex={0} role="button"  className={`${user.role === 'super admin' ? 'cursor-not-allowed' : 'hover:cursor-pointer'}`}><span><Ellipsis/></span></div>
        <ul tabIndex={0} className="dropdown-content menu bg-white rounded-box z-1 w-52 p-2 shadow-sm 
        rounded-lg">
            {user.role === "admin" ? (
                <>
                <li className='flex flex-row items-center hover:bg-[#F5F7FA] hover:cursor-pointer rounded-lg hover:font-semibold hover:text-gray-800'>
                    <span className='flex flex-row items-center gap-3'>
                        <span><Eye size={18}/></span>
                        <span>View</span>
                    </span>
                </li>
                {isSuperAdmin && (
                    <li className='flex flex-row items-center hover:bg-[#F5F7FA] hover:cursor-pointer rounded-lg hover:font-semibold hover:text-red-500' onClick={() => confirmationDelete()}>
                        <span className='flex flex-row items-center gap-3 text-red-400'>
                            <span><Trash2 size={18}/></span>
                            <span>Delete</span>
                        </span>
                    </li>
                )}
                </>
            ) : (
                <>
                    <li className='flex flex-row items-center hover:bg-[#F5F7FA] hover:cursor-pointer rounded-lg hover:font-semibold hover:text-gray-800'>
                        <span className='flex flex-row items-center gap-3'>
                            <span><Eye size={18}/></span>
                            <span>View</span>
                        </span>
                    </li>
                    
                    {(user.status !== "Verified") && (
                        <li className='flex flex-row items-center hover:bg-[#F5F7FA] hover:cursor-pointer rounded-lg hover:font-semibold hover:text-gray-800' onClick={() => confirmationStatusChange('Verified')}>
                            <span className='flex flex-row items-center gap-3'>
                                <span><CircleCheck size={18}/></span>
                                <span>Verify</span>
                            </span>
                        </li>
                    )}

                    {(user.status !== "Unverified") && (
                        <li className='flex flex-row items-center hover:bg-[#F5F7FA] hover:cursor-pointer rounded-lg hover:font-semibold hover:text-gray-800' onClick={() => confirmationStatusChange('Unverified')}>
                            <span className='flex flex-row items-center gap-3'>
                                <span><CircleX size={18}/></span>
                                <span>Unverify</span>
                            </span>
                        </li>
                    )}

                    <div className='w-full h-[1px] bg-gray-200 mt-2 mb-2'/>

                    {user.status !== "Restricted" && (
                        <li className='flex flex-row items-center hover:bg-[#F5F7FA] hover:cursor-pointer rounded-lg hover:font-semibold hover:text-red-500' onClick={() => confirmationStatusChange('Restricted')}>
                            <span className='flex flex-row items-center gap-3 text-red-400'>
                                <span><PencilOff size={18}/></span>
                                <span className='text-md'>Restrict</span>
                            </span>
                        </li>
                    )}

                    {user.status !== "Banned" && (
                        <li className='flex flex-row items-center hover:bg-[#F5F7FA] hover:cursor-pointer rounded-lg hover:font-semibold hover:text-red-500' onClick={() => confirmationStatusChange('Banned')}>
                            <span className='flex flex-row items-center gap-3 text-red-400'>
                                <span><OctagonMinus size={18}/></span>
                                <span>Ban</span>
                            </span>
                        </li>
                    )}
                    
                    {isSuperAdmin && (
                        <li className='flex flex-row items-center hover:bg-[#F5F7FA] hover:cursor-pointer rounded-lg hover:font-semibold hover:text-red-500' onClick={() => confirmationDelete()}>
                            <span className='flex flex-row items-center gap-3 text-red-400'>
                                <span><Trash2 size={18}/></span>
                                <span>Delete</span>
                            </span>
                        </li>
                    )}

                </>
            )}
        </ul>
        <ModalConfirmStatusChange ref={confirmationRef} action={statusChangedTo} email={user.email} userID={user._id}/>
        <ModalConfirmDelete ref={deleteRef} toDelete={user.email} title={"Confirm account deletion"} onSubmit={deleteAccount}/>
    </div>
    </>
  )
}

export default DropDown