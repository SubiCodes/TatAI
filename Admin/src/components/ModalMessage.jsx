import React, { useRef, useImperativeHandle, forwardRef } from 'react';

// Using forwardRef to make the modal accessible from parent components
const ModalMessage = forwardRef(({ modalTitle, modalText }, ref) => {
    const dialogRef = useRef(null);
    
    // Expose methods to the parent component via ref
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

    return (
        <dialog
        ref={dialogRef}
        className="p-6 w-96 rounded-lg bg-white shadow-lg backdrop:bg-black/50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
        <h2 className="text-xl font-semibold mb-4">{modalTitle}</h2>
        <p className="mb-8 text-gray-600 ">{modalText}</p>
        <div className="w-full flex justify-end gap-2">
            <button onClick={closeModal} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 hover:cursor-pointer transition duration-300">
            Okay
            </button>
        </div>
        </dialog>
    );
    });

    // Add display name for better debugging
    ModalMessage.displayName = 'ModalMessage';

export default ModalMessage;