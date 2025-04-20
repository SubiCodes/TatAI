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
    const [tools, setTools] = useState([]); // State for materials
    const [currentTool, setCurrentTool] = useState("");
    const [closingMessage, setClosingMessage] = useState(''); // State for closingMessage
    const [additionalLinks, setAdditionalLinks] = useState(''); // State for closingMessage
    const [stepTitles, setStepTitles] = useState([""]); // Array for step titles
    const [stepContents, setStepContents] = useState([""]); // Array for step contents/descriptions
    const [stepFiles, setStepFiles] = useState([null]); // Array for step files
    const [stepCount, setStepCount] = useState(1); // Keep track of step count for labeling

    const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);
    const [stepFilesPreviews, setStepFilesPreviews] = useState([null]);

    // Add a new step when the button is clicked
    const addStep = () => {
        setStepTitles([...stepTitles, ""]);
        setStepContents([...stepContents, ""]);
        setStepFiles([...stepFiles, null]);
        setStepFilesPreviews([...stepFilesPreviews, null]);
        setStepCount(stepCount + 1);
    };

    // Delete a step at the specified index
    const deleteStep = (indexToDelete) => {
        if (stepTitles.length <= 1) return;
  
        setStepTitles(stepTitles.filter((_, index) => index !== indexToDelete));
        setStepContents(stepContents.filter((_, index) => index !== indexToDelete));
        setStepFiles(stepFiles.filter((_, index) => index !== indexToDelete));
        setStepFilesPreviews(stepFilesPreviews.filter((_, index) => index !== indexToDelete));
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

        if (file) {
            const newPreviews = [...stepFilesPreviews];
            newPreviews[index] = URL.createObjectURL(file);
            setStepFilesPreviews(newPreviews);
        }
    };

    const handleCoverPhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setCoverPhoto(file);
          setCoverPhotoPreview(URL.createObjectURL(file));
        }
    };

    // Function to add a tool
    const addTool = () => {
        if (currentTool.trim()) {
        setTools([...tools, currentTool.trim()]);
        setCurrentTool(""); // Clear the input after adding
        }
    };
    
    // Function to remove a specific tool by index
    const removeTool = (indexToRemove) => {
        setTools(tools.filter((_, index) => index !== indexToRemove));
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
            clear();
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
            if (tools.length === 0 || (tools.length === 1 && !tools[0].trim())) {
                setStatus("Please list the tools needed");
                modalRef.current.open();
                return;
            }

            if (category !== 'repair'){
                if (!materials.trim()) {
                    setStatus("Please list the materials needed");
                    modalRef.current.open();
                    return;
                }
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
              console.log('Cover photo:', coverPhotoData); // should have { url, public_id }
            }
          
            // Upload all step files
            const stepFilesData = [];
            for (let i = 0; i < stepFiles.length; i++) {
              if (stepFiles[i]) {
                const fileData = await uploadToCloudinary(stepFiles[i]);
                console.log('Step file:', fileData);
                stepFilesData.push(fileData); // push full { url, public_id } object
              } else {
                stepFilesData.push(null);
              }
            }
          
            console.log('Cover Photo:', coverPhotoData);
            console.log('Step Files:', stepFilesData);
          
            const res = await axios.post(
              `${URI}guide/create`,
              {
                userID: userId,
                type: category,
                title: title,
                description: description,
                coverImg: coverPhotoData || {},
                toolsNeeded: tools,
                materialsNeeded: materials,
                stepTitles: stepTitles,
                stepDescriptions: stepContents,
                stepImg: stepFilesData.filter(Boolean),
                closingMessage: closingMessage,
                additionalLink: additionalLinks,
              },
              { withCredentials: true }
            );
          
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
        setCoverPhotoPreview(null); // Clear the preview
        setTools([]);
        setCurrentTool("");
        setMaterials('');
        setClosingMessage('');
        setAdditionalLinks('');
        setStepContents([""]);
        setStepTitles([""]);    
        setStepFiles([null]);
        setStepFilesPreviews([null]); // Clear step previews
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
                            <input 
                                type="file" 
                                className="file-input file-input-md border-gray-200 border-1 rounded-sm w-full h-auto" 
                                onChange={handleCoverPhotoChange}
                                accept="image/*"
                            />
                            </fieldset>
                            {coverPhotoPreview && (
                                <div className="w-full flex justify-center mt-2">
                                    <img 
                                    src={coverPhotoPreview} 
                                    alt="Cover preview" 
                                    className="max-w-full h-auto object-contain rounded-md max-h-64"
                                    />
                                </div>
                            )}

                            {category !== 'tool' && (
                                <>  
                                <div className='w-full flex flex-col gap-2'>
                                    <legend className="fieldset-legend text-base font-semibold">Tools needed:</legend>
                                    <div className='w-full flex flex-row gap-2 justify-between items-center'>
                                        <input type="text" value={currentTool} placeholder="List the tools needed for this guide." className="input border-1 border-gray-200 rounded-sm  w-full"onChange={(e) => setCurrentTool(e.target.value)}  onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addTool();
                                                }}}/>
                                        <button className='w-24 self-end bg-gray-400 text-white rounded-lg py-2 cursor-pointer' onClick={addTool} disabled={!currentTool.trim()}>
                                                Add Tool
                                        </button>
                                    </div>
                                </div>
                                {/* display tools that are added here */}
                                {tools.length > 0 && (
                                <div className="w-full mt-2 mb-4">
                                    <div className="w-full flex flex-wrap gap-2 p-2">
                                    {tools.map((tool, index) => (
                                        tool && (
                                        <div 
                                            key={index} 
                                            className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                        >
                                            <span className="mr-2">{tool}</span>
                                            <button 
                                            onClick={() => removeTool(index)} 
                                            className="text-red-500 hover:text-red-700 ml-2 flex items-center justify-center"
                                            aria-label="Remove tool"
                                            >
                                            <X size={16} />
                                            </button>
                                        </div>
                                        )
                                    ))}
                                    </div>
                                </div>
                                )}

                                {category !== 'repair' && (
                                    <div className='w-full flex flex-col gap-2'>
                                    <legend className="fieldset-legend text-base font-semibold">{category === "cooking" ? ("Ingredients Needed:") : ("Materials needed:")}</legend>
                                    <input type="text" value={materials} placeholder="List the materials needed for this guide." className="input border-1 border-gray-200 rounded-sm w-full" onChange={(e) => {const materialsText = e.target.value; setMaterials(materialsText)}}/>
                                    </div>  
                                )}
                                
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
                                    <legend className="text-base px-1">Post a photo for this step.</legend>
                                    <input
                                        type="file"
                                        className="file-input border-gray-200 border w-full h-auto rounded-sm"
                                        onChange={(e) => handleFileChange(index, e.target.files[0])}
                                        accept="image/*"
                                    />
                                    {stepFiles[index] && (
                                        <div className="mt-2 text-sm text-green-600">
                                        File selected: {stepFiles[index].name}
                                        </div>
                                    )}
                                    </fieldset>
                                    {stepFilesPreviews[index] && (
                                    <div className="w-full flex justify-center mt-2">
                                    {stepFiles[index]?.type.startsWith('image/') ? (
                                        <img 
                                        src={stepFilesPreviews[index]} 
                                        alt={`Step ${index + 1} preview`} 
                                        className="max-w-full h-auto object-contain rounded-md max-h-48"
                                        />
                                    ) : stepFiles[index]?.type.startsWith('video/') ? (
                                        <video 
                                        src={stepFilesPreviews[index]} 
                                        controls 
                                        className="max-w-full h-auto rounded-md max-h-48"
                                        >
                                        Your browser does not support the video tag.
                                        </video>
                                    ) : null}
                                    </div>
                                )}
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

                        <div className='w-full flex flex-col gap-2'>
                            <legend className="fieldset-legend text-base font-semibold">Additional Links:</legend>
                            <textarea value={additionalLinks} placeholder="Put your additional links here. This could be empty" 
                            className="textarea textarea-md border-1 border-gray-200 rounded-sm w-full min-h-48" onChange={(e) => {const descriptionText = e.target.value; setAdditionalLinks(descriptionText)}}></textarea>
                        </div>

                        <div className='w-full flex flex-row gap-4 justify-between items-center'>
                            <button className='w-full bg-gray-400 text-white rounded-lg py-2 hover:bg-gray-500 transition duration-300 cursor-pointer' onClick={clear} disabled={loading}>
                                Clear
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