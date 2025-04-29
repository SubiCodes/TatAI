import React, { useRef, useImperativeHandle, forwardRef, useState } from 'react';
import MoonLoader from 'react-spinners/MoonLoader'
import ModalMessage from './ModalMessage.jsx'
import { URI } from '../constants/URI.js';
import userStore from '../stores/user.store.js';

// Using forwardRef to make the modal accessible from parent components
const ModalConfirmStatusChange = forwardRef(({ action, email, userID }, ref) => {
    const {changeUserStatus, isLoading} = userStore();

    const dialogRef = useRef(null);
    const modalRef = useRef(null);
    const [statusChangeResult, setStatusChangeResult] = useState('');
    
    useImperativeHandle(ref, () => ({
        open: () => {
        if (dialogRef.current) {
            dialogRef.current.showModal();
        }
        },
        close: () => {
        if (dialogRef.current) {
            dialogRef.current.close();
        }
        }
    }));

    const closeModal = () => {
        if (dialogRef.current) {
        dialogRef.current.close();
        }
    };

    const changeStatus = async () => {
        const res = changeUserStatus(userID, action, email);
        setStatusChangeResult(res)
    };

    return (
        <>
        <dialog
        ref={dialogRef}
        className="p-6 w-96 text-start rounded-lg bg-white shadow-lg backdrop:bg-black/50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >   
        {!isLoading ? (
            <>
            <h2 className="text-xl font-semibold mb-4">Confirm status change</h2>
            <div className="mb-8 text-gray-600 text-sm text-start">
                Are you sure you want to change the status of <span className="text-gray-800 text-sm font-semibold">{email}</span> to <span className="text-red-400 text-sm font-semibold">{action}.</span> 
            </div>
            <div className="w-full flex justify-end gap-2">
                <button onClick={closeModal} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 hover:cursor-pointer transition duration-300">
                    Cancel
                </button>
                <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 hover:cursor-pointer transition duration-300" onClick={() => changeStatus()}>
                    Confirm
                </button>
            </div>
            </>
        ) : (
            <>  
                <div className='flex flex-col items-center justify-center gap-4'>
                    <h1 className="text-xl font-semibold mb-4 text-center">Updating Status</h1>
                    <MoonLoader size={26} speedMultiplier={0.5}/>
                </div>
            </>
        )}
            
        </dialog>
        <ModalMessage ref={modalRef} modalTitle={"Status Update Result"} modalText={statusChangeResult} shouldReload={false}/>
        </>
    );
    });

export default ModalConfirmStatusChange;