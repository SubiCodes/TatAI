import React, { useRef, useImperativeHandle, forwardRef, useState } from 'react';
import MoonLoader from 'react-spinners/MoonLoader'
import ModalMessage from './ModalMessage.jsx'
import { URI } from '../constants/URI.js';

// Using forwardRef to make the modal accessible from parent components
const ModalConfirm = forwardRef(({ onSubmit, toConfirm, title, titleResult }, ref) => {

    const dialogRef = useRef(null);
    const modalRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [deleteStatus, setDeleteStatus] = useState('');
    
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

    const handleSubmit = async () => {
        dialogRef.current.close();
        setLoading(true);
        try {
            setDeleteStatus(onSubmit());
            modalRef.current.open();
        } catch (error) {
            setLoading(false);
            modalRef.current.open();
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <dialog
        ref={dialogRef}
        className="p-6 w-96 text-start rounded-lg bg-white shadow-lg backdrop:bg-black/50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >   
        {!loading ? (
            <>
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            <div className="mb-8 text-gray-600 text-sm text-start">
                <span className="text-gray-800 text-sm font-semibold">{toConfirm}</span> 
            </div>
            <div className="w-full flex justify-end gap-2">
                <button onClick={closeModal} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 hover:cursor-pointer transition duration-300">
                    Cancel
                </button>
                <button className="px-4 py-2 bg-secondary text-white rounded hover:bg-primary hover:cursor-pointer transition duration-300" onClick={handleSubmit}>
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
        <ModalMessage ref={modalRef} modalTitle={titleResult} modalText={deleteStatus} shouldReload={true}/>
        </>
    );
    });

export default ModalConfirm;