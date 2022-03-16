import React, { useContext } from "react";
import Image from "next/image";
import { BsCameraVideo, BsThreeDots, BsTelephone } from "react-icons/bs";
import { BiSearchAlt2 } from "react-icons/bi";
import { FaArrowLeft } from "react-icons/fa";
import { Store } from "../utils/Store";

import { getSenderFull } from "../config/ChatLogics";
export default function ChatHeader({
  setChatOpen,
  setSideMenuOpen,
  sideMenuOpen,
  handleProfile,
  setGroupInfoModalOpen,
}) {
  const {
    selectedChat,

    state,
  } = useContext(Store);
  const { userInfo } = state;
  return (
    <div
      className=" flex justify-between bg-gray-800
          w-full
          h-16 border-b border-gray-500 "
    >
      <div className="h-16 ml-6 flex items-center">
        <button
          className="mx-4 md:hidden text-gray-100"
          onClick={() => setChatOpen(false)}
        >
          <span className=" flex justify-center items-center text-xl  text-center text-gray-400">
            <FaArrowLeft />
          </span>
        </button>
        <div
          className="flex items-center cursor-pointer"
          onClick={() =>
            handleProfile(getSenderFull(userInfo, selectedChat.users))
          }
        >
          {selectedChat && (
            <Image
              src={getSenderFull(userInfo, selectedChat.users).pic}
              className=" bg-gray-700 p-4 rounded-full"
              alt=""
              layout="fixed"
              width={35}
              height={35}
            />
          )}
        </div>
        <p className="mx-4 my-10 py-1 px-4 rounded-lg   text-xl text-gray-100 capitalize">
          {getSenderFull(userInfo, selectedChat.users).name}
        </p>
      </div>
      <div className="h-16 w-36 gap-2 mr-6 flex items-center justify-between text-2xl  text-center text-gray-400">
        <BsCameraVideo />
        <BsTelephone />
        <BiSearchAlt2 />
        <div className=" relative cursor-pointer">
          <div onClick={() => setSideMenuOpen(!sideMenuOpen)}>
            <BsThreeDots />
          </div>
          {sideMenuOpen && (
            <div className=" absolute top-6 -right-4 bg-gray-800 w-52">
              <ul className=" pt-2 ">
                <li className=" py-2 px-3 text-lg text-gray-200 text-left capitalize border-b border-gray-600 hover:bg-gray-700 transition duration-200 ">
                  log out
                </li>

                {selectedChat.isGroupChat && (
                  <li
                    className=" py-2 px-3 text-lg text-gray-200 text-left capitalize border-b border-gray-600 hover:bg-gray-700 transition duration-200 "
                    onClick={() => setGroupInfoModalOpen(true)}
                  >
                    group info
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
