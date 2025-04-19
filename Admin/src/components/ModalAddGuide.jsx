import React, { useRef, useImperativeHandle, forwardRef, useState } from 'react';
import MoonLoader from 'react-spinners/MoonLoader'
import ModalConfirmReusable from './ModalConfirmReusable.jsx';
import ModalMessage from './ModalMessage.jsx';
import { URI } from '../constants/URI.js';
import BeatLoader from 'react-spinners/BeatLoader';

import axios from 'axios';

import {X, Wrench, Hammer, Sofa, CookingPot} from 'lucide-react';
import { useEffect } from 'react';

// Using forwardRef to make the modal accessible from parent components
const ModalAddGuide = forwardRef(({titleResult}, ref) => {

    const dialogRef = useRef(null);
    const modalRef = useRef(null);
    const modalConfirmRef = useRef();

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const [userId, setUserId] = useState('');
    const [category, setCategory] = useState(''); // State for selected category
    const [title, setTitle] = useState(''); // State for guide title
    const [description, setDescription] = useState(''); // State for guide description
    const [coverPhoto, setCoverPhoto] = useState(null); // State for cover photo
    const [materials, setMaterials] = useState(''); // State for materials
    const [tools, setTools] = useState(''); // State for materials
    const [closingMessage, setClosingMessage] = useState(''); // State for closingMessage
    const [stepTitles, setStepTitles] = useState([""]); // Array for step titles
    const [stepContents, setStepContents] = useState([""]); // Array for step contents/descriptions
    const [stepFiles, setStepFiles] = useState([null]); // Array for step files
    const [stepCount, setStepCount] = useState(1); // Keep track of step count for labeling

    // Add a new step when the button is clicked
    const addStep = () => {
        setStepTitles([...stepTitles, ""]);
        setStepContents([...stepContents, ""]);
        setStepFiles([...stepFiles, null]);
        setStepCount(stepCount + 1);
    };

    // Delete a step at the specified index
    const deleteStep = (indexToDelete) => {
        // Don't delete if only one step remains
        if (stepTitles.length <= 1) return;
        
        setStepTitles(stepTitles.filter((_, index) => index !== indexToDelete));
        setStepContents(stepContents.filter((_, index) => index !== indexToDelete));
        setStepFiles(stepFiles.filter((_, index) => index !== indexToDelete));
        setStepCount(stepCount - 1);
    };

    // Update title at specific index
    const handleTitleChange = (index, value) => {
        const newTitles = [...stepTitles];
        newTitles[index] = value;
        setStepTitles(newTitles);
    };

    // Update content at specific index
    const handleContentChange = (index, value) => {
        const newContents = [...stepContents];
        newContents[index] = value;
        setStepContents(newContents);
    };

    // Handle file upload at specific index
    const handleFileChange = (index, file) => {
        const newFiles = [...stepFiles];
        newFiles[index] = file;
        setStepFiles(newFiles);
    };
    
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
            setTitle("");
            setDescription("");
            setCoverPhoto(null);
            setMaterials('');
            setClosingMessage('');
            setStepContents([""]);
            setStepTitles([""]);    
            setStepFiles([null]);
            setStepCount(1);

            dialogRef.current.close();
        }
    };

    const handlePostGuide = async () => {
        if (!category) {
            setStatus('Please select a category for your guide');
            modalRef.current.open();
            return;
        }
        
        if (!title.trim()) {
            setStatus("Please enter a title for your guide");
            modalRef.current.open();
            return;
        }
        
        if (!description.trim()) {
            setStatus("Please enter a description for your guide");
            modalRef.current.open();
            return;
        }
        
        if (!coverPhoto) {
            setStatus("Please upload a cover photo");
            modalRef.current.open();
            return;
        }
        
        if(category !== 'tool') {
            if (!tools.trim()) {
                setStatus("Please list the tools needed");
                modalRef.current.open();
                return;
            }
    
            if (!materials.trim()) {
                setStatus("Please list the materials needed");
                modalRef.current.open();
                return;
            }
        }

        
        if (!closingMessage.trim()) {
            setStatus("Please provide a closing message");
            modalRef.current.open();
            return;
        }
        
        // Check if any step is incomplete
        for (let i = 0; i < stepTitles.length; i++) {
            if (!stepTitles[i].trim()) {
                setStatus(`Please enter a title for Step ${i + 1}`);
                modalRef.current.open();
                return;
            }
            
            if (!stepContents[i].trim()) {
                setStatus(`Please enter a description for Step ${i + 1}`);
                modalRef.current.open();
                return;
            }
            
            if (!stepFiles[i]) {
                setStatus(`Please upload an image for Step ${i + 1}`);
                modalRef.current.open();
                return;
            }
        };

        try {
            modalConfirmRef.current?.open();
            } catch (error) {
            console.log(error.message);
            }
        
    };

    const handleConfirm = async() => {
        try {
            setLoading(true);
            // Upload cover photo first
            let coverPhotoData = null;
            if (coverPhoto) {
            coverPhotoData = await uploadToCloudinary(coverPhoto);
            }

            // Upload all step files
            const stepFilesData = [];
            for (let i = 0; i < stepFiles.length; i++) {
            if (stepFiles[i]) {
                const fileData = await uploadToCloudinary(stepFiles[i]);
                stepFilesData.push(fileData);
            } else {
                stepFilesData.push(null);
            }
            }

            console.log('Cover Photo URL:', coverPhotoData.url);
            console.log('Step Files URLs:', stepFilesData.map(file => file?.url));

            const res = await axios.post(`${URI}guide/create`, 
                {userID: userId, status: "pending", type: category, title: title, description: description, coverImg: coverPhotoData.url, toolsNeeded: tools, materialsNeeded: materials, stepTitles: stepTitles, stepDescriptions: stepContents, stepImg: stepFilesData.map(file => file?.url)}, {withCredentials: true});
                console.log(res.data.guide);
            return `Successfully created ${title}`;
            } catch (error) {
                console.log(error.message);
                return `Error creating ${title}: ${error.message}`;
            }
    }

    // Upload a file to Cloudinary and return the response
    const uploadToCloudinary = async (file) => {
        try {
        // Convert file to base64
        const base64 = await convertToBase64(file);
        
        // Send to backend
        const response = await axios.post(`${URI}guide/upload`, {
            data: base64
        });
        
        return response.data;
        } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
    };

    const clear = () => {
            setTitle("");
            setDescription("");
            setCoverPhoto(null);
            setMaterials('');
            setClosingMessage('');
            setStepContents([""]);
            setStepTitles([""]);    
            setStepFiles([null]);
            setStepCount(1);
    };

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await axios.get(`${URI}admin/admin-data`, {withCredentials: true});
                setUserId(response.data.data._id);
                console.log(response.data.data._id);
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };
        fetchUserId();
    }, []);

    return (
        <>
        <dialog
        ref={dialogRef}
        className="p-12 w-220 max-h-[90%] text-start rounded-lg bg-[#FAF9F6] shadow-lg backdrop:bg-black/50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >   
        
                <div className='flex flex-col gap-4 bg-white py-12 px-4 rounded-lg shadow-md max-h-full overflow-y-auto'>

                    <div className='flex flex-row items-center justify-between'> 
                        <span></span>
                        <h1 className='text-lg font-bold'>Create Guide</h1>
                        <X size={16} onClick={closeModal} className='cursor-pointer' disabled={loading}/>
                    </div>

                    <div className='w-full flex flex-col gap-8 px-12'>
                        <div className='w-full justify-start'>
                            <h1 className='text-base font-semibold'>Choose Category</h1>
                        </div>

                        <div className='w-full flex flex-row gap-4'>

                            <div className='w-full flex flex-col gap-2 justify-center items-center'>
                                <div className={`w-14 h-14 rounded-full border-1 flex items-center justify-center ${category === 'repair' && 'border-primary'} cursor-pointer`} onClick={() => setCategory('repair')}>
                                    <Wrench size={26} className={` ${category === 'repair' && 'text-primary'}`}/>
                                </div>
                                <h1 className={`text-base font-semibold ${category === 'repair' && 'text-primary'}`}>Repair</h1>
                            </div>
                            <div className='w-full flex flex-col gap-2 justify-center items-center'>
                                <div className={`w-14 h-14 rounded-full border-1 flex items-center justify-center ${category === 'tool' && 'border-primary'} cursor-pointer`} onClick={() => setCategory('tool')}>
                                    <Hammer size={26} className={` ${category === 'tool' && 'text-primary'}`}/>
                                </div>
                                <h1 className={`text-base font-semibold ${category === 'tool' && 'text-primary'}`}>Tool</h1>
                            </div>
                            <div className='w-full flex flex-col gap-2 justify-center items-center'>
                                <div className={`w-14 h-14 rounded-full border-1 flex items-center justify-center ${category === 'diy' && 'border-primary'} cursor-pointer`} onClick={() => setCategory('diy')}>
                                    <Sofa size={26} className={` ${category === 'diy' && 'text-primary'}`}/>
                                </div>
                                <h1 className={`text-base font-semibold ${category === 'diy' && 'text-primary'}`}>DIY</h1>
                            </div>
                            <div className='w-full flex flex-col gap-2 justify-center items-center'>
                                <div className={`w-14 h-14 rounded-full border-1 flex items-center justify-center ${category === 'cooking' && 'border-primary'} cursor-pointer`}  onClick={() => setCategory('cooking')}>
                                    <CookingPot size={26} className={` ${category === 'cooking' && 'text-primary'}`}/>
                                </div>
                                <h1 className={`text-base font-semibold ${category === 'cooking' && 'text-primary'}`}>Cooking</h1>
                            </div>

                        </div>

                        <div className='w-full flex flex-col gap-4 '>
                            <input type="text" value={title} placeholder="Give your project a title." className="input border-1 border-gray-200 rounded-sm w-full"  onChange={(e) => {const titleText = e.target.value; setTitle(titleText)}}/>
                            <textarea value={description} placeholder="Provide a brief introduction for your post. A minimum of 30 words is recommended to ensure optimal visibility and engagement." 
                            className="textarea textarea-md border-1 border-gray-200 rounded-sm w-full min-h-48" onChange={(e) => {const descriptionText = e.target.value; setDescription(descriptionText)}}></textarea>
                            <fieldset className="fieldset">
                                <legend className="fieldset-legend text-base font-semibold">Pick a photo for your guides cover.</legend>
                                <input type="file" className="file-input file-input-md border-gray-200 border-1 rounded-sm w-full h-auto" onChange={(e) => setCoverPhoto(e.target.files[0])}/>
                            </fieldset>
                            {category !== 'tool' && (
                                <>  
                                <div className='w-full flex flex-col gap-2'>
                                    <legend className="fieldset-legend text-base font-semibold">Tools needed:</legend>
                                    <input type="text" value={tools} placeholder="List the tools needed for this guide." className="input border-1 border-gray-200 rounded-sm w-full" onChange={(e) => {const materialsText = e.target.value; setTools(materialsText)}}/>
                                </div>
                                <div className='w-full flex flex-col gap-2'>
                                    <legend className="fieldset-legend text-base font-semibold">Materials needed:</legend>
                                    <input type="text" value={materials} placeholder="List the materials needed for this guide." className="input border-1 border-gray-200 rounded-sm w-full" onChange={(e) => {const materialsText = e.target.value; setMaterials(materialsText)}}/>
                                </div>  
                            </>
                            )}
                            
                        </div>


                        <div className='w-full flex flex-col gap-4 items-center'>
                            {stepTitles.map((title, index) => (
                                <div key={index} className="w-full flex flex-col gap-4 items-center border border-gray-200 p-4 rounded-md relative">
                                {/* Add delete button if more than one step */}
                                {stepTitles.length > 1 && (
                                    <button 
                                    className="absolute top-2 right-2 bg-red-400 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition duration-300"
                                    onClick={() => deleteStep(index)}
                                    >
                                    ×
                                    </button>
                                )}
                                
                                <div className="w-full flex flex-row gap-4 items-center">
                                    <h1>Step {index + 1}:</h1>
                                    <input
                                    type="text"
                                    placeholder="Give this step a title."
                                    className="input border border-gray-200 rounded-sm w-120"
                                    value={title}
                                    onChange={(e) => handleTitleChange(index, e.target.value)}
                                    />
                                </div>
                                <div className="w-full flex flex-col gap-4">
                                    <textarea
                                    placeholder="Provide in depth guide for this step. A minimum of 30 words is recommended to ensure optimal visibility and engagement."
                                    className="textarea border border-gray-200 rounded-sm w-full min-h-48"
                                    value={stepContents[index]}
                                    onChange={(e) => handleContentChange(index, e.target.value)}
                                    />
                                </div>
                                <div className="w-full flex flex-col gap-4">
                                    <fieldset className="border border-gray-200 p-2 rounded-sm">
                                    <legend className="text-base px-1">Post a photo or video.</legend>
                                    <input
                                        type="file"
                                        className="file-input border-gray-200 border w-full h-auto rounded-sm"
                                        onChange={(e) => handleFileChange(index, e.target.files[0])}
                                    />
                                    {stepFiles[index] && (
                                        <div className="mt-2 text-sm text-green-600">
                                        File selected: {stepFiles[index].name}
                                        </div>
                                    )}
                                    </fieldset>
                                </div>
                                </div>
                            ))}
                        </div>

                        <button className='w-full bg-white text-black border-1 rounded-lg py-2 cursor-pointer' onClick={addStep}>
                            Add Step
                        </button>
                        
                        <div className='w-full flex flex-col gap-2'>
                            <legend className="fieldset-legend text-base font-semibold">Type a short closer or your guide:</legend>
                            <textarea value={closingMessage} placeholder="Provide a brief closing message for your post. A minimum of 30 words is recommended to ensure optimal visibility and engagement." 
                            className="textarea textarea-md border-1 border-gray-200 rounded-sm w-full min-h-48" onChange={(e) => {const descriptionText = e.target.value; setClosingMessage(descriptionText)}}></textarea>
                        </div>

                        <div className='w-full flex flex-row gap-4 justify-between items-center'>
                            <button className='w-full bg-gray-400 text-white rounded-lg py-2 hover:bg-gray-500 transition duration-300 cursor-pointer' onClick={clear} disabled={loading}>
                                Cancel
                            </button>
                            <button className='w-full bg-primary text-white rounded-lg py-2 cursor-pointer' onClick={() => handlePostGuide()} disabled={loading}>
                                {loading ? <BeatLoader color="#ffffff" size={10} /> : "Post Guide"}
                            </button>
                        </div>                                    
                    </div>

                </div> 
                <ModalConfirmReusable ref={modalConfirmRef} onSubmit={handleConfirm} toConfirm={`Create guide ${title}?`} title={"Create guide"} titleResult={"Creating guide result"} shouldReload={true} resetPage={'/pending-guides'}/>
        </dialog>
        <ModalMessage ref={modalRef} modalTitle={titleResult} modalText={status} shouldReload={false}/>
        
        </>
    );
    });

export default ModalAddGuide;