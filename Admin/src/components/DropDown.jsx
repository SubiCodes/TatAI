import React, { useRef, useState } from 'react';
import { URI } from '../constants/URI.js';

import { Ellipsis, Eye, CircleCheck, CircleX, PencilOff, OctagonMinus, Trash2, LockKeyhole, User } from 'lucide-react';
import ModalConfirmStatusChange from './ModalConfirmStatusChange.jsx';
import ModalConfirm from './ModalConfirm.jsx';
import axios from 'axios';

import { Link } from 'react-router-dom';

function DropDown({user, isSuperAdmin}) {

    const confirmationRef = useRef(null);
    const confirmationRefRole = useRef(null);
    const deleteRef = useRef(null);

    const [newRole, setNewRole] = useState('');
    const [statusChangedTo, setStatusChangedTo] = useState('');

    const openModalStatus = () => {
        confirmationRef.current.open();
    };
    const openModalRole = () => {
        confirmationRefRole.current.open();
    };
    const openModalDelete = () => {
        deleteRef.current.open();
    };

    const confirmationStatusChange = async (action) => {
        if (!action) return;
        setStatusChangedTo(action);
        openModalStatus();
    };


    const confirmationRoleChange = async () => {
        openModalRole();
    };

    const changeRole = async () => {
        try {
            const res = await axios.post(`${URI}admin/role-change/${user._id}`, {role: newRole});
            console.log(res);
            return `Successfully updated ${user.email} to ${newRole}`;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong.";
            console.error("Delete failed:", errorMessage);
            console.log(error.message);
            console.log(user._id, newRole);
            return errorMessage
        }
    }

    const confirmationDelete = async () => {
        openModalDelete();
    };

    const deleteAccount = async () => {
        try {
            const res = await axios.post(`${URI}admin/delete-account/${user._id}`);
            console.log(res);
            return `Successfully Deleted ${user.email}`;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong.";
            console.error("Delete failed:", errorMessage);
            return errorMessage
        }
    }

    return (
      <>
        <div className={`dropdown dropdown-end`}>
          <div 
            tabIndex={user.role === 'super admin' && !isSuperAdmin ? -1 : 0} 
            role="button" 
          >
            <span><Ellipsis /></span>
          </div>
    
          {/* Dropdown Content */}
          {(user.role === 'super admin') || user.role !== 'super admin' ? (
            <ul tabIndex={0} className="dropdown-content menu bg-white rounded-box z-1 w-52 p-2 shadow-sm rounded-lg">
              
              {/* Always show View */}
              <li className="flex flex-row items-center hover:bg-[#F5F7FA] hover:cursor-pointer rounded-lg hover:font-semibold hover:text-gray-800">
                <Link to={`/view-account/${user._id}`} className="min-w-full">
                  <span className="flex flex-row items-center gap-3">
                    <span><Eye size={18} /></span>
                    <span>View</span>
                  </span>
                </Link>
              </li>
    
              {/* Other Options - Only for non-super admins */}
              {user.role !== 'super admin' && (
                <>
                  {user.role === "admin" ? (
                    <>
                      {isSuperAdmin && (
                        <li className="flex flex-row items-center hover:bg-[#F5F7FA] hover:cursor-pointer rounded-lg hover:font-semibold hover:text-red-500" onClick={() => { setNewRole('user'); confirmationRoleChange() }}>
                          <span className="flex flex-row items-center gap-3 text-blue-300">
                            <span><User size={18} /></span>
                            <span>Demote to User</span>
                          </span>
                        </li>
                      )}
                      {isSuperAdmin && (
                        <li className="flex flex-row items-center hover:bg-[#F5F7FA] hover:cursor-pointer rounded-lg hover:font-semibold hover:text-red-500" onClick={() => confirmationDelete()}>
                          <span className="flex flex-row items-center gap-3 text-red-400">
                            <span><Trash2 size={18} /></span>
                            <span>Delete</span>
                          </span>
                        </li>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Normal User Section */}
                      {user.status !== "Verified" && (
                        <li className="flex flex-row items-center hover:bg-[#F5F7FA] hover:cursor-pointer rounded-lg hover:font-semibold hover:text-gray-800" onClick={() => confirmationStatusChange('Verified')}>
                          <span className="flex flex-row items-center gap-3">
                            <span><CircleCheck size={18} /></span>
                            <span>Verify</span>
                          </span>
                        </li>
                      )}
    
                      {user.status !== "Unverified" && (
                        <li className="flex flex-row items-center hover:bg-[#F5F7FA] hover:cursor-pointer rounded-lg hover:font-semibold hover:text-gray-800" onClick={() => confirmationStatusChange('Unverified')}>
                          <span className="flex flex-row items-center gap-3">
                            <span><CircleX size={18} /></span>
                            <span>Unverify</span>
                          </span>
                        </li>
                      )}
    
                      <div className="w-full h-[1px] bg-gray-200 mt-2 mb-2" />
    
                      {isSuperAdmin && user.role === 'user' && (
                        <li className="flex flex-row items-center hover:bg-[#F5F7FA] hover:cursor-pointer rounded-lg hover:font-semibold hover:text-red-500" onClick={() => { setNewRole('admin'); confirmationRoleChange() }}>
                          <span className="flex flex-row items-center gap-3 text-blue-300">
                            <span><LockKeyhole size={18} /></span>
                            <span>Promote to Admin</span>
                          </span>
                        </li>
                      )}
    
                      {isSuperAdmin && <div className="w-full h-[1px] bg-gray-200 mt-2 mb-2" />}
    
                      {user.status !== "Restricted" && (
                        <li className="flex flex-row items-center hover:bg-[#F5F7FA] hover:cursor-pointer rounded-lg hover:font-semibold hover:text-red-500" onClick={() => confirmationStatusChange('Restricted')}>
                          <span className="flex flex-row items-center gap-3 text-red-400">
                            <span><PencilOff size={18} /></span>
                            <span>Restrict</span>
                          </span>
                        </li>
                      )}
    
                      {user.status !== "Banned" && (
                        <li className="flex flex-row items-center hover:bg-[#F5F7FA] hover:cursor-pointer rounded-lg hover:font-semibold hover:text-red-500" onClick={() => confirmationStatusChange('Banned')}>
                          <span className="flex flex-row items-center gap-3 text-red-400">
                            <span><OctagonMinus size={18} /></span>
                            <span>Ban</span>
                          </span>
                        </li>
                      )}
    
                      {isSuperAdmin && (
                        <li className="flex flex-row items-center hover:bg-[#F5F7FA] hover:cursor-pointer rounded-lg hover:font-semibold hover:text-red-500" onClick={() => confirmationDelete()}>
                          <span className="flex flex-row items-center gap-3 text-red-400">
                            <span><Trash2 size={18} /></span>
                            <span>Delete</span>
                          </span>
                        </li>
                      )}
                    </>
                  )}
                </>
              )}
            </ul>
          ) : null}
    
          {/* Confirmation modals */}
          <ModalConfirmStatusChange ref={confirmationRef} action={statusChangedTo} email={user.email} userID={user._id} />
          <ModalConfirm ref={deleteRef} toConfirm={`Are you sure you want to delete ${user.email}?`} title={"Confirm account deletion"} onSubmit={deleteAccount} titleResult={"Deletion result"} />
          <ModalConfirm ref={confirmationRefRole} toConfirm={`Are you sure you want to change the role of ${user.email}?`} title={"Confirm role change"} onSubmit={changeRole} titleResult={"Role change result"} />
        </div>
      </>
    );
    
      
}

export default DropDown