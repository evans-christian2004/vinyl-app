"use client"
import React, { use, useState } from 'react'
import { X } from 'lucide-react';



const AddVinylForm = () => {
    const [isActive, setIsActive] = useState(false)
    const toggleActive = () => {
        setIsActive(!isActive)   
    }
    
  return (
    <div>
        <button className='bg-primary-400 text-primary-100 px-2 py-1 rounded-full text-sm hover:cursor-pointer'
        onClick={toggleActive}>
            Add Vinyl
        </button>
        <div className={isActive ? "fixed inset-0 z-40 flex justify-center items-center p-4" : "hidden"}>
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="bg-primary-100 p-8 rounded-lg shadow-2xl w-full max-w-md z-50 relative animate-fade-in-up">
                <X color='black' className='absolute top-3 right-3' onClick={toggleActive}/>
                <h1>Test</h1>
            </div>
        </div>
    </div>
  )
}

export default AddVinylForm