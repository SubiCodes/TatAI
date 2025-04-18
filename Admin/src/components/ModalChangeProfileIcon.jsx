import React, { useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { X } from 'lucide-react';
import PropagateLoader from 'react-spinners/PropagateLoader';

import ModalMessage from './ModalMessage';

import empty_profile from '../Images/profile-icons/empty_profile.png'
import boy_1 from '../Images/profile-icons/boy_1.png'
import boy_2 from '../Images/profile-icons/boy_2.png'
import boy_3 from '../Images/profile-icons/boy_3.png'
import boy_4 from '../Images/profile-icons/boy_4.png'
import girl_1 from '../Images/profile-icons/girl_1.png'
import girl_2 from '../Images/profile-icons/girl_2.png'
import girl_3 from '../Images/profile-icons/girl_3.png'
import girl_4 from '../Images/profile-icons/girl_4.png'
import lgbt_1 from '../Images/profile-icons/lgbt_1.png'
import lgbt_2 from '../Images/profile-icons/lgbt_2.png'
import lgbt_3 from '../Images/profile-icons/lgbt_3.png'
import lgbt_4 from '../Images/profile-icons/lgbt_4.png'

import axios from 'axios';
import { URI } from '../constants/URI';

// Using forwardRef to make the modal accessible from parent components
const ModalChangeProfileIcon = forwardRef(({ currentIcon, userID }, ref) => {

    const [loading, setLoading] = useState(false);
    const dialogRef = useRef(null);
    const [activeIcon, setActiveIcon] = useState(currentIcon);
    
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
            setActiveIcon(currentIcon)
        }
    };


    const handleChangeIcon = async() => {
        console.log(userID);
        setLoading(true);
        try {
            const res = await axios.put(`${URI}admin/edit-admin-data/${userID}`, {profileIcon: activeIcon});
            console.log(res);
            console.log(`${URI}admin/edit-admin-data/${userID}`);
            window.location.href = "/settings";
            dialogRef.current.close();
        } catch (error) {
            console.log(error);
            console.log(`${URI}admin/edit-admin-data/${userID}`);
        } finally{
            setLoading(false);
        }
    }

    const profileIcons = {
        'empty_profile': empty_profile,
        'boy_1': boy_1,
        'boy_2': boy_2,
        'boy_3': boy_3,
        'boy_4': boy_4,
        'girl_1': girl_1,
        'girl_2': girl_2,
        'girl_3': girl_3,
        'girl_4': girl_4,
        'lgbt_1': lgbt_1,
        'lgbt_2': lgbt_2,
        'lgbt_3': lgbt_3,
        'lgbt_4': lgbt_4
    };

    if(loading) {
        return(
          <div className='flex justify-center items-center w-full h-full flex-col gap-8'>
            <h1 className='text-xl font-bold text-[#343C6A]'>Fetching Data</h1>
            <PropagateLoader loading={true} color='#0818A8' size={12} speedMultiplier={0.5}/>
          </div>
        )
    };

    return (
        <dialog
        ref={dialogRef}
        className="p-6 w-100 rounded-lg text-start bg-white shadow-lg backdrop:bg-black/50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
            
            <div className="grid grid-cols-3 items-center w-full h-auto max-h-3/4 relative">
                <span></span> {/* Empty placeholder on the left */}
                <h1 className="text-center text-lg font-bold">Select Icon</h1>
                <div className="justify-self-end">
                    <X size={18} onClick={closeModal} className="cursor-pointer" />
                </div>
            </div>

            <div className='w-full h-[1px] bg-gray-200 mb-6 mt-4'/>

            <div className='grid grid-cols-4 gap-2'>

            {Object.entries(profileIcons)
            .filter(([key]) => key !== 'empty_profile')
            .map(([key, iconSrc]) =>  (
                    <div
                    key={key}
                    className={`w-20 h-20 rounded-full overflow-hidden border-2 flex items-center justify-center cursor-pointer transition hover:scale-105 ${
                        activeIcon === key ? 'border-blue-500' : 'border-gray-200'
                    }`}
                    onClick={() => setActiveIcon(key)}
                    >
                    <img
                        src={iconSrc}
                        alt={key}
                        className="object-cover w-16 h-auto"
                    />
                    </div>
            ))}
    
            <div className="col-span-4 px-16 mt-8">
                <button className='w-full h-auto p-2 bg-primary text-white font-bold rounded-md cursor-pointer'
                onClick={() => handleChangeIcon()}>
                    Save
                </button>
            </div>

            </div>
        </dialog>
    );
    });


export default ModalChangeProfileIcon;