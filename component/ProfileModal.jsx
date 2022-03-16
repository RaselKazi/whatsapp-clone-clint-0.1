import React, { useContext } from "react";
import { Store } from "../utils/Store";

export default function ProfileModal({ setProfileOpen, profileData }) {
  const { selectedChat } = useContext(Store);
  return (
    <div className=" absolute top-0 right-0 h-screen w-80 bg-gray-800  z-10 border-l border-gray-500">
      <div className=" relative  flex-col justify-center items-center">
        <div
          className=" absolute top-2 left-2 text-xl text-gray-500 font-bold cursor-pointer"
          onClick={() => setProfileOpen(false)}
        >
          X
        </div>
        <div className=" w-full py-6 h-1/6 flex justify-center  items-center border-b border-gray-600">
          {selectedChat && (
            <Image
              src={profileData.pic}
              className=" bg-gray-700 p-4 rounded-full"
              alt=""
              layout="fixed"
              width={200}
              height={200}
            />
          )}
        </div>
        <div className="flex-col items-center justify-center">
          <p className="py-4 text-gray-400 text-2xl font-semibold text-center capitalize">
            {profileData.name}
          </p>
          <p className="py-4 text-gray-400 text-2xl font-semibold text-center">
            {profileData.email}
          </p>
        </div>
      </div>
    </div>
  );
}
