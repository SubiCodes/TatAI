import React, { useRef, useImperativeHandle, forwardRef, useState } from 'react';
import MoonLoader from 'react-spinners/MoonLoader'
import { URI } from '../constants/URI.js';
import ModalMessageReusable from './ModalMessageReusable.jsx';

// Using forwardRef to make the modal accessible from parent components
const ModalConfirmReusable = forwardRef(({ onSubmit, toConfirm, title, titleResult, resetPage }, ref) => {

    const dialogRef = useRef(null);
    const modalRef = useRef();

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    
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
        setLoading(true);
      
        try {
          const result = await onSubmit(); 
          console.log("onSubmit result:", result); 
          setStatus(result);
          modalRef.current.open(); 
        } catch (error) {
          console.error("Submission error:", error);
          setStatus("Something went wrong.");
          modalRef.current.open(); 
        } finally {
          setLoading(false);
          dialogRef.current.close(); 
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
                <span className="text-gray-800 text-sm font-semibold text-wrap">{toConfirm}</span> 
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
        <ModalMessageReusable ref={modalRef} modalTitle={titleResult} modalText={status} shouldReload={true} resetPage={resetPage}/>
        </>
    );
    });

export default ModalConfirmReusable;