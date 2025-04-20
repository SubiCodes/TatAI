import { ShieldQuestion } from 'lucide-react';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PropagateLoader from 'react-spinners/PropagateLoader';

function ViewGuide() {
    const { id } = useParams();
    const [guide, setGuide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const getGuide = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_URI}guide/${id}`);
            console.log(res.data.data);
            setGuide(res.data.data[0]);
        } catch (error) {
            console.error(error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getGuide();
    }, []);

    if (loading) {
        return (
            <div className='w-screen h-screen flex items-center justify-center flex-col gap-4'>
                <h1 className='text-2xl font-bold'>Loading...</h1>
                <PropagateLoader color="#36d7b7" size={15} />
            </div>
        )
    }

    if (error) {
        return (
            <div className='w-screen h-screen flex items-center justify-center flex-col gap-4'>
                <ShieldQuestion size={50} color="#3B40E8" />
                <h1 className='text-2xl font-bold'>Something went wrong</h1>
            </div>
        )
    }
  return (
        <div className='w-full h-full flex flex-col px-80 py-4  gap-4 overflow-auto md:px-40 pt-24'>
            <div className='w-full h-16 flex flex-col items-center justify-start gap-4'>
                <h1 className='text-4xl font-bold text-center'>{guide.title}</h1>  
                <h1 className='text-xl font-bold text-center text-gray-600'>by: {guide.uploaderName}</h1>  
            </div>

            <div className='w-full h-auto flex flex-col  items-center justify-center'>
                <div className='w-full h-[2px] bg-gray-300 mb-12 z-50 mt-8' />
                <div className='w-full md:w-3/4 lg:w-1/2 h-auto flex flex-col gap-4 items-center justify-center p-4'>
                <img
                    src={guide.coverImg.url}
                    alt="Guide Cover"
                    className='w-full h-auto object-contain rounded-lg'
                />
                </div>
            </div>
            <div className='w-full h-auto flex flex-col gap-4 mt-4 items-center justify-center mb-24'>
                <p className='text-base text-center'>{guide.description}</p>
            </div>

            <div className='w-full h-auto flex flex-col gap-8 mt-4 items-start justify-center mb-24 px-4 md:px-12 lg:px-12'>
                <h1 className='text-3xl font-bold self-start'>Tools Needed</h1>
                <div className='w-3/4  h-auto flex flex-col '>
                    {guide.toolsNeeded.map((tool, index) => (
                        <div key={index} className='h-auto flex items-center justify-start '>
                            <p className='text-lg whitespace-nowrap'>{index+1}.     {tool}</p>
                        </div>
                    ))}
                </div>
            </div>
            
            {guide.category !== 'repair' || guide.category !== 'tool'&& (
            <div className='w-full h-auto flex flex-col gap-8 mt-4 items-center justify-center mb-24 px-40'>
                <h1 className='text-3xl font-bold self-center'>Materials Needed</h1>
                <div className='w-full md:w-3/4 lg:w-1/2 h-auto flex flex-col'>
                    {guide.materialsNeeded.map((material, index) => (
                        <div key={index} className='h-auto flex items-center justify-start'>
                            <p className='text-base whitespace-nowrap'>{index+1} {material}</p>
                        </div>
                    ))}
                </div>
            </div>
            )}

            <div className='w-full h-auto flex flex-col gap-8 mt-4 items-center justify-center mb-12 px-4 md:px-12 lg:px-12'>
                <h1 className='text-3xl font-bold self-start'>Procedures</h1>
            </div>

            {guide.stepTitles && guide.stepTitles.length > 0 ? (
                guide.stepTitles.map((title, index) => (
                    <div key={index} className="w-full h-auto flex flex-col gap-4 mt-12 items-start justify-center mb-16 px-4 md:px-12 lg:px-12">
                    <div className="w-full h-auto flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                        <span className="bg-gray-200 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                            {index + 1}
                        </span>
                        <h1 className="text-2xl font-semibold">{title}</h1>
                        </div>

                        {/* Safely display Step Image */}
                        {guide.stepImg && guide.stepImg[index] && guide.stepImg[index].url && (
                        <img
                            src={guide.stepImg[index]?.url}
                            alt={`Step ${index + 1}`}
                            className="w-3/4 h-auto object-contain rounded-lg"
                        />
                        )}

                        {/* Safely display Step Description */}
                        {guide.stepDescriptions && guide.stepDescriptions[index] && (
                        <p className="text-base">{guide.stepDescriptions[index]}</p>
                        )}
                    </div>
                    </div>
                ))
                ) : (
                <p>Loading steps...</p> // Fallback for when guide.stepTitles is not available yet
                )}

            <div className='w-full h-16 flex flex-col items-start justify-center px-4 md:px-12 lg:px-12'>
                <h1 className='text-4xl font-bold'>Closing Message</h1>  
            </div>

            <div className='w-full h-auto flex flex-col gap-4 mt-4 items-start justify-center mb-24 px-4 md:px-12 lg:px-12'>
                <p className='text-base text-start'>{guide.closingMessage}</p>
            </div>

            <div className='w-full h-16 flex flex-col items-start justify-center px-4 md:px-12 lg:px-12'>
                <h1 className='text-4xl font-bold'>Additional Links</h1>  
            </div>

            <div className='w-full h-auto flex flex-col gap-4 mt-4 items-center justify-center mb-24 px-4 md:px-12 lg:px-12'>
                {guide.additionalLink && guide.additionalLink.split(/[\s\n]+/).map((link, index) => {
                    // Clean the link and check if it's valid
                    const cleanLink = link.trim();
                    if (cleanLink && (cleanLink.includes('http') || cleanLink.includes('www'))) {
                        return (
                            <a 
                                key={index} 
                                href={cleanLink.startsWith('http') ? cleanLink : `https://${cleanLink}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className='text-blue-600 hover:text-blue-800 hover:underline text-base w-full text-start'
                            >
                                {cleanLink}
                            </a>
                        );
                    }
                    return null;
                })}
            </div>
            
        </div>
  )
}

export default ViewGuide