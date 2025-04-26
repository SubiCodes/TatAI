import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'

import { Star,  MessageSquareText, Eye, EyeOff} from 'lucide-react'
import ModalViewGuide from '../../components/ModalViewGuide.jsx';
import ModalConfirmReusable from '../../components/ModalConfirmReusable.jsx';

import empty_profile from '../../Images/profile-icons/empty_profile.png'
import boy_1 from '../../Images/profile-icons/boy_1.png'
import boy_2 from '../../Images/profile-icons/boy_2.png'
import boy_3 from '../../Images/profile-icons/boy_3.png'
import boy_4 from '../../Images/profile-icons/boy_4.png'
import girl_1 from '../../Images/profile-icons/girl_1.png'
import girl_2 from '../../Images/profile-icons/girl_2.png'
import girl_3 from '../../Images/profile-icons/girl_3.png'
import girl_4 from '../../Images/profile-icons/girl_4.png'
import lgbt_1 from '../../Images/profile-icons/lgbt_1.png'
import lgbt_2 from '../../Images/profile-icons/lgbt_2.png'
import lgbt_3 from '../../Images/profile-icons/lgbt_3.png'
import lgbt_4 from '../../Images/profile-icons/lgbt_4.png'

import axios from 'axios'
import PropagateLoader from 'react-spinners/PropagateLoader.js';

function ViewAccount() {
    const { id } = useParams();

    const deleteGuideRef = useRef();
    const openGuideRef = useRef();

    const [loading, setLoading] = useState(true);
    const [fetchingComments, setFetchingComments] = useState(true);
    const [activePage, setActivePage] = useState('guides');

    const [guides, setGuides] = useState();
    const [comments, setComments] = useState();
    const [selectedGuide, setSelectedGuide] = useState();
    const [selectedGuideImgs, setSelectedGuideImgs] = useState();
    const [user, setUser] = useState();

    const getUser = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`${import.meta.env.VITE_URI}user/${id}`);
          setUser(res.data.data);
          console.log(res.data.data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    const getGuide = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`${import.meta.env.VITE_URI}guide/user-guides/${id}`);
          setGuides(res.data.data);
          console.log(res.data.data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    const getComments = async () => {
        try {
            setFetchingComments(true);
            const res = await axios.get(`${import.meta.env.VITE_URI}guide/getUserFeedback/${id}`);
            setComments(res.data.data);
            console.log(res.data.data);
        } catch (error) {
          console.error(error);
        } finally {
            setFetchingComments(false);
        }
      };

    const hideComment = async (commentId) => {
        try {
            setFetchingComments(true);
            const res = await axios.put(`${import.meta.env.VITE_URI}guide/hideFeedback/${commentId}`);
            getComments();
            console.log(res.data.data);
        } catch (error) {
            console.log(error);
        } finally {
            setFetchingComments(false);
        }
    };      

    const deleteGuide = async () => {
        try {
        for (const imageID of selectedGuideImgs) {
            try {
            const deleteRes = await axios.post(`${import.meta.env.VITE_URI}guide/deleteImage`, { public_id: imageID });
            console.log(deleteRes.data); // Log the result of the deletion
            } catch (deleteError) {
            console.error('Error deleting image:', deleteError);
            }
        }
        const res = await axios.post(`${import.meta.env.VITE_URI}guide/${selectedGuide?._id}`);
        console.log(res.data.data);
        return `Successfully deleted ${selectedGuide?.title} by ${selectedGuide?.posterInfo.name}`
        } catch (error) {
        console.error(error);
        return `Something went wrong while deleting ${selectedGuide?.title} by ${selectedGuide?.posterInfo.name}`
        }
    };

    

    const openDeleteRef = () => {
        deleteGuideRef.current.open();
    };
    
    const openViewRef = () => {
        openGuideRef.current.open();
    };

    useEffect(() => {
        getGuide();
        getUser();
        getComments();
    }, [])

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

      if (loading) {
        return (
            <div className='w-screen h-screen flex flex-col items-center justify-center gap-4'>
                <h1 className='text-4xl'>
                    Fetching data
                </h1>
                <PropagateLoader/>
            </div>
        )
      }

      return (
        <div className='w-screen h-screen flex items-center justify-center overflow-auto bg-[#F5F7FA]'>
          <div className='w-[70%] h-full flex flex-col'>
      
            {/* Top User Info Section */}
            <div className='w-full h-auto flex flex-row gap-16 px-6 py-10 border-b-1 border-gray-300'>
              <div className='w-auto h-auto flex flex-col items-center justify-center gap-6'>
                <img src={profileIcons[user?.profileIcon]} className='max-w-28 h-auto' />
                <div className='w-full flex flex-row gap-2'>
                  <h1 className='text-base font-bold text-gray-600'>Date joined: </h1>
                  <h1 className='text-base font-light'>
                    {new Date(user?.createdAt).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </h1>
                </div>
              </div>
      
              <div className='flex flex-col justify-center'>
                <div className='flex flex-row gap-2'>
                  <h1 className='text-base font-bold text-gray-600 w-22'>Username: </h1>
                  <h1 className='text-base font-light'>{`${user?.firstName} ${user?.lastName}`}</h1>
                </div>
                <div className='flex flex-row gap-2'>
                  <h1 className='text-base font-bold text-gray-600 w-22'>Email: </h1>
                  <h1 className='text-base font-light'>{user?.email}</h1>
                </div>
                <div className='flex flex-row gap-2'>
                  <h1 className='text-base font-bold text-gray-600 w-22'>Birthday: </h1>
                  <h1 className='text-base font-light'>
                    {user?.birthday && new Date(user.birthday).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </h1>
                </div>
                <div className='flex flex-row gap-2'>
                  <h1 className='text-base font-bold text-gray-600 w-22'>Gender: </h1>
                  <h1 className='text-base font-light'>{user?.gender}</h1>
                </div>
              </div>
            </div>
      
            {/* Tabs */}
            <div className='w-full h-10 flex flex-row justify-between items-center mt-4 mb-12'>
              <div className='flex flex-col items-center justify-center w-1/2 gap-2 cursor-pointer' onClick={() => { setActivePage('guides') }}>
                <h1 className={`text-base font-bold ${activePage === 'guides' ? 'text-primary' : 'text-gray-600'}`}>Guides</h1>
                {activePage === 'guides' && <div className='w-1/2 h-[1px] bg-primary' />}
              </div>
              <div className='flex flex-col items-center justify-center w-1/2 gap-2 cursor-pointer' onClick={() => { setActivePage('comments') }}>
                <h1 className={`text-base font-bold ${activePage === 'comments' ? 'text-primary' : 'text-gray-600'}`}>Comments</h1>
                {activePage === 'comments' && <div className='w-1/2 h-[1px] bg-primary' />}
              </div>
            </div>
      
            {/* Main Content */}
            <div className='w-full h-auto flex flex-row flex-wrap gap-4 justify-center p-2'>
              {activePage === 'guides' ? (
                guides?.length < 1 ? (
                  <h1 className='text-xl text-gray-400'>This user has not posted any guides yet.</h1>
                ) : (
                  <div className="w-full h-auto flex flex-row flex-wrap justify-start items-start gap-2">
                    {guides?.map((guide) => {
                      const coverImgPublicId = guide.coverImg.public_id;
                      const stepImgPublicIds = guide.stepImg && Array.isArray(guide.stepImg)
                        ? guide.stepImg.map(img => img.public_id)
                        : [];
                      const imageIDs = coverImgPublicId
                        ? [coverImgPublicId, ...stepImgPublicIds]
                        : stepImgPublicIds;
      
                      return (
                        <div key={guide._id} className="card bg-gray-50 border-1 border-gray-400 rounded-lg w-72 h-fit shadow-sm hover:shadow-2xl transition-all duration-600 ease-in-out">
                          <figure className="px-6 pt-10 h-64 w-full flex justify-center items-center rounded-xl overflow-hidden">
                            <img
                              src={guide.coverImg.url}
                              alt={guide.title}
                              className="h-full w-full object-contain"
                            />
                          </figure>
      
                          <div className="card-body items-center text-center">
                            <div className='w-full h-[1px] bg-gray-200' />
                            <div className='w-full flex justify-between items-start flex-col h-auto gap-4'>
                              <h2 className="card-title w-full truncate">{guide.title}</h2>
                            </div>
                            <div className='w-full flex justify-start items-start flex-col h-auto gap-2 py-2'>
                              <div className='w-full flex justify-start items-start flex-row gap-4 overflow-ellipsis mb-2'>
                                <p className='text-gray-500 text-md truncate w-full text-start flex flex-row gap-2'>
                                  Posted by: <span className='font-bold'>{guide.posterInfo.name}</span>
                                </p>
                              </div>
      
                              <div className='w-full flex justify-start items-start flex-row gap-4'>
                                <div className='flex flex-row items-center gap-1'>
                                  <Star className='text-primary' size={16} />
                                  <p className='text-md text-gray-500 font-semibold'>{guide.feedbackInfo.averageRating}</p>
                                </div>
                                <div className='flex flex-row items-center gap-1'>
                                  <MessageSquareText className='text-primary' size={16} />
                                  <p className='text-md text-gray-500 font-semibold'>{guide.feedbackInfo.commentCount}</p>
                                </div>
                              </div>
                            </div>
      
                            <div className="w-full flex justify-center items-center mt-4 gap-8">
                              <button
                                className='text-md text-white bg-primary cursor-pointer px-4 py-2 rounded-lg text-xs'
                                onClick={() => {
                                  setSelectedGuide(guide);
                                  openViewRef();
                                }}
                              >
                                View Guide
                              </button>
                              <button
                                className='text-md text-white bg-[#d9534f] cursor-pointer px-4 py-2 rounded-lg text-xs'
                                onClick={() => {
                                  setSelectedGuide(guide);
                                  setSelectedGuideImgs(imageIDs);
                                  openDeleteRef();
                                }}
                              >
                                Delete Guide
                              </button>
                            </div>
      
                            <ModalConfirmReusable
                              ref={deleteGuideRef}
                              title={"Delete Guide"}
                              toConfirm={`Are you sure you want to delete guide '${selectedGuide?.title}' by ${selectedGuide?.posterInfo.name}?`}
                              titleResult={"Deleting guide"}
                              onSubmit={deleteGuide}
                              resetPage={`/view-account/${id}`}
                            />
                            <ModalViewGuide
                              ref={openGuideRef}
                              guideID={selectedGuide?._id}
                              page={`/view-account/${id}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
            ) : (
                comments?.length > 0 ? (
                  comments.map((comment, index) => (
                    <div key={index} className='flex flex-col mb-6 max-w-full self-start w-full pb-5 border-b-1 border-gray-200'>
                      <div className="flex flex-row gap-4 mb-4">
                        <div className="flex h-full">
                          <img
                            src={profileIcons[comment?.userInfo?.profileIcon]}
                            alt="User Icon"
                            className="w-12 h-auto rounded-full"
                          />
                        </div>
                        <div className="flex flex-row h-4">
                          <div className="flex flex-col">
                            <h3 className='text-md font-semibold'>{comment?.userInfo?.name || "John Doe"}</h3>
                            <p className='text-sm text-gray-500'>{comment?.userInfo?.email || "johndoe@example.com"}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-center ml-2">
                                <div className="dropdown">
                                    <div tabIndex={0} role="button" className='cursor-pointer'>
                                    {comment.hidden ? (
                                        <EyeOff size={16} className="text-gray-500" />
                                    ) : (
                                        <Eye size={16} className="text-gray-500" />
                                    )}
                                    </div>
                                    <ul
                                    tabIndex={0}
                                    className="dropdown-content menu bg-white rounded-box z-99 w-52 p-2 shadow-sm cursor-pointer"
                                    onClick={() => hideComment(comment._id)}
                                    >
                                    {!comment.hidden ? "Hide Comment" : "Unhide Comment"}
                                    </ul>
                                </div>
                                </div>
                      </div>
              
                      <div className="flex flex-row gap-4">
                        <div className='w-full'>
                          <h1 className={`text-lg ${comment.hidden ? 'text-gray-400' : ""}`}>
                            {comment?.comment || "This is a mock comment for the feedback system."}
                          </h1>
                        </div>
                      </div>
              
                      <div className="flex flex-row gap-4">
                        <h3 className='text-sm text-gray-700'>
                          Rating: {comment?.rating ? comment.rating : 'None'}
                        </h3>
                        <p className='text-sm text-gray-700'>
                          {new Date(comment?.createdAt || Date.now()).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                          })} {/* Dynamic date */}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <h1 className="text-xl text-gray-400">This user has not posted any comments yet.</h1>
                )
              )}
            </div>
      
          </div>
        </div>
      );
      
}

export default ViewAccount