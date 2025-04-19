import React from 'react'
import { useRef } from 'react';

import ModalAddGuide from '../../components/ModalAddGuide.jsx'

function Guides() {

  const addGuideRef = useRef();

  return (
    <div className='w-full h-full p-8 bg-[#F5F7FA]'>

      <div className='w-full flex flex-row justify-between items-center'>
        <h1 className='text-2xl font-bold'>All Guides</h1>
        <button className='text-md text-white bg-primary cursor-pointer px-4 py-2 rounded-lg' onClick={() => addGuideRef.current.open()}>
          Create New Guide
        </button>
      </div>
      <ModalAddGuide ref={addGuideRef} titleResult={"Guide post result"}/>
    </div>
  )
}

export default Guides