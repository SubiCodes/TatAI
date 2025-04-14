import React, { useState, useRef, useEffect } from 'react';

import axios from 'axios';

import { URI } from '../constants/URI.js';
import ModalMessage from './ModalMessage.jsx';
import PropagateLoader from 'react-spinners/PropagateLoader';
import { User, LockKeyhole, Dot } from 'lucide-react';
import DropDown from './DropDown.jsx';

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

function BarChart() {

  const modalRef = useRef(null);
  const [modalContent, setModalContent] = useState({
    title: '',
    text: ''
  });

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Map of profile icon names to their imports
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

  // Function to get profile icon based on user's profileIcon property
  const getProfileIcon = (iconName) => {
    // Default to empty profile if no icon name or not found
    if (!iconName || !profileIcons[iconName]) {
      return empty_profile;
    }
    return profileIcons[iconName];
  };
  
  // Filter products based on search term
  const filteredUsers = users.filter(user => {
    // If searchTerm is empty, return all users
    if (!searchTerm) return true;
    
    const searchString = searchTerm.toLowerCase();
    
    // Safe access with null/undefined checks for all properties
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const name = `${firstName} ${lastName}`;
    const role = user.role || '';
    const email = user.email || '';
    const status = user.status || '';
    
    return (
      name.toLowerCase().includes(searchString) ||
      role.toLowerCase().includes(searchString) ||
      email.toLowerCase().includes(searchString) ||
      status.toLowerCase().includes(searchString)
    );
  });

  const getUser = async () => {
    setLoading(true); 
    try {
      const res = await axios.get(`${URI}user`);
      setUsers(res.data.data);
    } catch (error) {
      console.log(error);
      setModalContent(prev => ({...prev, title: "Error fetching", text: error.message}));
      openModal();
    } finally{
      setLoading(false);
    }
  };

  const showUsers = () => {
    console.log(users);
  }

  const openModal = () => {
    modalRef.current.open();
  };

  useEffect(() => {
    getUser();
  }, []);

  if(loading) {
    return(
      <div className='flex justify-center items-center w-full h-full flex-col gap-8'>
        <h1 className='text-xl font-bold text-[#343C6A]'>Fetching Users</h1>
        <PropagateLoader loading={true} color='#0818A8' size={12} speedMultiplier={0.5}/>
      </div>
    )
  }

  return (
    <div className="max-w-screen min-h-full">
      <div className='w-full h-auto justify-between flex items-center px-4 py-4 border-b-[1px] border-[#EBEEF2]'>
        <h1 className='text-xl font-bold text-[#343C6A]'>All Users</h1>
        <button className='bg-[#0818A8] p-2 rounded-lg hover:cursor-pointer'>
          <h1 className='text-base text-white' onClick={showUsers}>+ Add User</h1>
        </button>
      </div>
      
      <div className="relative h-auto overflow-visible sm:rounded-lg">
        <div className="p-4 bg-[#F5F7FA]">
          <label htmlFor="table-search" className="sr-only">Search</label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"></path>
              </svg>
            </div>
            <input 
              type="text" 
              id="table-search" 
              className="bg-[#F5F7FA] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 pl-10 p-2.5 " 
              placeholder="Search for items"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-[#F5F7FA]">
            <tr>
              <th scope="col" className="p-4 w-12">
                <div className="flex items-center"></div>
              </th>
              <th scope="col" className="px-6 py-3 text-base font-semibold w-56">
                User
              </th>
              <th scope="col" className="px-6 py-3 text-base font-semibold w-40">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-base font-semibold w-64">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-base font-semibold w-40">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-base font-semibold w-20 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user._id} className="bg-[#F5F7FA] hover:bg-gray-50 ">
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <input id={`checkbox-table-search-${user.id}`} type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 " />
                      <label htmlFor={`checkbox-table-search-${user.id}`} className="sr-only">checkbox</label>
                    </div>
                  </td>
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex flex-row items-center gap-4">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full overflow-hidden border-2 border-gray-300">
                      <img 
                        src={getProfileIcon(user.profileIcon)} 
                        alt="Profile" 
                        className="w-7 h-7 rounded-full"
                      />
                    </div>
                    {user.firstName} {user.lastName}
                  </th>
                  <td className="px-6 py-4 text-gray-900">
                    <div className='flex flex-row w-fit items-center justify-center gap-2 p-2 px-4 bg-[#D7E9FE] rounded-lg'>
                      {user.role === 'user' ? <User size={16} color='#3F5DBF'/> : <LockKeyhole size={16} color='#3F5DBF'/>}
                      <span className='text-[#3F5DBF]'>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                    </div>
                   
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-0 py-0 text-gray-900 flex flex-row items-center justify-start gap-0 pt-4">
                    <span className={`${user.status === "Verified" ? "text-green-300" : (user.status === "Restricted" || user.status === "Banned" ? "text-red-500" : "text-gray-400")}`}><Dot size={38}/></span>
                    {user.status}
                  </td>
                  <td className="px-6 py-4 text-center overflow-visible">
                    <DropDown user={user}/>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-white ">
                <td colSpan="6" className="px-6 py-4 text-center">
                  No products found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ModalMessage ref={modalRef} modalTitle={modalContent.title} modalText={modalContent.text}/>
    </div>
  );
}

export default BarChart;