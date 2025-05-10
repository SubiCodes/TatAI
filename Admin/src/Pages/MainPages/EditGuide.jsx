import { useState, useEffect } from 'react';
import { ArrowLeft, Wrench, Hammer, Sofa, CookingPot, X } from 'lucide-react';
import { BeatLoader, MoonLoader } from 'react-spinners';
import { useParams, useNavigate } from 'react-router-dom';
import ModalConfirmReusable from '../../components/ModalConfirmReusable';
import ModalMessage from '../../components/ModalMessage';
import guideStore from '../../stores/guide.store';



const EditGuide = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoading, getGuide, guide, updateGuide  } = guideStore();

  const [status, setStatus] = useState('');

  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverPhotoPreview, setCoverPhotoPreview] = useState('');
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [tools, setTools] = useState([]);
  const [newTool, setNewTool] = useState('');
  const [materials, setMaterials] = useState('');
  const [stepTitles, setStepTitles] = useState(['']);
  const [stepContents, setStepContents] = useState(['']);
  const [stepFilesPreviews, setStepFilesPreviews] = useState([null]);
  const [stepFiles, setStepFiles] = useState([null]); // New state for storing the actual files
  const [closingMessage, setClosingMessage] = useState('');
  const [additionalLinks, setAdditionalLinks] = useState('');

  const [isOpen, setIsOpen] = useState(false);
  const [confirmIsOpen, setConfirmIsOpen] = useState(false);
  const [updatingIsOpen, setUpdatingIsOpen] = useState(false);

  const toggleDialog = () => setIsOpen(!isOpen);
  const toggleDialogConfirm = () => setConfirmIsOpen(!confirmIsOpen);

  const handleValidateBeforeUpdate = async () => {
    if (!category) {
      setStatus('Please select a category for your guide');
      setIsOpen(true)
      return;
    }
  
    if (!title.trim()) {
      setStatus("Please enter a title for your guide");
      setIsOpen(true)
      return;
    }
  
    if (!description.trim()) {
      setStatus("Please enter a description for your guide");
      setIsOpen(true)
      return;
    }
  
    if (!coverPhotoPreview && !coverPhotoFile) {
      setStatus("Please upload a cover photo");
      setIsOpen(true)
      return;
    }
  
    if (category !== 'tool') {
      if (tools.length === 0 || (tools.length === 1 && !tools[0].trim())) {
        setStatus("Please list the tools needed");
        setIsOpen(true)
        return;
      }
  
      if (category !== 'repair') {
        if (!materials.trim()) {
          setStatus("Please list the materials needed");
          setIsOpen(true)
          return;
        }
      }
    }
  
    if (!closingMessage.trim()) {
      setStatus("Please provide a closing message");
      setIsOpen(true)
      return;
    }
  
    for (let i = 0; i < stepTitles.length; i++) {
      if (!stepTitles[i].trim()) {
        setStatus(`Please enter a title for Step ${i + 1}`);
        setIsOpen(true)
        return;
      }
  
      if (!stepContents[i].trim()) {
        setStatus(`Please enter a description for Step ${i + 1}`);
       setIsOpen(true)
        return;
      }
  
      if (!stepFiles[i] && !stepFilesPreviews[i]) {
        setStatus(`Please upload an image for Step ${i + 1}`);
        setIsOpen(true)
        return;
      }
    }  
    setConfirmIsOpen(true);
  };
  
const handleUpdate = async () => {
  try {
    setConfirmIsOpen(false);
    setUpdatingIsOpen(true);
    const URI = import.meta.env.VITE_URI;

    // Step 1: Determine which existing step images were removed
    const deletedImagePublicIds = [];

    if (guide && guide.stepImg?.length > 0) {
      for (let i = 0; i < guide.stepImg.length; i++) {
        const oldImg = guide.stepImg[i];
        const wasRemoved = stepFilesPreviews[i] === null; // image preview is gone
        const noNewFile = !stepFiles[i]; // and no replacement file was uploaded

        if (wasRemoved && noNewFile && oldImg?.public_id) {
          deletedImagePublicIds.push(oldImg.public_id);
        }
      }
    }

    const guideData = {
      userID: guide.userID,
      type: category,
      title,
      description,
      toolsNeeded: tools,
      materialsNeeded: materials,
      stepTitles,
      stepDescriptions: stepContents,
      closingMessage,
      additionalLink: additionalLinks,
      coverImg: guide.coverImg,
      stepImg: guide.stepImg || [],
    };

    console.log("Guide Data:", guideData);

    const message = await updateGuide(
      id,
      guideData,
      coverPhotoFile,
      stepFiles,
      deletedImagePublicIds // pass the list here
    );

    setStatus(message);
  } catch (error) {
    console.error("Update failed:", error);
    setStatus("Update failed. Please try again.");
  }
};

  // Fetch guide data when component mounts
  useEffect(() => {
    console.log(id);
    if (id) {
      getGuide(id);
    }
  }, [id, getGuide]);

  const inferMimeTypeFromUrl = (url) => {
  if (!url) return "";

  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes("/video/") || lowerUrl.match(/\.(mp4|webm|ogg)$/)) {
    return "video/mp4";
  } else if (lowerUrl.includes("/image/") || lowerUrl.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/)) {
    return "image/jpeg";
  }
  return "";
};

  useEffect(() => {
    if (guide) {
      // Set basic information
      setCategory(guide.type || "");
      setTitle(guide.title || "");
      setDescription(guide.description || "");

      // Log the fetched guide for debugging
      console.log("Fetched guide:", guide);

      // Set cover image preview
      if (guide.coverImg && guide.coverImg.url) {
        setCoverPhotoPreview(guide.coverImg.url);
      }

      // Set tools (if available)
      if (guide.toolsNeeded && Array.isArray(guide.toolsNeeded)) {
        setTools([...guide.toolsNeeded]);
      }

      // Set materials (if available)
      setMaterials(guide.materialsNeeded || "");

      // Set step titles and descriptions
      if (
        guide.stepTitles &&
        Array.isArray(guide.stepTitles) &&
        guide.stepTitles.length > 0
      ) {
        setStepTitles([...guide.stepTitles]);

        // Set step descriptions (if available)
        if (guide.stepDescriptions && Array.isArray(guide.stepDescriptions)) {
          setStepContents([...guide.stepDescriptions]);
        }

        // Set step images (if available)
        if (guide.stepImg && Array.isArray(guide.stepImg)) {
          // Map stepImg to extract the URL and create previews
          const previews = guide.stepImg.map((img) => img?.url || null);
          setStepFilesPreviews(previews);
          console.log("Step files previews:", previews); // Logs step file previews

          // Create placeholder file objects with correct type information
         const fileObjects = guide.stepImg.map((img) => ({
            type: img?.mimeType || inferMimeTypeFromUrl(img?.url),
            name: img?.url ? img.url.split("/").pop() : "",
          }));
          setStepFiles(fileObjects);
          console.log("Step files with types:", fileObjects);
        }
      }

      // Set closing message and additional links (if available)
      setClosingMessage(guide.closingMessage || "");
      setAdditionalLinks(guide.additionalLink || "");
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

  // Function to add a new step
  const addStep = () => {
    setStepTitles([...stepTitles, '']);
    setStepContents([...stepContents, '']);
    setStepFilesPreviews([...stepFilesPreviews, null]);
    setStepFiles([...stepFiles, null]); // Add a corresponding step file entry
  };

  // Function to remove a step
  const removeStep = (index) => {
    const newStepTitles = stepTitles.filter((_, i) => i !== index);
    const newStepContents = stepContents.filter((_, i) => i !== index);
    const newStepFilesPreviews = stepFilesPreviews.filter((_, i) => i !== index);
    const newStepFiles = stepFiles.filter((_, i) => i !== index); // Remove the step file

    setStepTitles(newStepTitles);
    setStepContents(newStepContents);
    setStepFilesPreviews(newStepFilesPreviews);
    setStepFiles(newStepFiles); // Remove the corresponding step file
  };

  const addTool = () => {
    if (newTool.trim() === '') return;
  
    setTools([...tools, newTool.trim()]);
    setNewTool(''); // clear the input
  };
  
  const removeTool = (index) => {
    const updatedTools = tools.filter((_, i) => i !== index);
    setTools(updatedTools);
  };

  // Function to handle step file selection
const handleStepFileChange = (index, event) => {
  const file = event.target.files[0];

  if (!file) return;

  console.log(`File selected for step ${index}:`, file);

  // Check if file is a valid type (image or video)
  if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
    // If it's a video file, check duration
    if (file.type.startsWith('video/')) {
      console.log(`Checking duration for video at step ${index}`);
      
      // Create a temporary video element to check duration
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      // Create an object URL for the video file
      const objectUrl = URL.createObjectURL(file);
      video.src = objectUrl;
      
      // Wait for metadata to load to access duration
      video.onloadedmetadata = () => {
        console.log(`Video metadata loaded. Duration: ${video.duration} seconds`);
        
        // Check if video is longer than 60 seconds (1 minute)
        if (video.duration > 60) {
          // Revoke the object URL to free up memory
          URL.revokeObjectURL(objectUrl);
          
          console.log('Video too long, showing alert');
          window.alert('Videos must be 1 minute or less. Please select a shorter video.');
          
          // Clear file input
          event.target.value = '';
          
          return; // Don't update state with this video
        } else {
          // Video is within length limit, proceed with updating state
          const newStepFilesPreviews = [...stepFilesPreviews];
          
          // If there was a previous preview URL that we created (not from guide), revoke it
          if (newStepFilesPreviews[index] && !guide?.stepImg?.[index]?.url) {
            URL.revokeObjectURL(newStepFilesPreviews[index]);
          }
          
          // Set new preview URL
          newStepFilesPreviews[index] = objectUrl;
          setStepFilesPreviews(newStepFilesPreviews);

          // Update stepFiles with the new file
          const newStepFiles = [...stepFiles];
          newStepFiles[index] = file;
          setStepFiles(newStepFiles);
          
          console.log(`Video accepted for step ${index}`);
        }
      };
      
      // Handle errors in loading video metadata
      video.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        window.alert('Failed to process video file. Please try another file.');
        // Clear file input
        event.target.value = '';
      };
    } else {
      // For image files, proceed normally
      console.log(`Image accepted for step ${index}`);
      
      const newStepFilesPreviews = [...stepFilesPreviews];
      
      // If there was a previous preview URL that we created (not from guide), revoke it
      if (newStepFilesPreviews[index] && !guide?.stepImg?.[index]?.url) {
        URL.revokeObjectURL(newStepFilesPreviews[index]);
      }
      
      // Set new preview URL
      newStepFilesPreviews[index] = URL.createObjectURL(file);
      setStepFilesPreviews(newStepFilesPreviews);

      // Update stepFiles with the new file
      const newStepFiles = [...stepFiles];
      newStepFiles[index] = file;
      setStepFiles(newStepFiles);
    }
  } else {
    // If the file is invalid, skip and notify the user
    window.alert('Invalid file type. Please upload an image or video file.');
    console.error('Invalid file type. Skipping upload for this file.');
    // Clear file input
    event.target.value = '';
  }
};

  return (
    <div className="w-full h-full">
      <div className="w-full flex flex-row justify-between items-center bg-white px-12 py-8">
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/pending-guides")}
        >
          <ArrowLeft />
        </h1>
        <h1 className="text-2xl font-bold">Edit Guide</h1>
        <h1></h1>
      </div>

      <div className="w-full h-auto px-[10%] bg-white">
        <div className="w-full flex flex-col gap-8 pb-14">
          {/* Category Selection */}
          <div className="w-full justify-start">
            <h1 className="text-base font-semibold">Choose Category</h1>
          </div>

          <div className="w-full flex flex-row gap-4">
            {["repair", "tool", "diy", "cooking"].map((cat) => (
              <div
                key={cat}
                className="w-full flex flex-col gap-2 justify-center items-center"
              >
                <div
                  className={`w-14 h-14 rounded-full border-1 flex items-center justify-center ${
                    category === cat && "border-primary"
                  } cursor-pointer`}
                  onClick={() => setCategory(cat)}
                >
                  {cat === "repair" && (
                    <Wrench
                      size={26}
                      className={`${category === "repair" && "text-primary"}`}
                    />
                  )}
                  {cat === "tool" && (
                    <Hammer
                      size={26}
                      className={`${category === "tool" && "text-primary"}`}
                    />
                  )}
                  {cat === "diy" && (
                    <Sofa
                      size={26}
                      className={`${category === "diy" && "text-primary"}`}
                    />
                  )}
                  {cat === "cooking" && (
                    <CookingPot
                      size={26}
                      className={`${category === "cooking" && "text-primary"}`}
                    />
                  )}
                </div>
                <h1
                  className={`text-base font-semibold ${
                    category === cat && "text-primary"
                  }`}
                >
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
              <legend className="fieldset-legend text-base font-semibold">
                Cover Photo
              </legend>
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
                    setCoverPhotoFile(file);
                  }
                }}
              />
            </fieldset>

            {/* Tools Section */}
            {category !== "tool" && (
              <>
                <div className="w-full flex flex-col gap-2">
                  <legend className="fieldset-legend text-base font-semibold">
                    {category === "cooking" ? "Kitchenware:" : "Tools Needed:"}
                  </legend>

                  <div className="w-full flex flex-row gap-2 justify-between items-center">
                    <input
                      type="text"
                      placeholder="List the tools needed for this guide."
                      className="input border-1 border-gray-400 rounded-sm w-full"
                      value={newTool}
                      onChange={(e) => setNewTool(e.target.value)}
                    />
                    <button
                      className="w-24 self-end bg-gray-400 text-white rounded-lg py-2 cursor-pointer"
                      onClick={addTool}
                    >
                      Add Tool
                    </button>
                  </div>

                  {/* Display existing tools */}
                  {tools.length > 0 && (
                    <div className="w-full mt-2 mb-4">
                      <div className="w-full flex flex-wrap gap-2 p-2">
                        {tools.map(
                          (tool, index) =>
                            tool && (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-gray-50 border border-gray-400 rounded-lg px-3 py-2 text-sm"
                              >
                                <span className="mr-2">{tool}</span>
                                <button
                                  className="text-red-500 hover:text-red-700 ml-2 flex items-center justify-center"
                                  aria-label="Remove tool"
                                  onClick={() => removeTool(index)}
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Add new tool input */}
                </div>

                {category !== "repair" && (
                  <div className="w-full flex flex-col gap-2">
                    <legend className="fieldset-legend text-base font-semibold">
                      {category === "cooking"
                        ? "Ingredients Needed:"
                        : "Materials needed:"}
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

          {/* Steps Section */}
          <div className="w-full flex flex-col gap-4 items-center">
            {stepTitles.map((title, index) => (
              <div
                key={index}
                className="w-full flex flex-col gap-4 items-center border border-gray-400 p-4 rounded-md relative"
              >
                <div className="w-full flex flex-row gap-4 items-center">
                  <h1>
                    {category === "tool" ? "Use" : "Step"} {index + 1}:
                  </h1>
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
                    value={stepContents[index] || ""}
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

                  {stepFilesPreviews[index] && (
                    <div className="w-full flex justify-center mt-2 mb-4">
                      {stepFiles[index]?.type?.startsWith("image/") ? (
                        <img
                          src={stepFilesPreviews[index]}
                          alt={`Step ${index + 1} preview`}
                          className="max-w-full h-auto object-contain rounded-md max-h-48"
                        />
                      ) : stepFiles[index]?.type?.startsWith("video/") ? (
                        <video
                          src={stepFilesPreviews[index]}
                          controls
                          className="w-full h-auto rounded-md max-h-48"
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : null}
                    </div>
                  )}

                    <input
                      type="file"
                      className="file-input border-gray-400 border w-full h-auto rounded-sm"
                      accept="image/*,video/*"
                      onChange={(e) => handleStepFileChange(index, e)}
                    />

                  </fieldset>
                </div>
                <button
                  onClick={() => removeStep(index)}
                  className="text-red-500 hover:text-red-700 absolute top-2 right-2"
                  aria-label="Remove step"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Add Step Button */}
          <button
            className="w-full bg-gray-100 text-black border-1 rounded-lg py-2 cursor-pointer"
            onClick={addStep}
          >
            Add Step
          </button>

          {/* Closing Message */}
          <div className="w-full flex flex-col gap-2">
            <legend className="fieldset-legend text-base font-semibold">
              Closing Message:
            </legend>
            <textarea
              value={closingMessage}
              placeholder="Provide a brief closing message for your post."
              className="textarea textarea-md border-1 border-gray-400 rounded-sm w-full min-h-48"
              onChange={(e) => setClosingMessage(e.target.value)}
            ></textarea>
          </div>

          {/* Additional Links */}
          <div className="w-full flex flex-col gap-2">
            <legend className="fieldset-legend text-base font-semibold">
              Additional Links:
            </legend>
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
              onClick={handleValidateBeforeUpdate}
            >
              {isLoading ? (
                <BeatLoader color="#ffffff" size={10} />
              ) : (
                "Update Guide"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      <dialog
        open={isOpen}
        onClick={(e) => e.target === e.currentTarget && toggleDialog()}
        className="fixed inset-0 p-0 w-screen h-screen bg-transparent z-50"
      >
        <div className="fixed inset-0 bg-black opacity-20 backdrop-blur-sm"></div>

        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-md w-96 max-w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-lg font-bold mb-4">Oops</h2>
          <p className="mb-4">{status}</p>
          <div className="w-full flex justify-end">
            <button
              onClick={toggleDialog}
              className="bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary"
            >
              Okay
            </button>
          </div>
        </div>
      </dialog>

      {/* Confirm modal */}
      <dialog
        open={confirmIsOpen}
        onClick={(e) => e.target === e.currentTarget && toggleDialog()}
        className="fixed inset-0 p-0 w-screen h-screen bg-transparent z-50"
      >
        <div className="fixed inset-0 bg-black opacity-20 backdrop-blur-sm"></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-md w-96 max-w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-lg font-bold mb-4">{"Conirm"}</h2>
          <div className="w-full mb-4">
            <span className="break-words block">
              Are you done editing guide?
            </span>
          </div>
          <div className="w-full flex justify-end gap-2">
            <button
              onClick={toggleDialogConfirm}
              className="bg-gray-400 text-white py-1 px-4 rounded-md hover:bg-gray-500"
            >
              Cancel
            </button>

            <button
              onClick={() => handleUpdate()}
              className="bg-primary text-white py-1 px-4 rounded-md hover:bg-secondary"
            >
              Confirm
            </button>
          </div>
        </div>
      </dialog>

      {/* updating modal */}
      <dialog
        open={updatingIsOpen}
        onClick={(e) => e.target === e.currentTarget && toggleDialog()}
        className="fixed inset-0 p-0 w-screen h-screen bg-transparent z-50"
      >
        <div className="fixed inset-0 bg-black opacity-20 backdrop-blur-sm"></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-md w-96 max-w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-lg font-bold mb-4">
            {isLoading ? "Updating guide" : "Result"}
          </h2>
          <p className="mb-4">{}</p>
          <div className="w-full mb-4 flex items-center justify-center">
            <span className="break-words block">
              {isLoading ? <MoonLoader size={32} /> : status}
            </span>
          </div>
          <div className="w-full flex justify-end gap-2">
            {!isLoading && (
              <button
                onClick={() => setUpdatingIsOpen(false)}
                className="bg-primary text-white py-1 px-4 rounded-md hover:bg-secondary"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default EditGuide;
