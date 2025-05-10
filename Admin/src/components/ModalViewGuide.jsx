import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import PropagateLoader from 'react-spinners/PropagateLoader';
import { X, ShieldQuestion, Eye, EyeOff } from 'lucide-react';
import ModalConfirmReusable from '../components/ModalConfirmReusable.jsx';
import Swal from 'sweetalert2'

import empty_profile from '../Images/profile-icons/empty_profile.png'
import boy_1 from '../Images/profile-icons/boy_1.png'
import boy_2 from '../Images/profile-icons/boy_2.png'
import boy_3 from '../Images/profile-icons/boy_3.png'
import boy_4 from '../Images/profile-icons/boy_4.png'
import girl_1 from '../Images/profile-icons/girl_1.png'
import girl_2 from '../Images/profile-icons/girl_2.png'
import girl_3 from '../Images/profile-icons/girl_3.png'
import girl_4 from '../Images/profile-icons/girl_4.png'
import lgbt_1 from '../Images/profile-icons/lgbt_1.png'
import lgbt_2 from '../Images/profile-icons/lgbt_2.png'
import lgbt_3 from '../Images/profile-icons/lgbt_3.png'
import lgbt_4 from '../Images/profile-icons/lgbt_4.png'
import guideStore from '../stores/guide.store.js'
import axios from 'axios';

import { Link } from 'react-router-dom';


// Using forwardRef to make the modal accessible from parent components
const ModalViewGuide = forwardRef(({ guideID }, ref) => {
    const dialogRef = useRef(null);
    const modalConfirmRef = useRef();
    const [isOpen, setIsOpen] = useState(false);
    const [fetchingComments, setFetchingComments] = useState(false);
    
    // Expose methods to the parent component via ref
    useImperativeHandle(ref, () => ({
        open: () => {
            if (dialogRef.current) {
                dialogRef.current.showModal();
                setIsOpen(true); // Set state to indicate modal is open
            }
        },
        close: () => {
            if (dialogRef.current) {
                dialogRef.current.close();
                setIsOpen(false); // Set state to indicate modal is closed
            }
        }
    }));

    const closeModal = () => {
        if (dialogRef.current) {
            dialogRef.current.close();
            setIsOpen(false);
        }
    };

    const { guide, getGuide, changeGuideStatus, isLoading, error, getGuideFeedback, feedback, hideComment } = guideStore();

    const [changeStatusTo, setChangeStatusTo] = useState('');
    const [adminID, setAdminID] = useState();

    const getFeedback = async () => {
      setFetchingComments(true);
      try {
        await getGuideFeedback(guideID);
      } finally {
        setFetchingComments(false);
      }
    };

    const hideUserComment = async (commentId) => {
        hideComment(commentId);
    };

    const changeStatus = async () => {
      const res = changeGuideStatus(guide._id, changeStatusTo)
      console.log('res from change status: ', res);
      return res;
    };

    const openConfirmationModal = () => {
        modalConfirmRef.current?.open();
        console.log("Modal opened");
    }

    const profileIcons = {
        'empty_profile': empty_profile,
        'boy_1': boy_1,
        'boy_2': boy_2,
        'boy_3': boy_3,
        'boy_4': boy_4,
        'girl_1': girl_1,
        'girl_2': girl_2,
        'girl_3': girl_3,
        'girl_4': girl_4,
        'lgbt_1': lgbt_1,
        'lgbt_2': lgbt_2,
        'lgbt_3': lgbt_3,
        'lgbt_4': lgbt_4
    };

    const getAdminID = async () => {
      try {
        console.log('api called', `${import.meta.env.VITE_URI}admin/admin-data`);
        const res = await axios.get(`${import.meta.env.VITE_URI}admin/admin-data`, {
          withCredentials: true,
        });
        setAdminID(res.data.data._id);
      } catch (error) {
        console.log(error);
      }
    }

    useEffect(() => {
        if (isOpen) {
            getAdminID();
            getGuide(guideID);
            getFeedback();
        }
    }, [isOpen, guideID]);

    return (
        <dialog
          ref={dialogRef}
          className="p-12 w-[60%] max-h-[90%] text-start rounded-lg bg-[#FAF9F6] shadow-lg backdrop:bg-black/50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          onClose={() => setIsOpen(false)}
        >
          <div className="w-full h-10 grid grid-cols-3 items-center">
            <span></span>
            <span></span>
            <span className="text-right pr-4">
              <button className="p-0 cursor-pointer" onClick={closeModal}>
                <X />
              </button>
            </span>
          </div>
      
          <div className="px-16">
            {isLoading ? (
              <div className="w-full h-48 flex items-center justify-center flex-col gap-4">
                <h1 className="text-2xl font-bold">Loading...</h1>
                <PropagateLoader color="#36d7b7" size={15} />
              </div>
            ) : error ? (
              <div className="w-full h-48 flex items-center justify-center flex-col gap-4">
                <ShieldQuestion size={50} color="#3B40E8" />
                <h1 className="text-2xl font-bold">Something went wrong</h1>
              </div>
            ) : (
              <div className="w-full">
                <div className="w-full h-auto flex flex-col items-center justify-center">
                  <h2 className="text-4xl font-bold mb-4">{guide?.title}</h2>
                </div>
      
                <div className="w-full h-auto flex flex-row gap-4 items-center justify-start mb-4 mt-4">
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img
                        src={profileIcons[guide?.posterInfo?.profileIcon]}
                        alt="Poster profile"
                      />
                    </div>
                  </div>
                  <h1 className="text-xl font-bold text-gray-600">{guide?.posterInfo?.name}</h1>
                  <div className='flex-1'/>
                  {adminID === guide.userID && (
                    <Link to={`/edit-guide/${guide._id}`}>
                      <button className='bg-transparent text-black p-2 border-[1px] rounded-lg cursor-pointer hover:bg-primary hover:text-white hover:border-0 duration-300'>
                        Edit Guide
                      </button>
                    </Link>
                  )}
                </div>
      
                <div className="w-full h-auto flex flex-col items-center justify-center">
                  <span>{guide?.description}</span>
                </div>
      
                <div className="w-full h-[2px] bg-gray-400 mt-4 mb-4" />
      
                <div className="w-full h-auto px-12 flex flex-col gap-4 items-center justify-center mb-12">
                  <img
                    src={guide?.coverImg?.url}
                    alt="Guide Cover"
                    className="w-full h-auto object-contain rounded-lg"
                  />
                </div>

                <div className="w-full h-auto flex flex-col items-center justify-center mt-8">
                  <h2 className="text-2xl font-bold mb-4">
                    {guide.type === 'repair' && "Tools"}
                    {guide.type === 'diy' && "Tools"}
                    {guide.type === 'tool' && null}
                    {guide.type === 'cooking' && "Kitchen Ware"}
                  </h2>
                </div>

                {guide.type !== 'tool' && (
                            <div className="w-full h-auto flex flex-col items-center justify-center">
                                <div className="w-full flex flex-row items-center justify-center flex-wrap gap-8 p-4">
                                    {guide.toolsNeeded?.map((material, index) => (
                                        <div key={index} className="h-auto flex items-center justify-center">
                                            <p className="text-lg whitespace-nowrap text-center">→ {material}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                )}

                <div className="w-full h-auto flex flex-col items-center justify-center mt-8">
                  <h2 className="text-2xl font-bold mb-4">
                    {guide.type === 'repair' && null }
                    {guide.type === 'diy' && "Materials"}
                    {guide.type === 'tool' && null}
                    {guide.type === 'cooking' && "Ingredients"}
                  </h2>
                </div>

                {(guide.type === 'cooking' || guide.type === 'diy') && (
                    <div className="w-full h-auto flex flex-row gap-4 justify-center p-4">
                      <span className='font-bold text-lg'>
                        → 
                      </span>
                      <span>
                        {guide.materialsNeeded}
                      </span>
                    </div>
                )}
      
                <div className="w-full h-auto flex flex-col items-center justify-center mt-8">
                  <h2 className="text-2xl font-bold mb-4">{guide.type === 'tool' ? "Uses" : "Procedures"}</h2>
                </div>
      
                {guide?.stepTitles && guide.stepTitles.length > 0 ? (
                  guide?.stepTitles?.map((title, index) => (
                    <div key={index} className="w-full h-auto flex flex-col gap-4 mt-12 items-start justify-center mb-16">
                      <div className="w-auto h-auto flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                          <span className="bg-gray-200 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                            {index + 1}
                          </span>
                          <h1 className="text-2xl font-semibold">{title}</h1>
                        </div>

                        {guide.stepImg && guide.stepImg[index]?.url && (
                          // Check the URL to determine whether it's an image or video
                          guide.stepImg[index].url.includes('/image/') ? (
                            <img
                              src={guide.stepImg[index].url}
                              alt={`Step ${index + 1}`}
                              className="w-3/4 h-auto object-contain rounded-lg"
                            />
                          ) : guide.stepImg[index].url.includes('/video/') ? (
                            <video
                              src={guide.stepImg[index].url}
                              controls
                              className="w-full h-auto rounded-lg"
                            >
                              Your browser does not support the video tag.
                            </video>
                          ) : null
                        )}

                        {guide.stepDescriptions && guide.stepDescriptions[index] && (
                          <p className="text-base">{guide.stepDescriptions[index]}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Loading steps...</p>
                )}
      
                <div className="w-full h-16 flex flex-col items-center justify-center">
                  <h1 className="text-4xl font-bold">Closing Message</h1>
                </div>
      
                <div className="w-full h-auto flex flex-col gap-4 mt-4 items-center justify-center mb-24">
                  <p className="text-base text-center">{guide?.closingMessage}</p>
                </div>
      
                <div className="w-full h-16 flex flex-col items-center justify-center">
                  <h1 className="text-4xl font-bold">Additional Links</h1>
                </div>
      
                <div className="w-full h-auto flex flex-col gap-4 mt-4 items-center justify-center mb-24 flex-wrap">
                  {guide?.additionalLink &&
                    guide.additionalLink.split(/[\s\n]+/)?.map((link, index) => {
                      const cleanLink = link.trim();
                      if (cleanLink && (cleanLink.includes('http') || cleanLink.includes('www'))) {
                        return (
                          <a
                            key={index}
                            href={cleanLink.startsWith('http') ? cleanLink : `https://${cleanLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline text-base w-full text-center break-words"
                          >
                            {cleanLink}
                          </a>
                        );
                      }     
                      return null;
                    })}
                </div>
      
                <div className="w-full h-auto flex flex-col items-center justify-center mb-4 gap-8">
                  <h1 className="text-4xl font-bold">
                    Status: <span className="text-primary font-normal">{guide?.status?.charAt(0).toUpperCase() + guide?.status?.slice(1)}</span>
                  </h1>
                  <div className="w-full h-auto flex flex-col gap-4 mt-4 items-center justify-center mb-24">
                    <ModalConfirmReusable ref={modalConfirmRef} onSubmit={() => changeStatus()}toConfirm={`Change ${guide.title} status to ${changeStatusTo}`} title={'Change Guide Status'} titleResult={'Change status result'} />
                    <span className="text-lg">Update this guide's status?</span>
                    <div className="flex flex-row gap-4 items-center justify-center">
                      <button
                        className="w-auto h-8 bg-green-400 px-4 py-2 flex items-center justify-center rounded-lg cursor-pointer text-white font-bold"
                        onClick={() => {
                            setChangeStatusTo('accepted');
                            openConfirmationModal();
                        }}
                      >
                        Accept
                      </button>
                      <button
                        className="w-auto h-8 bg-red-400 px-4 py-2 flex items-center justify-center rounded-lg cursor-pointer text-white font-bold"
                        onClick={() => {
                            setChangeStatusTo('rejected');
                            openConfirmationModal();
                        }}
                      >
                        Reject
                      </button>
                      <button
                        className="w-auto h-8 bg-gray-400 px-4 py-2 flex items-center justify-center rounded-lg cursor-pointer text-white font-bold"
                        onClick={() => {
                            setChangeStatusTo('pending');
                            openConfirmationModal();
                        }}
                      >
                        Pending
                      </button>
                    </div>
                  </div>
                </div>
      
                <div className="w-full h-16 flex flex-col items-center justify-center">
                  <h1 className="text-4xl font-bold">Reviews</h1>
                </div>
      
                <div className="w-full flex flex-col items-center justify-center mb-12">
                  <div className="rating rating-xl rating-half pointer-events-none mb-2">
                    <input type="radio" name="rating-display" className="rating-hidden" checked={Math.round(guide?.feedbackInfo?.averageRating * 2) / 2 === 0} readOnly />
                    <input type="radio" name="rating-display" className="mask mask-star-2 mask-half-1 bg-primary" checked={Math.round(guide?.feedbackInfo?.averageRating * 2) / 2 === 0.5} readOnly />
                    <input type="radio" name="rating-display" className="mask mask-star-2 mask-half-2 bg-primary" checked={Math.round(guide?.feedbackInfo?.averageRating * 2) / 2 === 1.0} readOnly />
                    <input type="radio" name="rating-display" className="mask mask-star-2 mask-half-1 bg-primary" checked={Math.round(guide?.feedbackInfo?.averageRating * 2) / 2 === 1.5} readOnly />
                    <input type="radio" name="rating-display" className="mask mask-star-2 mask-half-2 bg-primary" checked={Math.round(guide?.feedbackInfo?.averageRating * 2) / 2 === 2.0} readOnly />
                    <input type="radio" name="rating-display" className="mask mask-star-2 mask-half-1 bg-primary" checked={Math.round(guide?.feedbackInfo?.averageRating * 2) / 2 === 2.5} readOnly />
                    <input type="radio" name="rating-display" className="mask mask-star-2 mask-half-2 bg-primary" checked={Math.round(guide?.feedbackInfo?.averageRating * 2) / 2 === 3.0} readOnly />
                    <input type="radio" name="rating-display" className="mask mask-star-2 mask-half-1 bg-primary" checked={Math.round(guide?.feedbackInfo?.averageRating * 2) / 2 === 3.5} readOnly />
                    <input type="radio" name="rating-display" className="mask mask-star-2 mask-half-2 bg-primary" checked={Math.round(guide?.feedbackInfo?.averageRating * 2) / 2 === 4.0} readOnly />
                    <input type="radio" name="rating-display" className="mask mask-star-2 mask-half-1 bg-primary" checked={Math.round(guide?.feedbackInfo?.averageRating * 2) / 2 === 4.5} readOnly />
                    <input type="radio" name="rating-display" className="mask mask-star-2 mask-half-2 bg-primary" checked={Math.round(guide?.feedbackInfo?.averageRating * 2) / 2 === 5.0} readOnly />
                  </div>
                    <span className="text-sm text-gray-400 flex flex-row gap-2">
                        Average Rating: <span className='font-bold'>{guide?.feedbackInfo?.averageRating}</span>
                    </span>
                    <span className="text-sm text-gray-400 flex flex-row gap-2">
                        Total Rating:  <span className='font-bold'>{guide?.feedbackInfo?.ratingCount}</span>
                    </span>
                </div>

                <div className="w-full h-16 flex flex-col items-center justify-center mb-12">
                  <h1 className="text-4xl font-bold">Comments</h1>
                </div>

                <div className="w-full flex flex-col items-start justify-start">
  {fetchingComments ? (
    <div className="w-full flex flex-col items-center justify-center gap-4">
      <h1 className="text-lg font-bold text-gray-400">Loading Comments</h1>
      <PropagateLoader />
    </div>
  ) : (
    <>
      {!feedback || feedback.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        feedback
          .filter(comment => comment && comment.comment && comment.comment.trim() !== "")
          .map(comment => (
            <div key={comment._id} className="flex flex-col mb-6 w-full">
              <div className="flex flex-row gap-4 mb-4">
                <div className="flex h-full">
                  <img
                    src={profileIcons[comment?.userInfo?.profileIcon || 'empty_profile']}
                    alt="User Icon"
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-md font-semibold">{comment?.userInfo?.name || 'Anonymous'}</h3>
                  <p className="text-sm text-gray-500">{comment?.userInfo?.email || ''}</p>
                </div>
                <div className="flex items-center justify-center ml-2">
                  <div className="dropdown">
                    <div tabIndex={0} role="button" className="cursor-pointer">
                      {comment.hidden ? (
                        <EyeOff size={16} className="text-gray-500" />
                      ) : (
                        <Eye size={16} className="text-gray-500" />
                      )}
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu bg-white rounded-box z-30 w-52 p-2 shadow-sm cursor-pointer"
                      onClick={() => hideUserComment(comment._id)}
                    >
                      <li>{!comment.hidden ? "Hide Comment" : "Unhide Comment"}</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <div className="w-full">
                  <h1 className={`text-lg ${comment.hidden ? 'text-gray-400' : ''}`}>
                    {comment.comment}
                  </h1>
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <h3 className="text-sm text-gray-700">
                  Rating: {!comment.rating ? "None" : `${comment.rating}`}
                </h3>
                <p className="text-sm text-gray-700">
                  {new Date(comment.createdAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </p>
              </div>
            </div>
          ))
      )}
    </>
  )}
</div>


              </div>
            )}
          </div>
        </dialog>
      );
});

export default ModalViewGuide;