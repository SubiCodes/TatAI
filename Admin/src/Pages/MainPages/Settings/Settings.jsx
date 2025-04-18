import React, { useState } from 'react'
import { Pencil, LockKeyhole, Moon } from 'lucide-react'

import EditProfile from './EditProfile.jsx';
import ChangePassword from './ChangePassword.jsx';
import DarkMode from './DarkMode.jsx';

function Settings() {

    const [activePage, setActivePage] = useState('edit profile');


  return (
    <div className='w-full h-full p-8 bg-[#F5F7FA]'>

        
        <div className='w-full h-full p-8 pb-0 bg-white flex flex-row gap-16'>
            {/* Sidebar */}
            <div className='w-80 flex flex-col gap-10'>

                <div className='w-full flex flex-col gap-4'>
                    <h1 className='text-xl text-[#343C6A] font-bold'>Account Profile</h1>
                    <button className={`w-full h-auto px-4 py-3 flex flex-row gap-4 items-center rounded-2xl hover:cursor-pointer ${activePage === 'edit profile' && "bg-[#F8F8FF]"} duration-400`}
                    onClick={() => setActivePage('edit profile')}>
                        <Pencil size={14}/>
                        <h3 className='text-base'>Edit Profile</h3>
                    </button>
                </div>

                <div className='w-full flex flex-col gap-4'>
                    <h1 className='text-xl text-[#343C6A] font-bold'>Password and Security</h1>
                    <button className={`w-full h-auto px-4 py-3 flex flex-row gap-4 items-center rounded-2xl hover:cursor-pointer ${activePage === 'change password' && "bg-[#F8F8FF]"} duration-400`}
                    onClick={() => setActivePage('change password')}>
                        <LockKeyhole size={14}/>
                        <h3 className='text-base'>Change password</h3>
                    </button>
                </div>


            </div>

             {/* Active Page Display */}

            <div className='flex-1 overflow-auto'>
                {activePage === 'edit profile' && (<EditProfile/>)}
                {activePage === 'change password' && (<ChangePassword/>)}
            </div>

        </div>

       

    </div>
  )
}

export default Settings