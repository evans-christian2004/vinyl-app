"use client"
import React, { use, useState } from 'react'
import { X } from 'lucide-react';
import { api } from '~/trpc/react';
import { Yesteryear } from 'next/font/google';


const AddVinylForm = () => {
    const [isActive, setIsActive] = useState(false)
    const toggleActive = () => {
        setIsActive(!isActive)   
    }
    
    const createVinyl = api.vinyl.create.useMutation()

    const [form, setForm] = useState({
        title: '',
        artist: '',
        color: '',
        edition: '',
        yearReleased: '1948',
        condition: '',
    })
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const year = Number(form.yearReleased)
        createVinyl.mutate({
            ...form,
            yearReleased: Number(form.yearReleased),
        }, {
            onSuccess: () => {
                console.log(form.yearReleased)
                setIsActive(false)
            }
        })
    }

  return (
    <div>
        <button className='bg-primary-400 text-primary-100 px-2 py-1 rounded-full text-sm hover:cursor-pointer'
        onClick={toggleActive}>
            Add Vinyl
        </button>
        <div className={isActive ? "fixed inset-0 z-40 flex justify-center items-center p-4" : "hidden"}>
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="bg-primary-100 p-8 rounded-lg shadow-2xl w-full max-w-md z-50 relative animate-fade-in-up">
                <X color='black' className='absolute top-3 right-3' onClick={toggleActive}/>
                <form onSubmit={handleSubmit} className='flex flex-col gap-1'>
                    <h1 className='font-bold text-2xl text-center pb-2'>Add a Vinyl</h1>
                    <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required 
                        className='bg-white border-1 border-primary-300 px-2 py-1 rounded-full' 
                    />
                    <input name="artist" value={form.artist} onChange={handleChange} placeholder="Artist" required 
                        className='bg-white border-1 border-primary-300 px-2 py-1 rounded-full' 
                    />
                    <input name="color" value={form.color} onChange={handleChange} placeholder="Color" />
                    <input name="edition" value={form.edition} onChange={handleChange} placeholder="Edition" 
                        className='bg-white border-1 border-primary-300 px-2 py-1 rounded-full' 
                    />
                    <input name="yearReleased" value={form.yearReleased} min={1948} onChange={handleChange} placeholder="Year Released" type="number" 
                        className='bg-white border-1 border-primary-300 px-2 py-1 rounded-full' 
                    />
                    <input name="condition" value={form.condition} onChange={handleChange} placeholder="Condition" 
                        className='bg-white border-1 border-primary-300 px-2 py-1 rounded-full' 
                    />
                    <button type="submit" className="bg-primary-400 text-primary-100 px-2 py-1 rounded-full text-sm hover:cursor-pointer">Submit</button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default AddVinylForm