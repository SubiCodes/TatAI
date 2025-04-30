import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Wrench, Hammer, Sofa, CookingPot, X } from 'lucide-react';
import { BeatLoader } from 'react-spinners';
import { useParams, useNavigate } from 'react-router-dom';
import ModalConfirmReusable from '../../components/ModalConfirmReusable';
import ModalMessage from '../../components/ModalMessage';
import guideStore from '../../stores/guide.store';

const EditGuide = () => {
  const { guideID } = useParams();
  const navigate = useNavigate();
  const { isLoading, getGuide, guide, status } = guideStore();

  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverPhotoPreview, setCoverPhotoPreview] = useState('');
  const [tools, setTools] = useState([]);
  const [materials, setMaterials] = useState('');
  const [stepTitles, setStepTitles] = useState(['']);
  const [stepContents, setStepContents] = useState(['']);
  const [stepFilesPreviews, setStepFilesPreviews] = useState([null]);
  const [closingMessage, setClosingMessage] = useState('');
  const [additionalLinks, setAdditionalLinks] = useState('');

  const modalRef = useRef();
  const modalConfirmRef = useRef();

  //Update Guide
  const handleUpdate = async () => {
    console.log(category);
    console.log(title);
    console.log(description);
    console.log(coverPhotoPreview);
    console.log(tools);
    console.log(materials);
    console.log(stepTitles);
    console.log(stepContents);
    console.log(stepFilesPreviews);
    console.log(closingMessage);
    console.log(additionalLinks);
  }

  // Fetch guide data when component mounts
  useEffect(() => {
    if (guideID) {
      getGuide(guideID);
    }
  }, [guideID, getGuide]);

  // Populate form fields when guide data is loaded
  useEffect(() => {
    if (guide) {
      console.log("Populating form with guide data:", guide);
      
      // Set basic information
      setCategory(guide.type || '');
      setTitle(guide.title || '');
      setDescription(guide.description || '');
      
      // Set cover image preview
      if (guide.coverImg && guide.coverImg.url) {
        setCoverPhotoPreview(guide.coverImg.url);
      }
      
      // Set tools
      if (guide.toolsNeeded && Array.isArray(guide.toolsNeeded)) {
        setTools([...guide.toolsNeeded]);
      }
      
      // Set materials
      setMaterials(guide.materialsNeeded || '');
      
      // Set steps information
      if (guide.stepTitles && Array.isArray(guide.stepTitles) && guide.stepTitles.length > 0) {
        setStepTitles([...guide.stepTitles]);
        
        // Set step descriptions
        if (guide.stepDescriptions && Array.isArray(guide.stepDescriptions)) {
          setStepContents([...guide.stepDescriptions]);
        }
        
        // Set step images
        if (guide.stepImg && Array.isArray(guide.stepImg)) {
          const previews = guide.stepImg.map(img => img?.url || null);
          setStepFilesPreviews(previews);
        }
      }
      
      // Set closing message and additional links
      setClosingMessage(guide.closingMessage || '');
      setAdditionalLinks(guide.additionalLink || '');
    }
  }, [guide]);


  // Display loading state
  if (isLoading && !guide) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <BeatLoader color="#1e40af" size={15} />
      </div>
    );
  }

  return (
    <div className='w-full h-full'>
      <div className='w-full flex flex-row justify-between items-center bg-white px-12 py-8'>
          <h1 className='text-2xl font-bold cursor-pointer' onClick={() => navigate('/pending-guides')}><ArrowLeft/></h1>
          <h1 className='text-2xl font-bold'>Edit Guide</h1>
          <h1></h1>
      </div>

      <div className='w-full h-auto px-[10%] bg-white'>
        <div className="w-full flex flex-col gap-8 pb-14">
          {/* Category Selection */}
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

          {/* Basic Information */}
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
              placeholder="Provide a brief introduction for your post."
              className="textarea textarea-md border-1 border-gray-400 rounded-sm w-full min-h-48"
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            {/* Cover Image */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-base font-semibold">Cover Photo</legend>
              {coverPhotoPreview && (
                <div className="w-full flex justify-center mt-2">
                  <img
                    src={coverPhotoPreview}
                    alt="Cover preview"
                    className="max-w-full h-auto object-contain rounded-md max-h-64"
                  />
                </div>
              )}
              <input
                type="file"
                className="file-input file-input-md border-gray-400 border-1 rounded-sm w-full h-auto mt-4"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const previewURL = URL.createObjectURL(file);
                    setCoverPhotoPreview(previewURL);
                  }
                }}
              />
            </fieldset>

            {/* Tools Section */}
            {category !== 'tool' && (
              <div className="w-full flex flex-col gap-2">
                <legend className="fieldset-legend text-base font-semibold">
                  {category === 'cooking' ? 'Kitchenware:' : 'Tools Needed:'}
                </legend>
                
                {/* Display existing tools */}
                {tools.length > 0 && (
                  <div className="w-full mt-2 mb-4">
                    <div className="w-full flex flex-wrap gap-2 p-2">
                      {tools.map((tool, index) => (
                        tool && (
                          <div key={index} className="flex items-center justify-between bg-gray-50 border border-gray-400 rounded-lg px-3 py-2 text-sm">
                            <span className="mr-2">{tool}</span>
                            <button
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

                {/* Add new tool input */}
                <div className="w-full flex flex-row gap-2 justify-between items-center">
                  <input
                    type="text"
                    placeholder="List the tools needed for this guide."
                    className="input border-1 border-gray-400 rounded-sm w-full"
                  />
                  <button
                    className="w-24 self-end bg-gray-400 text-white rounded-lg py-2 cursor-pointer"
                  >
                    Add Tool
                  </button>
                </div>
              </div>
            )}

            {/* Materials Section */}
            {category !== 'repair' && category !== 'tool' && (
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
          </div>

          {/* Steps Section */}
          <div className="w-full flex flex-col gap-4 items-center">
            {stepTitles.map((title, index) => (
              <div key={index} className="w-full flex flex-col gap-4 items-center border border-gray-400 p-4 rounded-md relative">
                <div className="w-full flex flex-row gap-4 items-center">
                  <h1>{category === 'tool' ? "Use" : "Step"} {index + 1}:</h1>
                  <input
                    type="text"
                    placeholder="Give this step a title."
                    className="input border border-gray-400 rounded-sm w-120"
                    value={title}
                    onChange={(e) => {
                      const newTitles = [...stepTitles];
                      newTitles[index] = e.target.value;
                      setStepTitles(newTitles);
                    }}
                  />
                </div>
                <div className="w-full flex flex-col gap-4">
                  <textarea
                    placeholder="Provide in depth guide for this step."
                    className="textarea border border-gray-400 rounded-sm w-full min-h-48"
                    value={stepContents[index] || ''}
                    onChange={(e) => {
                      const newContents = [...stepContents];
                      newContents[index] = e.target.value;
                      setStepContents(newContents);
                    }}
                  />
                </div>
                <div className="w-full flex flex-col gap-4">
                  <fieldset className="border border-gray-400 p-2 rounded-sm">
                    <legend className="text-base px-1">Step Image</legend>
                    
                    {/* Show existing image if available */}
                    {stepFilesPreviews[index] && (
                      <div className="w-full flex justify-center mt-2 mb-4">
                        <img
                          src={stepFilesPreviews[index]}
                          alt={`Step ${index + 1} preview`}
                          className="max-w-full h-auto object-contain rounded-md max-h-48"
                        />
                      </div>
                    )}
                    
                    <input
                      type="file"
                      className="file-input border-gray-400 border w-full h-auto rounded-sm"
                      accept="image/*"
                    />
                  </fieldset>
                </div>
              </div>
            ))}
          </div>

          {/* Add Step Button */}
          <button className="w-full bg-gray-100 text-black border-1 rounded-lg py-2 cursor-pointer">
            Add Step
          </button>

          {/* Closing Message */}
          <div className="w-full flex flex-col gap-2">
            <legend className="fieldset-legend text-base font-semibold">Closing Message:</legend>
            <textarea
              value={closingMessage}
              placeholder="Provide a brief closing message for your post."
              className="textarea textarea-md border-1 border-gray-400 rounded-sm w-full min-h-48"
              onChange={(e) => setClosingMessage(e.target.value)}
            ></textarea>
          </div>

          {/* Additional Links */}
          <div className="w-full flex flex-col gap-2">
            <legend className="fieldset-legend text-base font-semibold">Additional Links:</legend>
            <textarea
              value={additionalLinks}
              placeholder="Put your additional links here. This could be empty"
              className="textarea textarea-md border-1 border-gray-400 rounded-sm w-full min-h-48"
              onChange={(e) => setAdditionalLinks(e.target.value)}
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-row gap-4 justify-between items-center">
            <button
              className="w-full bg-primary text-white rounded-lg py-2 cursor-pointer"
              disabled={isLoading}
              onClick={handleUpdate}
            >
              {isLoading ? <BeatLoader color="#ffffff" size={10} /> : 'Update Guide'}
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ModalConfirmReusable 
        ref={modalConfirmRef} 
        onSubmit={() => {}} 
        toConfirm={`Update guide ${title}?`} 
        title={"Update Guide"} 
        titleResult={"Guide Updated"}
      />
      <ModalMessage 
        ref={modalRef} 
        modalTitle={'Update guide error'} 
        modalText={status} 
        shouldReload={false}
      />
    </div>  
  );
}

export default EditGuide;