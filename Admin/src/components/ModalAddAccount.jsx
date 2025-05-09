import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import { X, Dot, Check, Info, Calendar, ChevronDown } from 'lucide-react';

import ModalMessage from './ModalMessage.jsx';
import ModalConfirm from './ModalConfirm.jsx';
import { DayPicker } from "react-day-picker";

import { URI } from '../constants/URI.js';
import userStore from '../stores/user.store.js';

// Using forwardRef to make the modal accessible from parent components
const ModalAddAccount = forwardRef(({ isSuperAdmin, shouldReload}, ref) => {

    const {addUser} = userStore();

    const modalMessageRef = useRef(null);
    const confirmRef = useRef(null);
    const dialogRef = useRef(null); 

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [date, setDate] = useState();
    const [gender, setGender] = useState('');
    const [role, setRole] = useState('user');
    const [roleDisplay, setRoleDisplay] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('Weak');

    const [errors, setErrors] = useState([]);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const checkPasswordStrength = (pwd) => {
        if (pwd.length < 8) {
          return "Weak";
        }
      
        const hasLetters = /[a-zA-Z]/.test(pwd);
        const hasNumbers = /[0-9]/.test(pwd);
        const hasSymbols = /[^a-zA-Z0-9]/.test(pwd);
      
        if (hasLetters && hasNumbers && hasSymbols) {
          return "Great";
        }
      
        if (hasLetters && hasNumbers) {
          return "Good";
        }
      
        return "Weak";
      };
      

    const today = new Date();
    const eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(today.getFullYear() - 18);

    // Expose methods to the parent component via ref
    useImperativeHandle(ref, () => ({
        open: () => {
        if (dialogRef.current) {
            dialogRef.current.showModal();
        }
        },
        close: () => {
        if (dialogRef.current) {
            dialogRef.current.close();
        }
        }
    }));

    const closeModal = () => {
        if (dialogRef.current) {
            dialogRef.current.close();
            if (shouldReload) {
                window.location.href = "/users";
            };
            setFirstName('');
            setLastName('');
            setDate();
            setGender('');
            setRole('user');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        }
    };

    
    const checkErrors = () => {
        const newErrors = [];
      
        const isValidEmail = (email) => {
          // Simple but effective email regex
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        };
      
        if (!firstName) newErrors.push("First Name cannot be empty.");
        if (!lastName) newErrors.push("Last Name cannot be empty.");
        if (!date) newErrors.push("Birthdate cannot be empty.");
        if (!gender) newErrors.push("Gender cannot be empty.");
      
        if (!email) {
          newErrors.push("Email Address cannot be empty.");
        } else if (!isValidEmail(email)) {
          newErrors.push("Email Address is not valid.");
        }
      
        if (!password) newErrors.push("Password cannot be empty.");
        if (!confirmPassword) newErrors.push("Confirm Password cannot be empty.");
      
        if (passwordStrength === "Weak") {
          newErrors.push("Password must be at least 8 characters long and include alphanumeric characters.");
        }
      
        if (password && confirmPassword && password !== confirmPassword) {
          newErrors.push("Password does not match Confirm Password.");
        }
      
        return newErrors;
    };
      
    const addAccount = async () => {
        const result = await addUser(firstName, lastName, gender, date, email, password, role);
        clear();
        return result;
    };
      
    const handleAddAccount = async () => {
        const validationErrors = checkErrors();
        setErrors(validationErrors);
      
        if (validationErrors.length > 0) {
          modalMessageRef.current.open();
          return;
        }
      
        try {
            confirmRef.current.open();
            return;
        } catch (error) {
          console.error(error.message);
        }
    };

    const clear = async () => {
        setFirstName('');
        setLastName('');
        setGender('');
        setDate();
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setRole('user');
    }

    useEffect(() => {
        if(role === 'user') setRoleDisplay("User");
        if(role === 'admin') setRoleDisplay("Admin");
        if(role === 'super admin') setRoleDisplay("Super Admin");
    }, [role]);
    

    return (
        <dialog
        ref={dialogRef}
        className="p-6 px-12 pb-12 w-[800px] min-h-1/2 max-h-screen rounded-lg text-start bg-white shadow-lg backdrop:bg-black/50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible md:w-[760px] md:px-6 md:pb-4"
        >
        
        <ModalConfirm ref={confirmRef} toConfirm={`Are you sure you want to add ${email}?`} title={"Confirm account creation"} onSubmit={addAccount} titleResult={"Account creation result"}/>
        
        <ModalMessage
        ref={modalMessageRef}
        modalTitle="Invalid input"
        modalText={
            <ul className="list-disc pl-5 text-red-400">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          }/>

        <div className="grid grid-cols-3 items-center w-full h-auto max-h-3/4 relative">
            <span></span> {/* Empty placeholder on the left */}
            <h1 className="text-center text-2xl font-bold">Add User</h1>
            <div className="justify-self-end">
                <X size={24} onClick={closeModal} className="cursor-pointer" />
            </div>
        </div>

        <div className='w-full h-[1px] bg-gray-200 mb-2 mt-4'/>

        <div className='grid grid-cols-2 items-center w-full'>

            <div className='flex flex-col'>
                <fieldset className="fieldset font-semibold">
                    <legend className="fieldset-legend">First Name</legend>
                    <input type="text" value={firstName} className="input border-gray-600 border-1 rounded-lg font-normal" placeholder="" 
                    onChange={(e) => {const newFirstname = e.target.value; 
                    setFirstName(newFirstname); }}/>
                </fieldset>
            </div>
            <div className='flex flex-col'>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend font-semibold">Last Name</legend>
                    <input type="text" value={lastName} className="input border-gray-600 border-1 rounded-lg font-normal" placeholder="" 
                    onChange={(e) => {const newLastname = e.target.value; 
                    setLastName(newLastname); }}/>
                </fieldset>
            </div>

            <div className='flex flex-col '>
                <fieldset className="fieldset relative">
                    <legend className="fieldset-legend font-semibold">Birthdate</legend>
                        <input
                            type="date"
                            className="input border-gray-600 border-1 rounded-lg font-normal"
                            value={
                                date instanceof Date && !isNaN(date)
                                    ? date.toISOString().split("T")[0]
                                    : ""
                                }
                            onChange={(e) => {
                                const selectedDate = new Date(e.target.value);
                                setDate(selectedDate);
                            }}
                            max={eighteenYearsAgo.toISOString().split("T")[0]}
                            min="1900-01-01" // optional: earliest allowed date
                            />
                </fieldset>
            </div>
            
            <div className='flex flex-col'>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend font-semibold">Gender</legend>
                    <div className="dropdown bg-white relative">
                        <div tabIndex={0} role="input" className="input input-border text-left border-gray-600 border-1 rounded-lg bg-white hover:cursor-pointer">
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

            {isSuperAdmin && (

            <div className="col-span-2 pr-8">
                <fieldset className="fieldset">
                    <legend className="fieldset-legend font-semibold">Role</legend>
                    <div className="dropdown bg-white relative w-full">
                        <div tabIndex={0} role="input" className="input input-border text-left border-gray-600 border-1 rounded-lg bg-white w-full hover:cursor-pointer">
                            <span className='text-left font-normal'>{roleDisplay}</span>
                            <span className='flex-1'></span>
                            <span className='text-right'><ChevronDown size={18}/></span>
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu absolute top-full left-0 mt-1 bg-white rounded-lg z-50 w-auto p-2 shadow-xl border border-gray-200">
                            <li>
                                <div className='w-full h-auto flex flex-row gap-2 hover:bg-gray-100 p-0 px-2 rounded-lg' onClick={() => setRole("user")}> 
                                    User
                                    <span className='opacity-0 flex-1'><Dot size={38}/></span>
                                    {roleDisplay === "User" && <span className='text-green-300'><Check size={18}/></span>}
                                </div>
                            </li>
                            <li>
                                <div className='w-full h-auto flex flex-row gap-2 hover:bg-gray-100 p-0 px-2 rounded-lg' onClick={() => setRole("admin")}> 
                                    Admin
                                    <span className='opacity-0 flex-1'><Dot size={38}/></span>
                                    {roleDisplay === "Admin" && <span className='text-green-300'><Check size={18}/></span>}
                                   
                                </div>
                            </li>
                            <li>
                                <div className='w-full h-auto flex flex-row gap-2 hover:bg-gray-100 p-0 px-2 rounded-lg' onClick={() => setRole("super admin")}> 
                                    Super Admin
                                    <span className='opacity-0 flex-1'><Dot size={38}/></span>
                                    {roleDisplay === "Super Admin" && <span className='text-green-300'><Check size={18}/></span>}
                                   
                                </div>
                            </li>
                        </ul>
                    </div>
                </fieldset>
            </div>

            )}

            <div className="col-span-2 pr-8">
                <fieldset className="fieldset font-semibold">
                    <legend className="fieldset-legend">Email Address</legend>
                    <input type="text" value={email} className="input input-border text-left border-gray-600 border-1 rounded-lg bg-white w-full font-normal" placeholder="" 
                    onChange={(e) => {const newEmail = e.target.value; 
                    setEmail(newEmail); }}/>
                </fieldset>
            </div>

            <div className='flex flex-col'>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend font-semibold">Password</legend>
                    <input type={showPassword ? "text" : "password"} value={password}  className="input border-gray-600 border-1 rounded-lg mb-2 font-normal" placeholder="" onChange={(e) => {
                        const newPassword = e.target.value; 
                        setPassword(newPassword); 
                        setPasswordStrength(checkPasswordStrength(newPassword));}}/>
                    <div className='flex flex-row justify-between w-full pr-10'>
                        <h1 className='flex flex-row justify-between items-center gap-1 text-md font-semibold'><Info size={14}/> Password Strength:   
                            <span className={`ml-1 ${passwordStrength==='Weak' && ('text-red-400')} ${passwordStrength==='Good' && ('text-green-400')} ${passwordStrength==='Great' && ('text-green-500')}`}>{passwordStrength}</span>
                        </h1>
                        <h1 className='flex flex-row justify-between items-center gap-1 text-md font-semibold'>
                            <input type="checkbox" className="checkbox checkbox-sm border-1 border-gray-200" checked={showPassword} onChange={() => setShowPassword(!showPassword)}/>Show Password
                        </h1>
                    </div>
                </fieldset>
            </div>
            <div className='flex flex-col'>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend font-semibold text-white">Confirm Password</legend>
                    <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} className="input border-gray-600 border-1 rounded-lg mb-2 font-normal" placeholder="Confirm Password" 
                        onChange={(e) => {const newPassword = e.target.value; 
                        setConfirmPassword(newPassword); }}/>
                    <div className='flex flex-row justify-between w-full pr-10'>
                        <h1 className='flex flex-row justify-between items-center gap-1 text-md font-semibold'><Info size={14}/> Please Re-enter your password.</h1>
                        <h1 className='flex flex-row justify-between items-center gap-1 text-md font-semibold'>
                            <input type="checkbox" className="checkbox checkbox-sm border-1 border-gray-200"  checked={showConfirmPassword} onChange={() => setShowConfirmPassword(!showConfirmPassword)}/>Show Password
                        </h1>
                    </div>
                </fieldset>
            </div>

            <div className="col-span-2 pr-8 mt-12">
                <div className='flex items-center justify-center w-full'>
                    <button className='w-auto px-12 py-2 bg-primary text-white rounded-lg hover:cursor-pointer' onClick={handleAddAccount}>Add</button>
                </div>
            </div>


        </div>

        

        </dialog>
    );
    });


export default ModalAddAccount;