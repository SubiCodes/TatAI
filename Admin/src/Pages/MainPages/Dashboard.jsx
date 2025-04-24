import BarChart from "../../components/BarChart.jsx"
import PieChart from "../../components/PieChart.jsx"
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

function Dashboard() {

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
          {
            value: 1048,
            name: 'DIY',
            itemStyle: { color: '#41b8d5' } // cyan-700
          },
          {
            value: 735,
            name: 'Repair',
            itemStyle: { color: '#2d8bba' } // cyan-800
          },
          {
            value: 580,
            name: 'Cooking',
            itemStyle: { color: '#6ce5e8' } // cyan-900
          },
          {
            value: 484,
            name: 'Tools',
            itemStyle: { color: '#506e9a' } // blue-900
          }
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
                <div className="text-2xl font-bold">2</div>
              </div>
              <div className="bg-white shadow-md rounded-lg p-4 w-1/5 h-40 text-center flex flex-col items-center justify-center">
                <div className="text-sm text-gray-600">Live Guides</div>
                <div className="text-2xl font-bold">18</div>
              </div>
              <div className="bg-white shadow-md rounded-lg p-4 w-1/5 h-40 text-center flex flex-col items-center justify-center">
                <div className="text-sm text-gray-600">Pending Guides</div>
                <div className="text-2xl font-bold">3</div>
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

          <div className="w-full h-160 flex flex-row justify-between mt-4 px-12 pt-0 gap-8">

            <div className="w-2/5 h-full flex flex-col gap-2">

              <div className="w-full h-1/2 flex flex-col  bg-white shadow-md rounded-lg px-6 pt-6">
                <h2 className="text-2xl text-start self-start font-bold mb-4">Ratings</h2>
                <div className="w-full flex flex-col items-center justify-between gap-2">
                  <div className="rating">
                      <div className="mask mask-star bg-primary" aria-label="1 star"></div>
                      <div className="mask mask-star bg-primary" aria-label="2 star"></div>
                      <div className="mask mask-star bg-primary" aria-label="3 star" aria-current="true"></div>
                      <div className="mask mask-star bg-primary" aria-label="4 star"></div>
                      <div className="mask mask-star bg-primary" aria-label="5 star"></div>
                  </div>
                  <span className="text-xs font-light">Average Guide Rating: 4.5</span>
                </div>
                <ReactECharts option={optionBar2} style={{ height: '100%', width: '100%' }} />
              </div>

              <div className="w-full h-1/2 flex flex-col  bg-white shadow-md rounded-lg px-6 py-8 gap-2">
                <h2 className="text-2xl text-start self-start font-bold mb-4">Comments</h2>
                <div className="w-full flex flex-row items-center gap-2 mb-2">
                  <img src={empty_profile} className="max-w-10"/>
                  <span>Friendly User</span>
                  <div className="rating rating-xs ml-auto">
                      <div className="mask mask-star bg-primary" aria-label="1 star"></div>
                      <div className="mask mask-star bg-primary" aria-label="2 star"></div>
                      <div className="mask mask-star bg-primary" aria-label="3 star" aria-current="true"></div>
                      <div className="mask mask-star bg-primary" aria-label="4 star"></div>
                      <div className="mask mask-star bg-primary" aria-label="5 star"></div>
                  </div>
                </div>
                <span className="text-sm line-clamp-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.</span>
                <div className="flex-1"/>
                <div className="w-full h-[1px] bg-gray-300"/>
                <span className="text-center text-primary">View All</span>
              </div>
              
            </div>

            <div className="w-full h-full flex flex-col bg-white shadow-md rounded-lg px-12 pt-6 pb-6">
              <h2 className="text-2xl text-start self-start font-bold mb-4">Recently Posted</h2>


              <div className="w-full h-full flex flex-row gap-8 justify-center">
              
                <div key="mock-guide-id" className="card bg-white g-gray-50 border-1 border-gray-400 rounded-lg w-72 h-fit shadow-sm hover:shadow-2xl transition-all duration-600 ease-in-out">
                  <figure className="px-6 pt-10 h-64 w-full flex justify-center items-center rounded-xl overflow-hidden">
                    <img
                      src="https://via.placeholder.com/150"
                      alt="Mock Guide Title"
                      className="h-full w-full object-contain"
                    />
                  </figure>

                  <div className="card-body items-center text-center">
                    <div className="w-full h-[1px] bg-gray-200" />
                    
                    <div className="w-full flex justify-between items-start flex-col h-auto gap-4">
                      <h2 className="card-title">Mock Guide Title</h2>
                    </div>

                    <div className="w-full flex justify-between items-start flex-col h-auto gap-2 py-2">
                      <div className="w-full flex justify-start items-start flex-row gap-4 overflow-ellipsis mb-2">
                        <p className="text-gray-500 text-md truncate w-full text-start flex flex-row gap-2">
                          Posted by: <span className="font-bold">Mock Uploader</span>
                        </p>
                      </div>

                      <div className="w-full flex justify-start items-start flex-row gap-4">
                        <div className="flex flex-row items-center gap-1">
                          <Star className="text-primary" size={16} />
                          <p className="text-md text-gray-500 font-semibold">4.5</p>
                        </div>
                        <div className="flex flex-row items-center gap-1">
                          <MessageSquareText className="text-primary" size={16} />
                          <p className="text-md text-gray-500 font-semibold">12</p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full flex justify-center items-center mt-4 gap-8">
                      <button className="text-md text-white bg-primary cursor-pointer px-4 py-2 rounded-lg text-xs">
                        View Guide
                      </button>
                      <button className="text-md text-white bg-[#d9534f] cursor-pointer px-4 py-2 rounded-lg text-xs">
                        Delete Guide
                      </button>
                    </div>
                  </div>

                </div>
                <div key="mock-guide-id" className="card bg-white border-1 border-gray-400 rounded-lg w-72 h-fit shadow-sm hover:shadow-2xl transition-all duration-600 ease-in-out">
                  <figure className="px-6 pt-10 h-64 w-full flex justify-center items-center rounded-xl overflow-hidden">
                    <img
                      src="https://via.placeholder.com/150"
                      alt="Mock Guide Title"
                      className="h-full w-full object-contain"
                    />
                  </figure>

                  <div className="card-body items-center text-center">
                    <div className="w-full h-[1px] bg-gray-200" />
                    
                    <div className="w-full flex justify-between items-start flex-col h-auto gap-4">
                      <h2 className="card-title">Mock Guide Title</h2>
                    </div>

                    <div className="w-full flex justify-between items-start flex-col h-auto gap-2 py-2">
                      <div className="w-full flex justify-start items-start flex-row gap-4 overflow-ellipsis mb-2">
                        <p className="text-gray-500 text-md truncate w-full text-start flex flex-row gap-2">
                          Posted by: <span className="font-bold">Mock Uploader</span>
                        </p>
                      </div>

                      <div className="w-full flex justify-start items-start flex-row gap-4">
                        <div className="flex flex-row items-center gap-1">
                          <Star className="text-primary" size={16} />
                          <p className="text-md text-gray-500 font-semibold">4.5</p>
                        </div>
                        <div className="flex flex-row items-center gap-1">
                          <MessageSquareText className="text-primary" size={16} />
                          <p className="text-md text-gray-500 font-semibold">12</p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full flex justify-center items-center mt-4 gap-8">
                      <button className="text-md text-white bg-primary cursor-pointer px-4 py-2 rounded-lg text-xs">
                        View Guide
                      </button>
                      <button className="text-md text-white bg-[#d9534f] cursor-pointer px-4 py-2 rounded-lg text-xs">
                        Delete Guide
                      </button>
                    </div>
                  </div>

                </div>

              </div>

                <div className="flex-1"/>
                <div className="w-full h-[1px] bg-gray-300"/>
                <span className="text-center text-primary">View All</span>

            </div>

          </div>

          

        </div>
        
      </div>
    </>
  )
}

export default Dashboard