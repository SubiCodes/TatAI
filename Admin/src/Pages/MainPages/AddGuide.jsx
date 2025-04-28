import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'
import { Wrench, Hammer, Sofa, CookingPot, X } from 'lucide-react'; 
import guideStore from '../../stores/guide.store';
import ModalMessage from '../../components/ModalMessage';
import ModalConfirmReusable from '../../components/ModalConfirmReusable';
import axios from 'axios';
import BeatLoader from 'react-spinners/BeatLoader';


function AddGuidePage() {
  const navigate = useNavigate();

  //refs
  const modalConfirmRef = useRef();
  const modalRef = useRef();

  //store that holds function
  const { createGuide, isLoading, } = guideStore();

  //states
  const [userId, setUserId] = useState('');
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState('');
  const [currentTool, setCurrentTool] = useState('');
  const [tools, setTools] = useState([]);
  const [materials, setMaterials] = useState('');
  const [stepTitles, setStepTitles] = useState(['']);
  const [stepContents, setStepContents] = useState(['']);
  const [stepFiles, setStepFiles] = useState([null]);
  const [stepFilesPreviews, setStepFilesPreviews] = useState(['']);
  const [closingMessage, setClosingMessage] = useState('');
  const [additionalLinks, setAdditionalLinks] = useState('');
  const [stepCount, setStepCount] = useState(1);
  const [status, setStatus] = useState('');

  //functions
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

const handleCoverPhotoChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setCoverPhoto(file);
    setCoverPhotoPreview(URL.createObjectURL(file));
  }
};

const addTool = () => {
  if (currentTool.trim()) {
  setTools([...tools, currentTool.trim()]);
  setCurrentTool(""); // Clear the input after adding
  }
};

const removeTool = (indexToRemove) => {
  setTools(tools.filter((_, index) => index !== indexToRemove));
};

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

  if (category !== 'tool') {
      if (tools.length === 0 || (tools.length === 1 && !tools[0].trim())) {
          setStatus("Please list the tools needed");
          modalRef.current.open();
          return;
      }

      if (category !== 'repair') {
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
  }

  try {
      if (modalRef.current) {
          modalRef.current.close();
      }
      modalConfirmRef.current?.open();
  } catch (error) {
      console.log(error.message);
  }
};

const handleConfirm = async () => {
  const guideData = {
    userID: userId,
    type: category,
    title: title,
    description: description,
    toolsNeeded: tools,
    materialsNeeded: materials,
    stepTitles: stepTitles,
    stepDescriptions: stepContents,
    closingMessage: closingMessage,
    additionalLink: additionalLinks,
  };

  const message = await createGuide(guideData, coverPhoto, stepFiles);

  console.log(message);

  // Reset the form if successful
  clear();
};

useEffect(() => {
  const fetchUserId = async () => {
      try {
          const response = await axios.get(`${import.meta.env.VITE_URI}admin/admin-data`, {withCredentials: true});
          setUserId(response.data.data._id);
          console.log(response.data.data._id);
      } catch (error) {
          console.error('Error fetching user ID:', error);
      }
  };
  fetchUserId();
}, []);


  return (
    <div className='w-full h-full'>

      <div className='w-full flex flex-row justify-between items-center bg-white px-12 py-8'>
          <h1 className='text-2xl font-bold cursor-pointer' onClick={() => navigate('/pending-guides')}><ArrowLeft/></h1>
          <h1 className='text-2xl font-bold'>Create a new guide</h1>
          <h1></h1>
      </div>

      <div className='w-full h-auto px-[10%] bg-white'>
      <div className="w-full flex flex-col gap-8 pb-14">
        <div className="w-full justify-start">
          <h1 className="text-base font-semibold">Choose Category</h1>
        </div>

        <div className="w-full flex flex-row gap-4">
          {['repair', 'tool', 'diy', 'cooking'].map((cat) => (
            <div key={cat} className="w-full flex flex-col gap-2 justify-center items-center">
              <div
                className={`w-14 h-14 rounded-full border-1 flex items-center justify-center ${category === cat && 'border-primary'} cursor-pointer`}
                onClick={() => setCategory(cat)}
              >
                {cat === 'repair' && <Wrench size={26} className={`${category === 'repair' && 'text-primary'}`} />}
                {cat === 'tool' && <Hammer size={26} className={`${category === 'tool' && 'text-primary'}`} />}
                {cat === 'diy' && <Sofa size={26} className={`${category === 'diy' && 'text-primary'}`} />}
                {cat === 'cooking' && <CookingPot size={26} className={`${category === 'cooking' && 'text-primary'}`} />}
              </div>
              <h1 className={`text-base font-semibold ${category === cat && 'text-primary'}`}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </h1>
            </div>
          ))}
        </div>

        <div className="w-full flex flex-col gap-4">
          <input
            type="text"
            value={title}
            placeholder="Give your project a title."
            className="input border-1 border-gray-400 rounded-sm w-full"
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            value={description}
            placeholder="Provide a brief introduction for your post. A minimum of 30 words is recommended to ensure optimal visibility and engagement."
            className="textarea textarea-md border-1 border-gray-400 rounded-sm w-full min-h-48"
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <fieldset className="fieldset">
            <legend className="fieldset-legend text-base font-semibold">Pick a photo for your guides cover.</legend>
            <input
              type="file"
              className="file-input file-input-md border-gray-400 border-1 rounded-sm w-full h-auto"
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
              <div className="w-full flex flex-col gap-2">
                <legend className="fieldset-legend text-base font-semibold">
                  {category === 'cooking' ? 'Kitchenware:' : 'Tools Needed:'}
                </legend>
                <div className="w-full flex flex-row gap-2 justify-between items-center">
                  <input
                    type="text"
                    value={currentTool}
                    placeholder="List the tools needed for this guide."
                    className="input border-1 border-gray-400 rounded-sm w-full"
                    onChange={(e) => setCurrentTool(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTool())}
                  />
                  <button
                    className="w-24 self-end bg-gray-400 text-white rounded-lg py-2 cursor-pointer"
                    onClick={addTool}
                    disabled={!currentTool.trim()}
                  >
                    Add Tool
                  </button>
                </div>
              </div>

              {tools.length > 0 && (
                <div className="w-full mt-2 mb-4">
                  <div className="w-full flex flex-wrap gap-2 p-2">
                    {tools.map((tool, index) => (
                      tool && (
                        <div key={index} className="flex items-center justify-between bg-gray-50 border border-gray-400 rounded-lg px-3 py-2 text-sm">
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
                <div className="w-full flex flex-col gap-2">
                  <legend className="fieldset-legend text-base font-semibold">
                    {category === "cooking" ? "Ingredients Needed:" : "Materials needed:"}
                  </legend>
                  <input
                    type="text"
                    value={materials}
                    placeholder="List the materials needed for this guide."
                    className="input border-1 border-gray-400 rounded-sm w-full"
                    onChange={(e) => setMaterials(e.target.value)}
                  />
                </div>
              )}
            </>
          )}
        </div>

        <div className="w-full flex flex-col gap-4 items-center">
          {stepTitles.map((title, index) => (
            <div key={index} className="w-full flex flex-col gap-4 items-center border border-gray-400 p-4 rounded-md relative">
              {stepTitles.length > 1 && (
                <button
                  className="absolute top-2 right-2 bg-red-400 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition duration-300"
                  onClick={() => deleteStep(index)}
                >
                  ×
                </button>
              )}
              <div className="w-full flex flex-row gap-4 items-center">
                <h1>{category === 'tool' ? "Use" : "Step"} {index + 1}:</h1>
                <input
                  type="text"
                  placeholder="Give this step a title."
                  className="input border border-gray-400 rounded-sm w-120"
                  value={title}
                  onChange={(e) => handleTitleChange(index, e.target.value)}
                />
              </div>
              <div className="w-full flex flex-col gap-4">
                <textarea
                  placeholder="Provide in depth guide for this step. A minimum of 30 words is recommended to ensure optimal visibility and engagement."
                  className="textarea border border-gray-400 rounded-sm w-full min-h-48"
                  value={stepContents[index]}
                  onChange={(e) => handleContentChange(index, e.target.value)}
                />
              </div>
              <div className="w-full flex flex-col gap-4">
                <fieldset className="border border-gray-400 p-2 rounded-sm">
                  <legend className="text-base px-1">Post a photo.</legend>
                  <input
                    type="file"
                    className="file-input border-gray-400 border w-full h-auto rounded-sm"
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

        <button className="w-full bg-gray-100 text-black border-1 rounded-lg py-2 cursor-pointer" onClick={addStep}>
          Add Step
        </button>

        <div className="w-full flex flex-col gap-2">
          <legend className="fieldset-legend text-base font-semibold">Type a short closer or your guide:</legend>
          <textarea
            value={closingMessage}
            placeholder="Provide a brief closing message for your post. A minimum of 30 words is recommended to ensure optimal visibility and engagement."
            className="textarea textarea-md border-1 border-gray-400 rounded-sm w-full min-h-48"
            onChange={(e) => setClosingMessage(e.target.value)}
          ></textarea>
        </div>

        <div className="w-full flex flex-col gap-2">
          <legend className="fieldset-legend text-base font-semibold">Additional Links:</legend>
          <textarea
            value={additionalLinks}
            placeholder="Put your additional links here. This could be empty"
            className="textarea textarea-md border-1 border-gray-400 rounded-sm w-full min-h-48"
            onChange={(e) => setAdditionalLinks(e.target.value)}
          ></textarea>
        </div>

        <div className="w-full flex flex-row gap-4 justify-between items-center">
          <button
            className="w-full bg-gray-400 text-white rounded-lg py-2 hover:bg-gray-500 transition duration-300 cursor-pointer"
            onClick={clear}
            disabled={isLoading}
          >
            Clear
          </button>
          <button
            className="w-full bg-primary text-white rounded-lg py-2 cursor-pointer"
            onClick={() => handlePostGuide()}
            disabled={isLoading}
          >
            {isLoading ? <BeatLoader color="#ffffff" size={10} /> : 'Post Guide'}
          </button>
        </div>
      </div>

      </div>
          <ModalConfirmReusable ref={modalConfirmRef} onSubmit={handleConfirm} toConfirm={`Create guide ${title}?`} title={"Create guide"} titleResult={"Guide Created"}/>
          <ModalMessage ref={modalRef} modalTitle={'Add guide error'} modalText={status} shouldReload={false}/>
    </div>  
  )
}

export default AddGuidePage