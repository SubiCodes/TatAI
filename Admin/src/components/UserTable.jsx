import React, { useState, useRef, useEffect } from 'react';

import axios from 'axios';

import { URI } from '../constants/URI.js';
import ModalMessage from './ModalMessage.jsx';
import ModalAddAccount from './ModalAddAccount.jsx';
import PropagateLoader from 'react-spinners/PropagateLoader';
import { User, LockKeyhole, Dot, SlidersHorizontal, ShieldUser } from 'lucide-react';
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

  const addUserModalRef = useRef(null);
  const modalRef = useRef(null);
  const [modalContent, setModalContent] = useState({
    title: '',
    text: ''
  });

  const [users, setUsers] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [filterStatus, setFilterStatus] = useState('');
  const [sortDirection, setSortDirection] = useState('asc'); 
  const [userType, setUserType] = useState('all');

  const handleSortChange = (direction) => {
    setSortDirection(direction);
    console.log(`Sort direction changed to: ${direction}`);
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    console.log(`User type filter changed to: ${type}`);
  };

  const handleResetFilter = () => {
    setFilterStatus('');
    setSortDirection('asc');
    setUserType('all');
  };

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
  
  const filteredUsers = users
  .filter(user => {
    // Search term filter (already implemented)
    if (searchTerm) {
      const searchString = searchTerm.toLowerCase();
      const firstName = user.firstName || '';
      const lastName = user.lastName || '';
      const name = `${firstName} ${lastName}`;
      const role = user.role || '';
      const email = user.email || '';
      const status = user.status || '';
      
      if (!(name.toLowerCase().includes(searchString) ||
            role.toLowerCase().includes(searchString) ||
            email.toLowerCase().includes(searchString) ||
            status.toLowerCase().includes(searchString))) {
        return false;
      }
    }

    // User type filter
    if (userType !== 'all' && user.role !== userType) {
      return false;
    }

    // Status filter (verified, unverified, restricted, banned)
    if (filterStatus) {
      // Convert status to match the case of the data
      const statusCapitalized = filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1);
      if (user.status !== statusCapitalized) {
        return false;
      }
    }

    return true;
  })
  // Sort by name
  .sort((a, b) => {
    const nameA = `${a.firstName || ''} ${a.lastName || ''}`.trim().toLowerCase();
    const nameB = `${b.firstName || ''} ${b.lastName || ''}`.trim().toLowerCase();
    
    // Sort direction
    if (sortDirection === 'asc') {
      return nameA.localeCompare(nameB);
    } else {
      return nameB.localeCompare(nameA);
    }
  });

  const getUser = async () => {
    setLoading(true); 
    try {
      const res = await axios.get(`${URI}user`);
      setUsers(res.data.data);
    } catch (error) {
      console.log(error);
      setModalContent({ title: "Error fetching", text: error.message || "Unknown error" });
      modalRef.current?.open(); // safer call
    } finally {
      setLoading(false);
    }
  };

  const checkUserRole = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${URI}admin/check-role`, {
        withCredentials: true,
      });
      res.data.role === "super admin" ? setIsSuperAdmin(true) : setIsSuperAdmin(false);
    } catch (error) {
      console.log(error);
      setModalContent({ title: "Error fetching", text: error.message || "Unknown error" });
      modalRef.current?.open(); // safer call
    } finally {
      setLoading(false);
    }
  }

  const openAddAcountModal = () => {
    addUserModalRef.current?.open()
  }
  
  useEffect(() => {
    getUser();
    checkUserRole();
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
        <button className='bg-[#0818A8] p-2 rounded-lg hover:cursor-pointer'onClick={openAddAcountModal}>
          <h1 className='text-base text-white' >+ Add User</h1>
        </button>
      </div>
      
      <div className="relative h-auto overflow-visible sm:rounded-lg">
        <div className="p-4 bg-[#F5F7FA] flex flex-row items-center gap-4">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="hover:cursor-pointer"><SlidersHorizontal size={24} color='#101720'/></div>
            <ul tabIndex={0} className="dropdown-content menu bg-white rounded-md z-1 w-auto p-4 shadow-sm gap-4">

              <div className='flex flex-row justify-between'> 
                <h1 className='text-base font-semibold'>Filter by</h1> 
                <h1 className='text-base font-semibold hover:underline hover:cursor-pointer' onClick={handleResetFilter}>Reset</h1> 
              </div>

              {/* asc desc */}
              <div className='flex flex-row items-center gap-6'>
                <div className='flex flex-row items-center gap-2'>
                  <input type="radio" name="radio-1" className="radio radio-xs border-[1px]" defaultChecked checked={sortDirection === 'asc'}
                  onChange={() => handleSortChange('asc')}/>
                  <p className='text-base font-semibold '>A-Z</p>
                </div>
                <div className='flex flex-row items-center gap-2'>
                  <input type="radio" name="radio-1" className="radio radio-xs border-[1px]" checked={sortDirection === 'desc'}
                  onChange={() => handleSortChange('desc')}/>
                  <p className='text-base font-semibold' >Z-A</p>
                </div>
              </div>

              <div className='w-full h-[1px] bg-gray-200'/>

              {/* roles */}
              <div className='flex flex-col gap-6'>
                <div className='flex flex-row items-center gap-2'>
                  <input type="radio" name="radio-2" className="radio radio-xs border-[1px]" defaultChecked checked={userType === 'all'}
                  onChange={() => handleUserTypeChange('all')}/>
                  <p className='text-base font-semibold '>All</p>
                </div>
                <div className='flex flex-row items-center gap-2'>
                  <input type="radio" name="radio-2" className="radio radio-xs border-[1px]" checked={userType === 'user'}
                  onChange={() => handleUserTypeChange('user')}/>
                  <p className='text-base font-semibold '>User</p>
                </div>
                <div className='flex flex-row items-center gap-2'>
                  <input type="radio" name="radio-2" className="radio radio-xs border-[1px]" checked={userType === 'admin'}
                  onChange={() => handleUserTypeChange('admin')}/>
                  <p className='text-base font-semibold '>Admin</p>
                </div>
                <div className='flex flex-row items-center gap-2'>
                  <input type="radio" name="radio-2" className="radio radio-xs border-[1px]" checked={userType === 'super admin'}
                  onChange={() => handleUserTypeChange('super admin')}/>
                  <p className='text-base font-semibold '>Super Admin</p>
                </div>
              </div>

              <div className='w-full h-[1px] bg-gray-200'/>

              <div className='w-64 grid grid-cols-2 gap-4'>
                <button className={`w-32 h-auto pr-2 gap-0 flex flex-row items-center border-[2px] border-gray-400 rounded-4xl hover:cursor-pointer ${filterStatus === 'verified' ? 'border-green-500' : 'border-gray-400'}`} onClick={() => setFilterStatus('verified')}>
                  <span className='text-green-300'><Dot size={38}/> </span>
                  <p className='text-base font-semibold'>Verified</p>
                </button>
                <button className={`w-32 h-auto pr-2 gap-0 flex flex-row items-center border-[2px] border-gray-400 rounded-4xl hover:cursor-pointer ${filterStatus === 'unverified' ? 'border-green-500' : 'border-gray-400'}`} onClick={() => setFilterStatus('unverified')}>
                  <span className='text-gray-300'><Dot size={38}/> </span>
                  <p className='text-base font-semibold'>Unverified</p>
                </button>
                <button className={`w-32 h-auto pr-2 gap-0 flex flex-row items-center border-[2px] border-gray-400 rounded-4xl hover:cursor-pointer ${filterStatus === 'restricted' ? 'border-green-500' : 'border-gray-400'}`} onClick={() => setFilterStatus('restricted')}>
                  <span className='text-red-400'><Dot size={38}/> </span>
                  <p className='text-base font-semibold'>Restricted</p>
                </button>
                <button className={`w-32 h-auto pr-2 gap-0 flex flex-row items-center border-[2px] border-gray-400 rounded-4xl hover:cursor-pointer ${filterStatus === 'banned' ? 'border-green-500' : 'border-gray-400'}`} onClick={() => setFilterStatus('banned')}>
                  <span className='text-red-400'><Dot size={38}/> </span>
                  <p className='text-base font-semibold'>Banned</p>
                </button>
              </div>

            </ul>
          </div>
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
                      {user.role === 'user' && <User size={16} color='#3F5DBF'/>} { user.role === 'admin' && <LockKeyhole size={16} color='#3F5DBF'/>} { user.role === 'super admin' && <ShieldUser size={18} color='#3F5DBF'/>}
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
                    <DropDown user={user} isSuperAdmin={isSuperAdmin}/>
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
      <ModalAddAccount ref={addUserModalRef} isSuperAdmin={isSuperAdmin} shouldReload={false}/>
    </div>
  );
}

export default BarChart;