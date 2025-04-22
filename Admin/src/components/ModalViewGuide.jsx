import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import axios from 'axios';
import PropagateLoader from 'react-spinners/PropagateLoader';
import { X, ShieldQuestion } from 'lucide-react';

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

// Using forwardRef to make the modal accessible from parent components
const ModalViewGuide = forwardRef(({ guideID }, ref) => {
    const dialogRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    
    
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

    const [guide, setGuide] = useState(null);
    const [poster, setPoster] = useState(null);
    const [feedback, setFeedback] = useState([]);
    const [feedbackUsers, setFeedbackUsers] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const getGuide = async () => {
        try {
            setLoading(true);
           
            const res = await axios.get(`${import.meta.env.VITE_URI}guide/${guideID}`);
            console.log(res.data.data);
            setGuide(res.data.data[0]);
        } catch (error) {
            console.error(error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const getUserData = async () => {
        try {
            const getPoster = await axios.get(`${import.meta.env.VITE_URI}user/${guide.userID}`);
            setPoster(getPoster.data.data);
            console.log(getPoster.data.data);
         } catch (error) {
            console.error(error);
            setError(true);
         }
    };

    const getFeedback = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`${import.meta.env.VITE_URI}guide/getFeedback/${guideID}`);
          console.log(res.data.data);
          setFeedback(res.data.data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
    }

    const getFeedbackUserData = async () => {
        try {
            const userIDs = feedback.map(item => item.userId);
            const uniqueUserIDs = [...new Set(userIDs)];
    
            const userPromises = uniqueUserIDs.map(userId => axios.get(`${import.meta.env.VITE_URI}user/${userId}`));
            const userResponses = await Promise.all(userPromises);
    
            const usersData = userResponses.reduce((acc, response) => {
                acc[response.data.data._id] = response.data.data;
                return acc;
            }, {});
            
            console.log(usersData);
            setFeedbackUsers(usersData);
        } catch (error) {
            console.log(error);
        }
    }
    
    const calculateAverageRating = () => {
        if (!feedback || feedback.length === 0) {
          return { rating: 0, count: 0 };
        }
    
        const totalRating = feedback.reduce((sum, item) => sum + item.rating, 0);
        const averageRating = totalRating / feedback.length;
        const roundedRating = Math.round(averageRating * 2) / 2;
    
        return { 
          rating: averageRating, 
          roundedRating: roundedRating, 
          count: feedback.length 
        };
    };

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



    useEffect(() => {
        if (guide) {
            getUserData();
        }
    }, [guide]);      

    useEffect(() => {
        if (guide && guide._id) {
            getFeedback();
        }
    }, [guide]);

    useEffect(() => {
        if (feedback.length > 0) {
            getFeedbackUserData(); 
        }
    }, [feedback]);

    useEffect(() => {
        if (isOpen) {
            getGuide();
        }
    }, [isOpen, guideID]);

    return  (
        <dialog
            ref={dialogRef}
            className="pb-6 pt-2 w-[60%] max-w-[90vw] max-h-[90%] rounded-lg text-start bg-white shadow-lg backdrop:bg-black/50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-auto"
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
                {loading ? (
                    <div className="w-full h-48 flex items-center justify-center flex-col gap-4">
                        <h1 className="text-2xl font-bold">Loading...</h1>
                        <PropagateLoader color="#36d7b7" size={15} />
                    </div>
                ) : error ? (
                    <div className="w-full h-48 flex items-center justify-center flex-col gap-4">
                        <ShieldQuestion size={50} color="#3B40E8" />
                        <h1 className="text-2xl font-bold">Something went wrong</h1>
                    </div>
                ) : guide ? (
                    <div className="w-full">
                        <div className="w-full h-auto flex flex-col items-center justify-center">
                            <h2 className="text-4xl font-bold mb-4">{guide.title}</h2>
                        </div>

                        <div className="w-full h-auto flex flex-row gap-4 items-center justify-start mb-4 mt-4">
                            <div className="avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        src={poster && poster.profileIcon ? profileIcons[poster.profileIcon] : profileIcons['empty_profile']}
                                        alt="Poster profile"
                                    />
                                </div>
                            </div>
                            <h1 className="text-xl font-bold text-gray-600">{guide.uploaderName}</h1>
                        </div>

                        <div className="w-full h-auto flex flex-col items-center justify-center">
                            <span>{guide.description}</span>
                        </div>

                        <div className="w-full h-[2px] bg-gray-400 mt-4 mb-4" />

                        <div className="w-full h-auto px-12 flex flex-col gap-4 items-center justify-center mb-12">
                            <img
                                src={guide.coverImg.url}
                                alt="Guide Cover"
                                className="w-full h-auto object-contain rounded-lg"
                            />
                        </div>

                        {guide.category !== 'tool' && (
                            <div className="w-full h-auto flex flex-col items-center justify-center">
                                <h2 className="text-2xl font-bold mb-4">Tools</h2>
                                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                                    {guide.toolsNeeded.map((material, index) => (
                                        <div key={index} className="h-auto flex items-center justify-center">
                                            <p className="text-lg whitespace-nowrap text-center">{material}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {guide.category === 'diy' || guide.category === 'cooking' ? (
                            <div className="w-full h-auto flex flex-col items-start justify-center">
                                <h2 className="text-xl font-bold mb-4">
                                    {guide.category === 'diy' ? 'Materials' : 'Ingredients'}
                                </h2>
                            </div>
                        ) : null}

                        <div className="w-full h-auto flex flex-col items-center justify-center mt-8">
                            <h2 className="text-2xl font-bold mb-4">Procedures</h2>
                        </div>

                        {guide.stepTitles && guide.stepTitles.length > 0 ? (
                            guide.stepTitles.map((title, index) => (
                                <div key={index} className="w-full h-auto flex flex-col gap-4 mt-12 items-start justify-center mb-16">
                                    <div className="w-auto h-auto flex flex-col gap-6">
                                        <div className="flex items-center gap-4">
                                            <span className="bg-gray-200 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                                                {index + 1}
                                            </span>
                                            <h1 className="text-2xl font-semibold">{title}</h1>
                                        </div>

                                        {guide.stepImg && guide.stepImg[index] && guide.stepImg[index].url && (
                                            <img
                                                src={guide.stepImg[index]?.url}
                                                alt={`Step ${index + 1}`}
                                                className="w-3/4 h-auto object-contain rounded-lg"
                                            />
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
                            <p className="text-base text-center">{guide.closingMessage}</p>
                        </div>

                        <div className="w-full h-16 flex flex-col items-center justify-center">
                            <h1 className="text-4xl font-bold">Additional Links</h1>
                        </div>

                        <div className="w-full h-auto flex flex-col gap-4 mt-4 items-center justify-center mb-24">
                            {guide.additionalLink &&
                                guide.additionalLink.split(/[\s\n]+/).map((link, index) => {
                                    const cleanLink = link.trim();
                                    if (cleanLink && (cleanLink.includes('http') || cleanLink.includes('www'))) {
                                        return (
                                            <a
                                                key={index}
                                                href={cleanLink.startsWith('http') ? cleanLink : `https://${cleanLink}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 hover:underline text-base w-full text-center"
                                            >
                                                {cleanLink}
                                            </a>
                                        );
                                    }
                                    return null;
                                })}
                        </div>

                        <div className="w-full h-16 flex flex-col items-center justify-center">
                            <h1 className="text-4xl font-bold">Reviews</h1>
                        </div>

                        <div className="w-full flex flex-col items-center justify-center gap-2 mb-12">
                            {guide && (() => {
                                const ratingData = calculateAverageRating();
                                return (
                                    <>
                                        <div className="rating rating-xl rating-half pointer-events-none">
                                            <input type="radio" name="rating-display" className="rating-hidden" defaultChecked={ratingData.roundedRating === 0} />
                                            <input type="radio" name="rating-display" className="mask mask-star-2 mask-half-1 bg-primary" defaultChecked={ratingData.roundedRating === 0.5} />
                                            <input type="radio" name="rating-display" className="mask mask-star-2 mask-half-2 bg-primary" defaultChecked={ratingData.roundedRating === 1.0} />
                                            <input type="radio" name="rating-display" className="mask mask-star-2 mask-half-1 bg-primary" defaultChecked={ratingData.roundedRating === 1.5} />
                                            <input type="radio" name="rating-display" className="mask mask-star-2 mask-half-2 bg-primary" defaultChecked={ratingData.roundedRating === 2.0} />
                                            <input type="radio" name="rating-display" className="mask mask-star-2 mask-half-1 bg-primary" defaultChecked={ratingData.roundedRating === 2.5} />
                                            <input type="radio" name="rating-display" className="mask mask-star-2 mask-half-2 bg-primary" defaultChecked={ratingData.roundedRating === 3.0} />
                                            <input type="radio" name="rating-display" className="mask mask-star-2 mask-half-1 bg-primary" defaultChecked={ratingData.roundedRating === 3.5} />
                                            <input type="radio" name="rating-display" className="mask mask-star-2 mask-half-2 bg-primary" defaultChecked={ratingData.roundedRating === 4.0} />
                                            <input type="radio" name="rating-display" className="mask mask-star-2 mask-half-1 bg-primary" defaultChecked={ratingData.roundedRating === 4.5} />
                                            <input type="radio" name="rating-display" className="mask mask-star-2 mask-half-2 bg-primary" defaultChecked={ratingData.roundedRating === 5.0} />
                                        </div>
                                        <span className="text-sm">{ratingData.rating.toFixed(1)} ({ratingData.count} reviews)</span>
                                    </>
                                );
                            })()}
                        </div>

                        <div className="w-full h-auto flex flex-col gap-4 mb-12">
                            {feedback.map((comment) => {
                            const user = feedbackUsers[comment.userId];
                            if (!user) return null;
                            console.log('Rating:', comment.rating);
                            console.log('Commemt:', comment.comment);
                            console.log('Feedback:', comment);

                            if (!comment.comment || comment.comment.trim() === '') {
                                return null; // Skip rendering if the comment is empty
                            }

                            return (
                                <>
                                <div className='flex flex-col mb-6 max-w-1/2'>
                                    <div key={comment._id} className="flex flex-row gap-4 mb-6">
                                        <div className="flex h-full">
                                            <img
                                            src={profileIcons[user.profileIcon]} // Use the profile icon from the mapping
                                            alt="User Icon"
                                            className="w-12 h-12 rounded-full"
                                            />
                                        </div>
                                        <div className="flex flex-row h-4">
                                            <div className="flex flex-col h-4">
                                                <h3 className='text-md font-semibold'>{user.firstName} {user.lastName}</h3>
                                                <p className='text-sm text-gray-500'>{user.email}</p>
                                            </div>
                                        </div>
                                    
                                    </div>
                                    <div className="flex flex-row gap-4">
                                        <div>
                                            <h1 className={`text-lg ${comment.hidden && ('text-gray-400')}`}>{!comment.hidden ? (comment.comment) : ("This comment has been hidden for inappropriate content.")}</h1>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-4">
                                        <h3 className='text-sm text-gray-700'>Rating: {comment.rating}</h3>
                                        <p className='text-sm text-gray-700'>{new Date(comment.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                                </>
                            );
                            })}
                        </div>
                    </div>
                ) : null}
            </div>
        </dialog>
    );
});

export default ModalViewGuide;