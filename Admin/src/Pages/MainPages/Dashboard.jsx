import ReactECharts from 'echarts-for-react';

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
// Using forwardRef to make the modal accessible from paren

import { Star, MessageSquareText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import PropagateLoader from "react-spinners/PropagateLoader.js";
import ModalViewComments from '../../components/ModalViewComments.jsx';
import ModalViewGuide from '../../components/ModalViewGuide.jsx';
import ModalConfirmReusable from '../../components/ModalConfirmReusable.jsx';

function Dashboard() {

    const navigate = useNavigate();
    const commentsRef = useRef();
    const openGuideRef = useRef();
    const deleteGuideRef = useRef();

    //Dependency States
    const [fetchingData, setFetchingData] = useState(false);
    const [errorFetching, setErrorFetching] = useState(false);
  
    //Data States
    const [userGuideCount, setUserGuideCount] = useState();
    const [liveGuideCount, setLiveGuideCount] = useState();
    const [ratingsCount, setRatingsCount] = useState();
    const roundedRating = Number(ratingsCount?.roundedRating);
    const [latestFeedback, setLatestFeedback] = useState();
    const [latestGuides, setLatestGuides] = useState();
    const [selectedGuide, setSelectedGuide] = useState();
    const [selectedGuideImgs, setSelectedGuideImgs] = useState();

    //action functions
    const openViewRef = () => {
      openGuideRef.current.open();
    };
    const openDeleteRef = () => {
      deleteGuideRef.current.open();
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

    //Data Fetch
    const getUserGuideCount = async () => {
      try {
        setFetchingData(true);
        const res = await axios.get(`${import.meta.env.VITE_URI}admin/user-guide-count`);
        console.log(res.data.data);
        setUserGuideCount(res.data.data);
      } catch (error) {
        console.log(error.message);
        setErrorFetching(true);
      } finally {
        setFetchingData(false)
      }
    };
  
    const getLiveGuideCount = async () => {
      try {
        setFetchingData(true);
        const res = await axios.get(`${import.meta.env.VITE_URI}admin/live-guide-count`);
        console.log(res.data.data);
        setLiveGuideCount(res.data.data);
      } catch (error) {
        console.log(error.message);
        setErrorFetching(true);
      } finally {
        setFetchingData(false)
      }
    };

    const getRatingsCount = async () => {
      try {
        setFetchingData(true);
        const res = await axios.get(`${import.meta.env.VITE_URI}admin/guide-ratings`);
        console.log(res.data.data);
        setRatingsCount(res.data.data);
      } catch (error) {
        console.log(error.message);
        setErrorFetching(true);
      } finally {
        setFetchingData(false)
      }
    };

    const getLatestFeedback = async () => {
      try {
        setFetchingData(true);
        const res = await axios.get(`${import.meta.env.VITE_URI}admin/latest-feedback`);
        console.log(res.data.data);
        setLatestFeedback(res.data.data);
      } catch (error) {
        console.log("Could not fetch latest feedback:", error.message);
    
        // Optional: Only set error if it's not 404
        if (error.response?.status !== 404) {
          setErrorFetching(true);
        }
    
        // Still clear latest feedback on 404
        setLatestFeedback([]);
      } finally {
        setFetchingData(false);
      }
    };

    const getLatestGuide = async () => {
      try {
        setFetchingData(true);
        const res = await axios.get(`${import.meta.env.VITE_URI}admin/latest-guides`);
        console.log("Latest guides:", res.data.data);    
        setLatestGuides(res.data.data);
      } catch (error) {
        console.log("Error fetching guides:", error.message);
        setErrorFetching(true);
      } finally {
        setFetchingData(false); // Ensure this is called even in case of errors
      }
    };

    //UseEffect Calls
    useEffect(() => {
      getUserGuideCount();
      getLiveGuideCount();
      getRatingsCount();
      getLatestFeedback();
      getLatestGuide();
    }, []);


  
  //Options and Config

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

  const optionPie = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '-5',
      left: 'center'
    },
    series: [
      {
        name: 'Total',
        type: 'pie',
        radius: ['80%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 0,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: false,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: liveGuideCount?.diy, name: 'DIY', itemStyle: { color: '#41b8d5' }},
          { value: liveGuideCount?.repair, name: 'Repair', itemStyle: { color: '#2d8bba' } },
          { value: liveGuideCount?.cooking, name: 'Cooking', itemStyle: { color: '#6ce5e8' }},
          { value: liveGuideCount?.tool, name: 'Tools', itemStyle: { color: '#506e9a' }}
        ]
      }
    ]
  };

  const optionBar = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'Direct',
        type: 'bar',
        barWidth: '60%',
        data: [10, 52, 200, 334, 390, 330, 220],
        itemStyle: {
          color: '#2d8bba'
        }
      }
    ]
  };
  const optionBar2 = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
     {
      type: 'value'
     }
    ],
    yAxis: [
      {
        type: 'category',
        data: ['1', '2', '3', '4', '5'],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    series: [
      {
        name: 'Count',
        type: 'bar',
        barWidth: '60%',
        data: [ratingsCount?.one, ratingsCount?.two, ratingsCount?.three, ratingsCount?.four, ratingsCount?.five],
        itemStyle: {
          color: '#2d8bba'
        }
      }
    ]
  };


  //State Displays
  if (fetchingData) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Fetching Data</h1>
        <PropagateLoader size={22}/>
      </div>
    )
  }

  if (errorFetching) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl text-red-400 font-bold">Error Fetching Data</h1>
      </div>
    )
  }
    
  return (
    <>
      <div className="flex-1 bg-[#F5F7FA] min-w-200">
        <div className="w-full h-auto items-center justify-center flex flex-col pb-12 bg-[#F5F7FA]"> 

          {/* top data holders */}
          <div className="relative w-full">
            {/* Blue header background */}
            <div className="bg-blue-600 h-36 flex items-start px-6 pt-4 text-white font-semibold text-2xl">
              Dashboard
            </div>

            {/* Cards overlapping the blue section */}
            <div className="absolute w-full h-auto top-20 flex justify-between gap-16 px-36">
              <div className="bg-white shadow-md rounded-lg p-4 w-1/5 h-40 text-center flex flex-col items-center justify-center">
                <div className="text-sm text-gray-600">Registered Users</div>
                <div className="text-2xl font-bold">{userGuideCount?.userTotal}</div>
              </div>
              <div className="bg-white shadow-md rounded-lg p-4 w-1/5 h-40 text-center flex flex-col items-center justify-center">
                <div className="text-sm text-gray-600">Live Guides</div>
                <div className="text-2xl font-bold">{userGuideCount?.liveGuides}</div>
              </div>
              <div className="bg-white shadow-md rounded-lg p-4 w-1/5 h-40 text-center flex flex-col items-center justify-center">
                <div className="text-sm text-gray-600">Pending Guides</div>
                <div className="text-2xl font-bold">{userGuideCount?.pendingGuides}</div>
              </div>
            </div>
          </div>

          {/* Chart section */}
         
          <div className="w-full h-120 flex items-center justify-between mt-22 px-12 pt-12 gap-4">
            <div className="w-3/5 h-full flex flex-col items-center justify-center bg-white shadow-md rounded-lg px-12 py-8 gap-12">
              <h2 className="text-2xl text-start self-start font-bold">App Visits</h2>
              <ReactECharts option={optionBar} style={{ height: '100%', width: '100%' }} />
            </div>
            <div className="w-2/5 h-full p-4 bg-white shadow-md rounded-lg flex flex-col px-12 pt-4 gap-8">
              <h2 className="text-2xl text-start self-start font-bold">Guides</h2>
              <ReactECharts option={optionPie} style={{ height: '100%', width: '100%' }} />
            </div>
          </div>

          <div className="w-full h-160 flex flex-row justify-between mt-4 px-12 pt-0 gap-4">

            <div className="w-2/5 h-full flex flex-col gap-2">

              <div className="w-full h-1/2 flex flex-col  bg-white shadow-md rounded-lg px-6 pt-6">
                <h2 className="text-2xl text-start self-start font-bold mb-4">Ratings</h2>
                <div className="w-full flex flex-col items-center justify-between gap-2">
                <div className="rating rating-lg rating-half h-12 flex items-center">
                  <input type="radio" name="rating-11" className="rating-hidden" checked={roundedRating === 0} readOnly />
                  <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-1 bg-[#2d8bba]" aria-label="0.5 star" checked={roundedRating === 0.5} readOnly />
                  <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-2 bg-[#2d8bba]" aria-label="1 star" checked={roundedRating === 1.0} readOnly />
                  <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-1 bg-[#2d8bba]" aria-label="1.5 star" checked={roundedRating === 1.5} readOnly />
                  <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-2 bg-[#2d8bba]" aria-label="2 star" checked={roundedRating === 2.0} readOnly />
                  <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-1 bg-[#2d8bba]" aria-label="2.5 star" checked={roundedRating === 2.5} readOnly />
                  <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-2 bg-[#2d8bba]" aria-label="3 star" checked={roundedRating === 3.0} readOnly />
                  <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-1 bg-[#2d8bba]" aria-label="3.5 star" checked={roundedRating === 3.5} readOnly />
                  <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-2 bg-[#2d8bba]" aria-label="4 star" checked={roundedRating === 4.0} readOnly />
                  <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-1 bg-[#2d8bba]" aria-label="4.5 star" checked={roundedRating === 4.5} readOnly />
                  <input type="radio" name="rating-11" className="mask mask-star-2 mask-half-2 bg-[#2d8bba]" aria-label="5 star" checked={roundedRating === 5.0} readOnly />
                </div>
                <span className="text-xs font-light">Average Guide Rating: {ratingsCount?.average}</span>
                </div>
                <ReactECharts option={optionBar2} style={{ height: '100%', width: '100%' }} />
              </div>

              <div className="w-full h-1/2 flex flex-col  bg-white shadow-md rounded-lg px-6 py-8 gap-2">
                <h2 className="text-2xl text-start self-start font-bold mb-4">Comments</h2>
                {!latestFeedback ? (
                  <div className='w-full h-full flex items-center justify-center'>
                    <h1 className='text-gray-400'>No comments yet.</h1>
                  </div>
                ) : (
                  
                
                <div className='flex flex-col mb-6 max-w-full'>
                  <div className="flex flex-row gap-4 mb-4">

                    <div className="flex h-full">
                      <img
                        src={profileIcons[latestFeedback?.userInfo.profileIcon]}
                        alt="User Icon"
                        className="w-12 h-auto rounded-full"
                      />
                    </div>
                    <div className="flex flex-row h-4">
                      <div className="flex flex-col">
                        <h3 className='text-md font-semibold'>{`${latestFeedback?.userInfo.name}`}</h3>
                        <p className='text-sm text-gray-500'>{latestFeedback?.userInfo.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row gap-4">
                    <div className='w-full'>
                      <h1 className="text-lg line-clamp-2">{latestFeedback?.comment}</h1>
                    </div>
                  </div>
                  <div className="flex flex-row gap-4">
                    <h3 className='text-sm text-gray-700'>Rating: {!latestFeedback?.rating ? "None" : `${latestFeedback.rating}`} </h3>
                    <p className='text-sm text-gray-700'>{new Date().toLocaleString()}</p>
                  </div>
                </div>
              )}

                <div className='flex-1'/>
                <div className="w-full h-[1px] bg-gray-300"/>
                <span className="text-center text-primary cursor-pointer hover:underline" onClick={() => {commentsRef?.current.open()}}>View All</span>
                <ModalViewComments ref={commentsRef}/>
              </div>
              
            </div>

            <div className="w-full h-full flex flex-col bg-white shadow-md rounded-lg px-12 pt-6 pb-6">
              <h2 className="text-2xl text-start self-start font-bold mb-4">Recently Posted</h2>


              <div className="w-full h-full flex flex-row gap-8 justify-center">
              {latestGuides && latestGuides.map((guide) => {
                 const coverImgPublicId = guide.coverImg.public_id;
                 const stepImgPublicIds = guide.stepImg && Array.isArray(guide.stepImg) ? guide.stepImg.map(img => img.public_id) : [];
                 const imageIDs = coverImgPublicId ? [coverImgPublicId, ...stepImgPublicIds] : stepImgPublicIds;
                return (
                <div key={guide._id} className="card bg-white border-1 border-gray-400 rounded-lg w-72 h-fit shadow-sm hover:shadow-2xl transition-all duration-600 ease-in-out">
                  <figure className="px-6 pt-10 h-64 w-full flex justify-center items-center rounded-xl overflow-hidden">
                    <img
                      src={guide.coverImg.url}
                      alt={guide.title}
                      className="h-full w-full object-contain"
                    />
                  </figure>

                  <div className="card-body items-center text-center">
                    <div className="w-full h-[1px] bg-gray-200" />
                    
                    <div className="w-full flex justify-between items-start flex-col h-auto gap-4">
                      <h2 className="card-title w-full truncate">{guide.title}</h2>
                    </div>

                    <div className="w-full flex justify-between items-start flex-col h-auto gap-2 py-2">
                      <div className="w-full flex justify-start items-start flex-row gap-4 overflow-ellipsis mb-2">
                        <p className="text-gray-500 text-md truncate w-full text-start flex flex-row gap-2">
                          Posted by: <span className="font-bold w-full truncate">{guide.posterInfo.name}</span>
                        </p>
                      </div>

                      <div className="w-full flex justify-start items-start flex-row gap-4">
                        <div className='flex flex-row items-center gap-1'>
                          <Star className='text-primary' size={16}/>
                          <p className='text-md text-gray-500 font-semibold'>{guide.feedbackInfo.averageRating}</p>
                        </div>
                        <div className='flex flex-row items-center gap-1'>
                          <MessageSquareText className='text-primary' size={16}/>
                          <p className='text-md text-gray-500 font-semibold'>{guide.feedbackInfo.commentCount}</p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full flex justify-center items-center mt-4 gap-8">
                      <button className="text-md text-white bg-primary cursor-pointer px-4 py-2 rounded-lg text-xs"  onClick={() => { setSelectedGuide(guide); openViewRef();}}
                      >
                        View Guide
                      </button>
                      <button className="text-md text-white bg-[#d9534f] cursor-pointer px-4 py-2 rounded-lg text-xs" onClick={() => {setSelectedGuide(guide); setSelectedGuideImgs(imageIDs); openDeleteRef();
                      }}>
                        Delete Guide
                      </button>
                    </div>
                  </div>
                  <ModalViewGuide ref={openGuideRef} guideID={selectedGuide?._id} page={`/pending-guides`}/>
                  <ModalConfirmReusable ref={deleteGuideRef} title={"Delete Guide"} toConfirm={`Are you sure you want to delete guide '${selectedGuide?.title}' by ${selectedGuide?.posterInfo.name}?`} titleResult={"Deleting guide"}
                onSubmit={deleteGuide} resetPage={'/dashboard'}/>
                </div>
                );
              })}

              </div>

                <div className="flex-1"/>
                <div className="w-full h-[1px] bg-gray-300"/>
                <span className="text-center text-primary mt-2 cursor-pointer hover:underline" onClick={() => navigate(`/pending-guides`)}>View All</span>

            </div>

          </div>

          

        </div>
        
      </div>
    </>
  )
}

export default Dashboard