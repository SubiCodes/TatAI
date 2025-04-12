import { Box, ChevronDown, ChartArea, Menu, NotebookPen, User, Wrench, X, LogOut } from 'lucide-react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URI } from '../constants/URI.js';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [activeDropdown, setActiveDropdown] = useState('');
  const navigate = useNavigate();
  const dialogRef = useRef(null);
  
  const navItems = [
    { 
      title: 'Dashboard', 
      icon: ChartArea,
      link: '/dashboard'
    },
    { 
      title: 'Users', 
      icon: User,
      link: '/users'
    },
    { 
      title: 'Pending Guides', 
      icon: NotebookPen,
      link: '/pending-guides'
    },
    {
      title: 'Settings',
      icon: Wrench,
      hasDropdown: true,
      dropdownItems: [
        { title: 'Preferences', link: '/settings/preferences' },
        { title: 'Security', link: '/settings/security' },
        { title: 'Notifications', link: '/settings/notifications' }
      ]
    },
    { 
      title: 'Logout', 
      icon: LogOut,
      link: '/login'
    },
  ];

  const closeModal = () => {
    dialogRef.current.close();
  }; 

  const logOut = async () => {
    try {
      await axios.post(
        `${URI}auth/delete-cookie`, // Replace with your actual backend logout route
        {},
        { withCredentials: true }
      );
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error.response?.data?.message || error.message);
    }
  };

  const handleNavigation = async (link) => {
    if (link === '/login') {
      dialogRef.current.showModal();
    } else if (link) {
      navigate(link);
    }
  };

  return (
    <div 
      className={`bg-white text-black transition-all duration-300 ease-in-out text-sm border-2 rounded-md border-[rgba(0,0,0,0.08)]
        ${isOpen ? 'w-64' : 'w-16'}`}
    >
      <div className="p-4 flex justify-between items-center">
        <h1 className={`font-bold overflow-hidden transition-all duration-300 text-lg text-nowrap text-[#3B40E8]
          ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          Dashboard
        </h1>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="hover:bg-[#F3F5F7] p-2 rounded-lg"
        >
          {isOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
        </button>
      </div>
      <nav className="mt-6">
        {navItems.map((item) => (
          <div key={item.title}>
            <div 
              className="px-4 py-3 hover:bg-[#F3F5F7] cursor-pointer flex items-center justify-between"
              onClick={() => {
                if (item.hasDropdown && isOpen) {
                  setActiveDropdown(activeDropdown === item.title ? '' : item.title);
                } else if (item.link) {
                  handleNavigation(item.link);
                }
              }}
            >
              <div className="flex items-center">
                <item.icon size={20} strokeWidth={1.5} color='#000' />
                <span className={`ml-4 whitespace-nowrap overflow-hidden transition-all duration-300
                  ${isOpen ? 'w-32 opacity-100' : 'w-0 opacity-0'}`}>
                  {item.title}
                </span>
              </div>
              {item.hasDropdown && isOpen && (
                <ChevronDown 
                  size={16} 
                  strokeWidth={1.5}
                  className={`transition-transform duration-200 
                    ${activeDropdown === item.title ? 'rotate-180' : ''}`}
                />
              )}
            </div>
            
            {item.hasDropdown && isOpen && activeDropdown === item.title && (
              <div className="bg-[#f5f5f5] overflow-hidden transition-all duration-200">
                {item.dropdownItems.map((dropdownItem) => (
                  <div
                    key={dropdownItem.title}
                    className="px-11 py-2 hover:bg-[#f1f1f1] cursor-pointer text-sm"
                    onClick={() => handleNavigation(dropdownItem.link)}
                  >
                    {dropdownItem.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      <dialog
        ref={dialogRef}
        className="p-6 w-96 rounded-lg bg-white shadow-lg backdrop:bg-black/50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
            <h2 className="text-xl font-semibold mb-4">Login Unsuccessful</h2>
            <p className="mb-4 text-gray-600">Are you sure you want to logout?</p>
            <div className="w-full flex justify-end gap-2">
                <button onClick={closeModal} className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary hover:cursor-pointer transition duration-400">
                    Close
                </button>
                <button onClick={logOut} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-400 hover:cursor-pointer transition duration-400">
                    Logout
                </button>
            </div>
            
        </dialog>
    </div>
  );
};

export default Sidebar;
