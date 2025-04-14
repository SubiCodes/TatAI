import React from 'react'
import { Ellipsis, Eye, Eraser, PencilOff, OctagonMinus } from 'lucide-react';

function DropDown({user}) {
  return (
    <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="hover:cursor-pointer"><span><Ellipsis/></span></div>
        <ul tabIndex={0} className="dropdown-content menu bg-white rounded-box z-1 w-52 p-2 shadow-sm 
        rounded-lg">
            <li className='flex flex-row items-center hover:bg-[#F5F7FA] hover:cursor-pointer rounded-lg hover:font-semibold hover:text-gray-800'>
                <span className='flex flex-row items-center gap-3'>
                    <span><Eye size={18}/></span>
                    <span>View</span>
                </span>
            </li>
            
            {(user.status === "Restricted") || (user.status === "Banned") ? (
                <li className='flex flex-row items-center hover:bg-[#F5F7FA] hover:cursor-pointer rounded-lg hover:font-semibold hover:text-gray-800'>
                 <span className='flex flex-row items-center gap-3'>
                     <span><Eraser size={18}/></span>
                     <span>Unrestrict / Unban</span>
                 </span>
                </li>
            ) : (null)}

            <div className='w-full h-[1px] bg-gray-200 mt-2 mb-2'/>

            <li className='flex flex-row items-center hover:bg-[#F5F7FA] hover:cursor-pointer rounded-lg hover:font-semibold hover:text-red-500'>
                <span className='flex flex-row items-center gap-3 text-red-400'>
                    <span><PencilOff size={18}/></span>
                    <span className='text-md'>Restrict</span>
                </span>
            </li>

            <li className='flex flex-row items-center hover:bg-[#F5F7FA] hover:cursor-pointer rounded-lg hover:font-semibold hover:text-red-500'>
                <span className='flex flex-row items-center gap-3 text-red-400'>
                    <span><OctagonMinus size={18}/></span>
                    <span>Ban</span>
                </span>
            </li>
        </ul>
    </div>
  )
}

export default DropDown