import React, { useEffect, useState } from 'react'
import { DayPicker } from "react-day-picker";

import { Pencil, Calendar, Check, ChevronDown, Dot } from 'lucide-react'
import PropagateLoader from 'react-spinners/PropagateLoader';
import BeatLoader from 'react-spinners/BeatLoader';
import ModalMessage from '../../../components/ModalMessage.jsx';
import ModalChangeProfileIcon from '../../../components/ModalChangeProfileIcon.jsx';

import empty_profile from '../../../Images/profile-icons/empty_profile.png'
import boy_1 from '../../../Images/profile-icons/boy_1.png'
import boy_2 from '../../../Images/profile-icons/boy_2.png'
import boy_3 from '../../../Images/profile-icons/boy_3.png'
import boy_4 from '../../../Images/profile-icons/boy_4.png'
import girl_1 from '../../../Images/profile-icons/girl_1.png'
import girl_2 from '../../../Images/profile-icons/girl_2.png'
import girl_3 from '../../../Images/profile-icons/girl_3.png'
import girl_4 from '../../../Images/profile-icons/girl_4.png'
import lgbt_1 from '../../../Images/profile-icons/lgbt_1.png'
import lgbt_2 from '../../../Images/profile-icons/lgbt_2.png'
import lgbt_3 from '../../../Images/profile-icons/lgbt_3.png'
import lgbt_4 from '../../../Images/profile-icons/lgbt_4.png'
import { useRef } from 'react';

import axios from 'axios';
import { URI } from '../../../constants/URI';


function EditProfile() {
    const loadingErrorRef = useRef();
    const changeIconRef = useRef();

    const [loading, setLoading] = useState(true);
    const [errorFetching, setErrorFectching] = useState(false);
    const [errorSaving, setErrorSaving] = useState(false);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const [changingData, setChangingData] = useState(false);

    const [userID, setUserID] = useState('');
    const [profileIcon, setProfileIcon] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('');
    const [date, setDate] = useState();

    const [modalContent, setModalContent] = useState({
        title: '',
        text: ''
    });

    const today = new Date();
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(today.getFullYear() - 18);

    const disabledDays = [
        { from: new Date(eighteenYearsAgo.getTime() + 86400000), to: new Date(2100, 0, 1) }
    ];

    const toggleDatePicker = () => {
        setIsDatePickerOpen(!isDatePickerOpen);
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
    
      
    const getProfileIcon = (iconName) => {
        if (!iconName || !profileIcons[iconName]) {
          return empty_profile;
        }
        return profileIcons[iconName];
    };

    const fetchAdminData = async () => {
        setLoading(true);
        setErrorFectching(false)
        try {
          const res = await axios.get(`${URI}admin/admin-data`, {
            withCredentials: true,
          });
          setUserID(res.data.data._id);
          setProfileIcon(res.data.data.profileIcon);
          setFirstName(res.data.data.firstName);
          setLastName(res.data.data.lastName);
          if (res.data.data.birthday) {
            const birthdayDate = new Date(res.data.data.birthday);
            if (!isNaN(birthdayDate.getTime())) {
                setDate(birthdayDate);
            } else {
                setDate(res.data.data.birthday);
            }
        }
          setGender(res.data.data.gender);
          console.log(res.data);
        } catch (error) {
            console.log(error);
            setModalContent({ title: "Error fetching", text: error.message || "Unknown error" });
            setErrorFectching(true);
        } finally {
          setLoading(false);
        }
    }

    const handleSaveChanges = async () => {
        console.log(firstName);
        console.log(lastName);
        console.log(date);
        console.log(gender);

        setChangingData(true);

        try {
            const res = await axios.put(`${URI}admin/edit-admin-data/${userID}`, {firstName: firstName, lastName: lastName, birthday: date, gender: gender});
            console.log(res);
            console.log(`${URI}admin/edit-admin-data/${userID}`);
            window.location.href = "/settings";
        } catch (error) {
            console.log(error);
            setModalContent({ title: "Error saving", text: error.message || "Unknown error" });
            setErrorSaving(true);
        } finally {
            setChangingData(false)
        }
    }

    useEffect(() => {
        fetchAdminData();
    }, []);

    useEffect(() => {
        if(errorFetching) {
            loadingErrorRef.current?.open();
        }
    }, [errorFetching]);

    useEffect(() => {
        if(errorSaving) {
            loadingErrorRef.current?.open();
        }
    }, [errorSaving]);

    if(loading) {
        return(
          <div className='flex justify-center items-center w-full h-full flex-col gap-8'>
            <h1 className='text-xl font-bold text-[#343C6A]'>Fetching Data</h1>
            <PropagateLoader loading={true} color='#0818A8' size={12} speedMultiplier={0.5}/>
          </div>
        )
    }

    if(errorFetching) {
        loadingErrorRef.current?.open();
    }
    
  return (
    <div className='w-full h-full flex flex-col p-4 items-center gap-12 pr-18 overflow-visible'>

        <div className='w-full h-auto flex flex-col gap-2'>
            <h1 className='text-xl font-bold text-[#343C6A]'>Edit Profile</h1>
            <span className='text-md text-black'>
                This information is used to verify your identity and maintain a secure environment. You can update your name, birthdate, and gender.
            </span>
        </div>

        <div className='w-full h-auto flex items-center justify-center'>
            <div className='relative w-36 h-36 rounded-full bg-gray-300 flex items-center justify-center'>
                <img src={getProfileIcon(profileIcon)}  className='w-32 h-auto object-contain'/>
                <button
                  className="absolute bottom-2 right-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                  onClick={() => {
                    changeIconRef.current.open();
                  }}
                >
                  <Pencil size={16} color="white" />
                </button>
            </div>
        </div>

        <div className='flex flex-col w-full h-auto gap-4 items-center'>

            <div className='w-full flex items-center justify-center'>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">First Name</legend>
                    <input type="text" className="input w-lg border-1 rounded-md bg-[#F8F8FF]" placeholder="" value={firstName}  
                    onChange={(e) => {const newFirstName = e.target.value; 
                    setFirstName(newFirstName); }}/>    
                </fieldset>
            </div>

            <div className='w-full flex items-center justify-center'>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Last Name</legend>
                    <input type="text" className="input w-lg border-1 rounded-md bg-[#F8F8FF]" placeholder="" value={lastName} 
                    onChange={(e) => {const newLastName = e.target.value; 
                    setLastName(newLastName); }}/>    
                </fieldset>
            </div>
           

            <div className='w-full flex items-center justify-center'>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Birthdate</legend>
                    <button 
                            onClick={toggleDatePicker}
                            className="input input-border w-lg text-left bg-[#F8F8FF] border-1 rounded-lg hover:cursor-pointer"
                        >
                            <span className='text-left font-normal'> {date ? date.toLocaleDateString() : "Pick a date"}</span>
                            <span className='flex-1'></span>
                            <span className='text-right'><Calendar size={18}/></span>
                        </button>
                        {isDatePickerOpen && (
                            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 translate-y-0 mb-1 bg-white shadow-lg rounded-lg z-50 overflow-hidden">
                                <DayPicker 
                                    className="react-day-picker" 
                                    mode="single" 
                                    selected={date} 
                                    disabled={disabledDays}
                                    defaultMonth={eighteenYearsAgo}
                                    onSelect={(selectedDate) => {
                                        setDate(selectedDate);
                                        setIsDatePickerOpen(false);
                                    }}
                                />
                            </div>
                        )}
                </fieldset>
            </div>

            <div className='w-full flex items-center justify-center'>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Gender</legend>
                    <div className="dropdown bg-white relative w-full">
                        <div tabIndex={0} role="input" className="input input-border w-lg text-left border-1 rounded-lg bg-[#F8F8FF] hover:cursor-pointer">
                            <span className='text-left font-normal'>{gender}</span>
                            <span className='flex-1'></span>
                            <span className='text-right'><ChevronDown size={18}/></span>
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu absolute top-full left-0 mt-1 bg-white rounded-lg z-50 w-auto p-2 shadow-xl border border-gray-200">
                            <li>
                                <div className='w-full h-auto flex flex-row gap-2 hover:bg-gray-100 p-0 px-2 rounded-lg' onClick={() => setGender("Male")}> 
                                    Male
                                    <span className='opacity-0 flex-1'><Dot size={38}/></span>
                                    {gender === "Male" && <span className='text-green-300'><Check size={18}/></span>}
                                </div>
                            </li>
                            <li>
                                <div className='w-full h-auto flex flex-row gap-2 hover:bg-gray-100 p-0 px-2 rounded-lg' onClick={() => setGender("Female")}> 
                                    Female
                                    <span className='opacity-0 flex-1'><Dot size={38}/></span>
                                    {gender === "Female" && <span className='text-green-300'><Check size={18}/></span>}
                                   
                                </div>
                            </li>
                            <li>
                                <div className='w-full h-auto flex flex-row gap-2 hover:bg-gray-100 p-0 px-2 rounded-lg' onClick={() => setGender("Non-Binary")}> 
                                    Non-Binary
                                    <span className='opacity-0 flex-1'><Dot size={38}/></span>
                                    {gender === "Non-Binary" && <span className='text-green-300'><Check size={18}/></span>}
                                </div>
                            </li>
                            <li>
                                <div className='w-full h-auto flex flex-row gap-2 hover:bg-gray-100 p-0 px-2 rounded-lg' onClick={() => setGender("Prefer not to say")}> 
                                    Prefer not to say
                                    <span className='opacity-0 flex-1'><Dot size={38}/></span>
                                    {gender === "Prefer not to say" && <span className='text-green-300'><Check size={18}/></span>}
                                </div>
                            </li>
                        </ul>
                    </div>
                </fieldset>
            </div>

            <div className='w-full flex items-center justify-center mt-4'>
                <button className='w-sm h-10 flex items-center justify-center bg-primary text-white rounded-lg hover:cursor-pointer' disabled={changingData}
                onClick={() => {handleSaveChanges()}}>
                    {changingData ? (<BeatLoader size={6} color='white'/>) : ("Save")}
                </button>
            </div>

        </div>
    <ModalMessage ref={loadingErrorRef} modalTitle={modalContent.title} modalText={modalContent.text}/>
    <ModalChangeProfileIcon ref={changeIconRef} currentIcon={profileIcon} userID={userID}/>
    </div>
  )
}

export default EditProfile