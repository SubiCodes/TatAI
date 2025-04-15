import React, { useRef, useState } from 'react';
import { Ellipsis, Eye, Eraser, PencilOff, OctagonMinus } from 'lucide-react';
import ModalConfirmStatusChange from './ModalConfirmStatusChange.jsx';

function DropDown({user}) {

    const confirmationRef = useRef(null);

    const [statusChangedTo, setStatusChangedTo] = useState('');

    const openModal = () => {
        confirmationRef.current.open();
    };

    const confirmationStatusChange = async (action) => {
        if (!action) return;
        setStatusChangedTo(action);
        openModal();
    };


  return (
    <>
    <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="hover:cursor-pointer"><span><Ellipsis/></span></div>
        <ul tabIndex={0} className="dropdown-content menu bg-white rounded-box z-1 w-52 p-2 shadow-sm 
        rounded-lg">
            {user.role === "admin" ? (
                <li className='flex flex-row items-center hover:bg-[#F5F7FA] hover:cursor-pointer rounded-lg hover:font-semibold hover:text-gray-800'>
                    <span className='flex flex-row items-center gap-3'>
                        <span><Eye size={18}/></span>
                        <span>View</span>
                    </span>
                </li>
            ) : (
                <>
                    <li className='flex flex-row items-center hover:bg-[#F5F7FA] hover:cursor-pointer rounded-lg hover:font-semibold hover:text-gray-800'>
                        <span className='flex flex-row items-center gap-3'>
                            <span><Eye size={18}/></span>
                            <span>View</span>
                        </span>
                    </li>
                    {(user.status === "Restricted" || user.status === "Banned") && (
                        <li className='flex flex-row items-center hover:bg-[#F5F7FA] hover:cursor-pointer rounded-lg hover:font-semibold hover:text-gray-800' onClick={() => confirmationStatusChange('Verified')}>
                            <span className='flex flex-row items-center gap-3'>
                                <span><Eraser size={18}/></span>
                                <span>Unrestrict / Unban</span>
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
                </>
            )}
        </ul>
        <ModalConfirmStatusChange ref={confirmationRef} action={statusChangedTo} email={user.email} userID={user._id}/>
    </div>
    </>
  )
}

export default DropDown