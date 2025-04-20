import React, { useEffect, useState } from 'react'
import { useRef } from 'react';

import ModalAddGuide from '../../components/ModalAddGuide.jsx'
import { Star, MessageSquareText, SlidersHorizontal, Search } from 'lucide-react';
import axios from 'axios';
import PropagateLoader from 'react-spinners/PropagateLoader';

function Guides() {

  const addGuideRef = useRef();

  const [loading, setLoading] = useState(true);
  const [guides, setGuides] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [shownGuides, setShownGuides] = useState('all');
  const [isLatestFirst, setIsLatestFirst] = useState(true);
  const [shownGuidesStatus, setShownGuidesStatus] = useState('all');

  const getGuide = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_URI}guide/guides`);
      console.log(res.data.data);
      setGuides(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGuides = guides
  .filter((guide) => {
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
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return isLatestFirst ? dateB - dateA : dateA - dateB;
  });

  

  useEffect(() => {
    getGuide();
  }, [])

  return (
    <div className='w-full h-full p-8 bg-[#F5F7FA] overflow-auto flex flex-col gap-8'>

      <div className='w-full flex flex-row justify-between items-center'>
        <h1 className='text-2xl font-bold'>Guides</h1>
        <button className='text-md text-white bg-primary cursor-pointer px-4 py-2 rounded-lg' onClick={() => addGuideRef.current.open()}>
          Create New Guide
        </button>
      </div>

      {loading ? (
        <div className='w-full h-full flex flex-col justify-center items-center gap-4'>
          <h1 className='text-2xl font-bold'>Fetching Guides</h1>
          <PropagateLoader color="#3B82F6" size={18} className='ml-4' />
        </div>
      ) : (
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
              <div tabIndex={0} role="button" className="cursor-pointer rounded-lg"><SlidersHorizontal size={18}/></div>
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
                    {['all', 'accepted', 'pending'].map((status) => (
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
            {['all', 'repair', 'tool', 'diy', 'cooking'].map((type) => (
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
            const feedback = guide.feedBack || [];
            const numFeedbacks = feedback.length;
            const totalRating = feedback.reduce((sum, item) => sum + (item.rating || 0), 0);
            const avgRating = numFeedbacks > 0 ? (totalRating / numFeedbacks).toFixed(1) : "0.0";
            return (
            <div key={guide._id} className="card bg-gray-50 w-full sm:w-96 md:w-80 lg:w-76 h-fit shadow-sm hover:shadow-2xl transition-all duration-600 ease-in-out">
              <figure className="px-6 pt-10 h-64 w-full flex justify-center items-center rounded-xl overflow-hidden">
                <img
                  src={guide.coverImg}
                  alt={guide.title}
                  className="h-full w-full object-contain"
                />
              </figure>
              

              <div className="card-body items-center text-center">
              <div className='w-full h-[1px] bg-gray-200'/>
                <div className='w-full flex justify-between items-start flex-col h-auto gap-4'>
                  <h2 className="card-title">{guide.title}</h2>
                </div>
                <div className='w-full flex justify-between items-start flex-col h-auto gap-2 py-2'>

                  <div className='w-full flex justify-start items-start flex-row gap-4 overflow-ellipsis '>
                    <p className='text-gray-500 text-md truncate w-full text-start'>{guide.uploader}</p>
                  </div>

                  <div className='w-full flex justify-start items-start flex-row gap-4'>

                    <div className='flex flex-row items-center gap-1'>
                      <Star className='text-primary' size={16}/>
                      <p className='text-md text-gray-500 font-semibold'>{avgRating}</p>
                    </div>
                    <div className='flex flex-row items-center gap-1'>
                      <MessageSquareText className='text-primary' size={16}/>
                      <p className='text-md text-gray-500 font-semibold'>{numFeedbacks}</p>
                    </div>

                  </div>
                    
                </div>
                
                <div className="w-full flex justify-center items-center mt-4 gap-8">
                  <button className='text-md text-white bg-primary cursor-pointer px-4 py-2 rounded-lg'>
                    View Guide
                  </button>
                  <button className='text-md text-white bg-[#d9534f] cursor-pointer px-4 py-2 rounded-lg'>
                    Delete Guide
                  </button>
                </div>
              </div>
            </div>
             );
          })}

        </div>
        </>
      )}
      <ModalAddGuide ref={addGuideRef} titleResult={"Guide post result"}/>
    </div>
  )
}

export default Guides