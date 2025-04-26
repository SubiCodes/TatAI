import React, { useEffect, useState } from "react";
import { useImperativeHandle, useRef, forwardRef } from "react";
import { X, ShieldQuestion, Eye, EyeOff } from "lucide-react";
import PropagateLoader from "react-spinners/PropagateLoader";
import axios from "axios";

import empty_profile from "../Images/profile-icons/empty_profile.png";
import boy_1 from "../Images/profile-icons/boy_1.png";
import boy_2 from "../Images/profile-icons/boy_2.png";
import boy_3 from "../Images/profile-icons/boy_3.png";
import boy_4 from "../Images/profile-icons/boy_4.png";
import girl_1 from "../Images/profile-icons/girl_1.png";
import girl_2 from "../Images/profile-icons/girl_2.png";
import girl_3 from "../Images/profile-icons/girl_3.png";
import girl_4 from "../Images/profile-icons/girl_4.png";
import lgbt_1 from "../Images/profile-icons/lgbt_1.png";
import lgbt_2 from "../Images/profile-icons/lgbt_2.png";
import lgbt_3 from "../Images/profile-icons/lgbt_3.png";
import lgbt_4 from "../Images/profile-icons/lgbt_4.png";

const ModalViewComments = forwardRef((_, ref) => {
  const dialogRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);

  // Expose methods to the parent component via ref
  useImperativeHandle(ref, () => ({
    open: () => {
      if (dialogRef.current) {
        dialogRef.current.showModal();
        setIsOpen(true);
      }
    },
    close: () => {
      if (dialogRef.current) {
        dialogRef.current.close();
        setIsOpen(false);
      }
    },
  }));

  const closeModal = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
      setIsOpen(false);
    }
  };

  const profileIcons = {
    empty_profile: empty_profile,
    boy_1: boy_1,
    boy_2: boy_2,
    boy_3: boy_3,
    boy_4: boy_4,
    girl_1: girl_1,
    girl_2: girl_2,
    girl_3: girl_3,
    girl_4: girl_4,
    lgbt_1: lgbt_1,
    lgbt_2: lgbt_2,
    lgbt_3: lgbt_3,
    lgbt_4: lgbt_4,
  };

  //Data states
  const [comments, setComments] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [shownComments, setShownComments] = useState("all");

  //fetch datas
  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await axios.get(
        `${import.meta.env.VITE_URI}guide/getAllComments`
      );
      console.log(res.data.data);
      setComments(res.data.data);
    } catch (error) {
      console.log(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const hideComment = async (commentId) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_URI}guide/hideFeedback/${commentId}`
      );
      fetchComments();
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredComments = comments?.filter((comment) => {
    // Filter by visibility status
    if (
      shownComments !== "all" &&
      (comment.hidden ? "hidden" : "visible") !== shownComments
    )
      return false;

    // Filter by search term
    if (searchTerm.trim() !== "") {
      const lowerSearch = searchTerm.toLowerCase();

      // Search in comment text
      const commentText = comment.comment?.toLowerCase() || "";

      // Search in user info (assuming each comment has user information)
      const userName = comment.userInfo?.name?.toLowerCase() || "";
      const userEmail = comment.userInfo?.email?.toLowerCase() || "";

      // Return false if the search term doesn't match any fields
      if (
        !commentText.includes(lowerSearch) &&
        !userName.includes(lowerSearch) &&
        !userEmail.includes(lowerSearch)
      ) {
        return false;
      }
    }

    return true;
  });

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className="p-12 w-3/5 min-h-[80%] max-h-[80%] text-start rounded-lg bg-gray-50 shadow-lg backdrop:bg-black/50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      onClose={() => setIsOpen(false)}
    >
      <div className="w-full h-10 grid grid-cols-3 items-center mb-8">
        <span></span>
        <span className="text-center text-xl font-bold">Comments</span>
        <span className="text-right">
          <button className="p-0 cursor-pointer" onClick={closeModal}>
            <X />
          </button>
        </span>
      </div>

      {loading ? (
        <div className="w-full h-120 flex flex-col items-center justify-center gap-4">
          <h1 className="text-xl">Fetching data</h1>
          <PropagateLoader size={12} />
        </div>
      ) : error ? (
        <div className="w-full h-48 flex items-center justify-center flex-col gap-4">
          <ShieldQuestion size={50} color="#3B40E8" />
          <h1 className="text-2xl font-bold">Something went wrong</h1>
        </div>
      ) : (
        <>
          {/* <-- React fragment starts here */}
          <div className="w-full flex flex-row items-center mb-10">
            <label className="input border border-gray-500 rounded-lg mr-4">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </g>
              </svg>
              <input
                type="search"
                placeholder="Search a word or a name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </label>

            <div className="flex flex-row gap-2 items-center mr-6">
              <span>All</span>
              <input
                type="radio"
                name="radio-2"
                className="radio radio-xs border-[1px]"
                checked={shownComments === "all"}
                onChange={() => setShownComments("all")}
              />
            </div>
            <div className="flex flex-row gap-2 items-center mr-6">
              <span>Visible</span>
              <input
                type="radio"
                name="radio-2"
                className="radio radio-xs border-[1px]"
                checked={shownComments === "visible"}
                onChange={() => setShownComments("visible")}
              />
            </div>
            <div className="flex flex-row gap-2 items-center mr-6">
              <span>Hidden</span>
              <input
                type="radio"
                name="radio-2"
                className="radio radio-xs border-[1px]"
                checked={shownComments === "hidden"}
                onChange={() => setShownComments("hidden")}
              />
            </div>
          </div>

          {comments?.length > 0 ? (
            filteredComments.map((comment, index) => (
              <div
                key={index}
                className="flex flex-col mb-6 max-w-full self-start w-full pb-5 border-b border-gray-200"
              >
                <div className="flex flex-row gap-4 mb-4">
                  <div className="flex h-full">
                    <img
                      src={profileIcons[comment?.userInfo?.profileIcon]}
                      alt="User Icon"
                      className="w-12 h-auto rounded-full"
                    />
                  </div>
                  <div className="flex flex-row h-4">
                    <div className="flex flex-col">
                      <h3 className="text-md font-semibold">
                        {comment?.userInfo?.name || "John Doe"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {comment?.userInfo?.email || "johndoe@example.com"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center ml-2">
                    <div className="dropdown">
                      <div
                        tabIndex={0}
                        role="button"
                        className="cursor-pointer"
                      >
                        {comment.hidden ? (
                          <EyeOff size={16} className="text-gray-500" />
                        ) : (
                          <Eye size={16} className="text-gray-500" />
                        )}
                      </div>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-white rounded-box z-50 w-52 p-2 shadow-sm cursor-pointer"
                        onClick={() => hideComment(comment._id)}
                      >
                        {!comment.hidden ? "Hide Comment" : "Unhide Comment"}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row gap-4">
                  <div className="w-full">
                    <h1
                      className={`text-lg text-wrap ${
                        comment.hidden ? "text-gray-400" : ""
                      }`}
                    >
                      {comment?.comment ||
                        "This is a mock comment for the feedback system."}
                    </h1>
                  </div>
                </div>

                <div className="flex flex-row gap-4">
                  <h3 className="text-sm text-gray-700">
                    Rating: {comment?.rating ? comment.rating : "None"}
                  </h3>
                  <p className="text-sm text-gray-700">
                    {new Date(comment?.createdAt || Date.now()).toLocaleString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <h1 className="text-xl text-gray-400">
              This user has not posted any comments yet.
            </h1>
          )}
          {/* <-- React fragment ends here */}
        </>
      )}
    </dialog>
  );
});

// Add display name for better debugging
ModalViewComments.displayName = "ModalViewComments";

export default ModalViewComments;
