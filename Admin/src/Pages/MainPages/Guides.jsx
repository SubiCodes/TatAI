import React, { useEffect, useState } from 'react'
import { useRef } from 'react';

import ModalViewGuide from '../../components/ModalViewGuide.jsx';
import { Star, MessageSquareText, SlidersHorizontal, Search } from 'lucide-react';
import PropagateLoader from 'react-spinners/PropagateLoader';
import ModalConfirmReusable from '../../components/ModalConfirmReusable.jsx';

import guideStore from '../../stores/guide.store.js';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

function Guides() {

  const { guides, fetchGuides, deleteGuide, isLoading, error } = guideStore();
  const [admin, setAdmin] = useState();

  const deleteGuideRef = useRef();
  const openGuideRef = useRef();

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [shownGuides, setShownGuides] = useState('all');
  const [isLatestFirst, setIsLatestFirst] = useState(true);
  const [shownGuidesStatus, setShownGuidesStatus] = useState('all');

  const [selectedGuide, setSelectedGuide] = useState(null);
  const [selectedGuideImgs, setSelectedGuideImgs] = useState();


  const filteredGuides = guides?.filter((guide) => {
    if (shownGuides !== 'all' && guide.type !== shownGuides) return false;
    if (shownGuidesStatus !== 'all' && guide.status !== shownGuidesStatus) return false;

    if (searchTerm.trim() !== '') {
      const lowerSearch = searchTerm.toLowerCase();
      const title = guide.title?.toLowerCase() || '';
      const uploader = guide.uploader?.toLowerCase() || '';
      if (!title.includes(lowerSearch) && !uploader.includes(lowerSearch)) return false;
    }

    return true;
  })
    .sort((a, b) => {
      const dateA = new Date(a.upadatedAt);
      const dateB = new Date(b.upadatedAt);
      return isLatestFirst ? dateB - dateA : dateA - dateB;
    });

  const openDeleteRef = () => {
    deleteGuideRef.current.open();
  };

  const openViewRef = () => {
    openGuideRef.current.open();
  };

  const handleDeleteGuide = async () => {
    const res = await deleteGuide(selectedGuide, selectedGuideImgs);
    console.log(res);
    // Reset selection after deletion
    setSelectedGuide(null);
    setSelectedGuideImgs([]);
    return res;
  };

  const getDatas = async () => {
    try {
      console.log('api called', `${import.meta.env.VITE_URI}admin/admin-data`);
      const res = await axios.get(`${import.meta.env.VITE_URI}admin/admin-data`, {
        withCredentials: true,
      });
      console.log(res.data.data)
      setAdmin(res.data.data);
      fetchGuides();
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    getDatas();
  }, [fetchGuides]);

  if (isLoading) {
    <div className='w-full h-full flex flex-col justify-center items-center gap-4'>
      <h1 className='text-2xl font-bold'>Fetching Guides</h1>
      <PropagateLoader color="#3B82F6" size={18} className='ml-4' />
    </div>
  }


  if (error) {
    <div className='w-full h-full flex flex-col justify-center items-center gap-4'>
      <h1 className='text-2xl font-bold'>Error Fetching Guides</h1>
      <h1 className='text-lg text-red-400 font-bold'></h1>
    </div>
  }

  return (
    <div className='w-full h-full p-8 bg-[#F5F7FA] overflow-auto flex flex-col gap-8'>

      <div className='w-full flex flex-row justify-between items-center'>
        <h1 className='text-2xl font-bold'>Guides</h1>
        <button className='text-md text-white bg-primary cursor-pointer px-4 py-2 rounded-lg' onClick={() => navigate('/add-guide')}>
          Create New Guide
        </button>
      </div>


      <>
        <div className="w-sm flex items-center border border-gray-400 rounded-lg px-4">
          <Search className="mr-2" />
          <input
            type="text"
            placeholder="Search Guides"
            className="input input-lg w- border-0 rounded-lg placeholder-gray-500"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className='w-full flex flex-row justify-start items-center gap-4'>

          <div className='flex flex-row items-center gap-2'>
            <div className="dropdown">
              <div tabIndex={0} role="button" className="cursor-pointer rounded-lg"><SlidersHorizontal size={18} /></div>
              <ul tabIndex={0} className="dropdown-content menu rounded-box w-52 p-2 shadow-sm z-50 bg-white">
                <div className='w-full flex flex-col justify-between items-center px-2 py-2'>

                  <div className='w-full flex justify-between items-start flex-col h-auto gap-4 py-2'>
                    <h1 className='text-md font-semibold text-start'>Filter by date</h1>
                    <div className='w-full flex justify-start items-start flex-col gap-4 overflow-ellipsis '>
                      <div className='flex flex-row items-center gap-2'>
                        <input
                          type="radio"
                          name="radio-3"
                          className="radio radio-xs border-1"
                          checked={isLatestFirst}
                          onChange={() => setIsLatestFirst(true)}
                        />
                        <p className="capitalize">Latest First</p>
                      </div>
                      <div className='flex flex-row items-center gap-2'>
                        <input
                          type="radio"
                          name="radio-3"
                          className="radio radio-xs border-1"
                          checked={!isLatestFirst}
                          onChange={() => setIsLatestFirst(false)}
                        />
                        <p className="capitalize">Latest Last</p>
                      </div>
                    </div>
                  </div>

                  <div className='w-full h-[1px] bg-gray-200' />

                  <div className='w-full flex justify-between items-start flex-col h-auto gap-4 py-2'>
                    <h1 className='text-md font-semibold text-start'>Filter by status</h1>
                    <div className='w-full flex justify-start items-start flex-col gap-4 overflow-ellipsis '>
                      {['all', 'accepted', 'rejected', 'pending'].map((status) => (
                        <div key={status} className='flex flex-row items-center gap-2'>
                          <input
                            type="radio"
                            name="radio-4"
                            className="radio radio-xs border-1"
                            checked={shownGuidesStatus === status}
                            onChange={() => setShownGuidesStatus(status)}
                          />
                          <p className="capitalize">{status}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </ul>
            </div>
          </div>
          {['all', 'repair', 'tool', 'diy'].map((type) => (
            <div key={type} className="flex flex-row items-center gap-2">
              <input
                type="radio"
                name="radio-1"
                value={type}
                checked={shownGuides === type}
                onChange={() => setShownGuides(type)}
                className="radio radio-xs border-1"
              />
              <p className="capitalize">{type}</p>
            </div>
          ))}
        </div>
        <div className='w-full h-full mt-4 flex flex-row flex-wrap gap-4 justify-start mb-96'>

          {filteredGuides.map((guide) => {


            const coverImgObj = guide.coverImg
              ? { url: guide.coverImg.url, public_id: guide.coverImg.public_id }
              : null;

            const stepImgObjs = Array.isArray(guide.stepImg)
              ? guide.stepImg.map(img => ({ url: img.url, public_id: img.public_id }))
              : [];

            const imageData = coverImgObj ? [coverImgObj, ...stepImgObjs] : stepImgObjs;

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
                    <h2 className="card-title w-full truncate text-center">{guide.title}</h2>
                  </div>
                  <div className='w-full flex justify-between items-start flex-col h-auto gap-2 py-2'>

                    <div className='w-full flex justify-start items-start flex-row gap-4 overflow-ellipsis mb-2'>
                      <p className='text-gray-500 text-md truncate w-full text-start flex flex-row gap-2'>Posted by: <p className='font-bold'>{guide?.posterInfo?.name}</p></p>
                    </div>

                    <div className='w-full flex justify-start items-start flex-row gap-4'>

                      <div className='flex flex-row items-center gap-1'>
                        <Star className='text-primary' size={16} />
                        <p className='text-md text-gray-500 font-semibold'>{guide.feedbackInfo?.averageRating}</p>
                      </div>
                      <div className='flex flex-row items-center gap-1'>
                        <MessageSquareText className='text-primary' size={16} />
                        <p className='text-md text-gray-500 font-semibold'>{guide.feedbackInfo?.commentCount}</p>
                      </div>

                    </div>

                  </div>

                  <div className="w-full flex justify-center items-center mt-4 gap-8">
                    {admin?.role === "super admin" || guide.userID === admin?._id ? (
                      <>
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
                            setSelectedGuideImgs(imageData);
                            openDeleteRef();
                          }}
                        >
                          Delete Guide
                        </button>
                      </>
                    ) : (
                      <button
                        className='w-full text-md text-white bg-primary cursor-pointer px-4 py-2 rounded-lg text-xs'
                        onClick={() => {
                          setSelectedGuide(guide);
                          openViewRef();
                        }}
                      >
                        View Guide
                      </button>
                    )}
                  </div>
                </div>
                <ModalConfirmReusable
                  ref={deleteGuideRef}
                  title={"Delete Guide"}
                  toConfirm={`Are you sure you want to delete guide '${selectedGuide?.title}' by ${selectedGuide?.posterInfo.name}?`}
                  titleResult={"Guide Deleted"}
                  onSubmit={handleDeleteGuide}
                />
                <ModalViewGuide ref={openGuideRef} guideID={selectedGuide?._id} page={`/pending-guides`} />
              </div>
            );
          })}

        </div>
      </>

    </div>
  )
}

export default Guides