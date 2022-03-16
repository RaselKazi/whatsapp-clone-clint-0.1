import React, { useState, useContext } from "react";
import Image from "next/image";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingList from "../utils/LoadingList";
import { Store } from "../utils/Store";
import { BiSearchAlt2 } from "react-icons/bi";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { getSenderFull } from "../config/ChatLogics";
export default function UserList({ setChatOpen }) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [userList, setUserList] = useState(false);

  const { selectedChat, setSelectedChat, chats, setChats, state } =
    useContext(Store);
  const { userInfo } = state;

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post(
        `https://whats-app-c.herokuapp.com/api/chat`,
        { userId },
        config
      );

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(() => data);
      setLoadingChat(false);
      setUserList(false);
      setChatOpen(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSearch = async () => {
    if (!search) {
      toast.warning("Please Enter something in search");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(
        `https://whats-app-c.herokuapp.com/api/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
      setUserList(true);
    } catch (error) {
      toast.error("Failed to Load the Search Results");
      setLoading(false);
    }
  };

  const handleSelectedChat = (chat) => {
    setSelectedChat(() => chat);

    if (selectedChat && selectedChat.notify) {
      const newChats = chats.map((chat) => {
        if (chat._id === selectedChat._id) {
          return { ...chat, notify: 0 };
        } else {
          return chat;
        }
      });

      setChats(() => newChats);
    }

    setChatOpen(true);
  };
  return (
    <div>
      <div className="cursor-pointer z-10 p-3   border-b border-gray-700">
        <div className=" relative ">
          <input
            type="text"
            placeholder="Search..."
            autoFocus="1"
            className="p-2 rounded-lg inline text-gray-200  bg-gray-700 focus:outline-none w-full "
            onChange={(event) => setSearch(event.target.value)}
          />
          <div
            className=" text-2xl text-gray-400 absolute top-1/4 right-3"
            onClick={handleSearch}
          >
            <BiSearchAlt2 />
          </div>
        </div>
      </div>
      <div className="h-[27rem] overflow-y-scroll">
        {userList ? (
          searchResult?.map((user) => (
            <div
              key={user._id}
              className=" cursor-pointer z-10"
              onClick={() => accessChat(user._id)}
            >
              <div className="p-3 flex justify-between items-center hover:bg-gray-700">
                <div className="inline-flex items-center">
                  {searchResult.length > 0 && (
                    <Image
                      src={user.pic}
                      className=" h-10 w-10 rounded-full mr-3"
                      alt=""
                      layout="fixed"
                      width={40}
                      height={40}
                    />
                  )}

                  <div className="ml-4">
                    <p className="font-semibold text-white capitalize">
                      {user.name}
                    </p>
                    <p className="text-gray-200 text-sm">
                      Follow me on Instagram
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500 text-xs">17:07</p>
                </div>
              </div>
            </div>
          ))
        ) : loading ? (
          <LoadingList item={7} />
        ) : (
          <div>
            {chats?.map(
              (chat) =>
                chat.isGroupChat && (
                  <div
                    key={chat._id}
                    className=" cursor-pointer z-10"
                    onClick={() => handleSelectedChat(chat)}
                  >
                    <div className="p-3 flex justify-between items-center hover:bg-gray-700 border-b border-gray-600">
                      <div className="flex w-4/6 items-center">
                        <Image
                          src={chat.groupAdmin.pic}
                          className=" h-10 w-10 rounded-full mr-3"
                          alt=""
                          layout="fixed"
                          width={40}
                          height={40}
                        />

                        <div className="ml-4">
                          <div className=" flex mb-2">
                            <p className=" bg-green-500 px-2  rounded-md  font-semibold text-white capitalize text-center ">
                              group :
                            </p>
                            <p className="ml-3 font-semibold text-white capitalize">
                              {chat.chatName}
                            </p>
                          </div>

                          {chat.latestMessage ? (
                            <div className=" flex">
                              <p className="text-sky-500 text-lg">
                                <IoCheckmarkDoneOutline />
                              </p>
                              <p className="ml-2 text-gray-200 text-sm truncate">
                                {chat.latestMessage.content}
                              </p>
                            </div>
                          ) : (
                            <div className=" flex">
                              <p className="ml-2 text-gray-200 text-sm">
                                messages not available
                              </p>
                            </div>
                          )}
                          {/* 
                              {typing && (
                                <p className="text-green-500 font-semibold text-sm">
                                  typing...
                                </p>
                              )} */}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-gray-500 text-xs">17:07</p>

                        {chat.notify && chat.notify > 0 && (
                          <p className="mx-auto text-center text-white h-5 w-5 rounded-full bg-green-500 text-xs">
                            <span className="align-middle">{chat.notify}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
            )}

            {chats?.map(
              (chat) =>
                !chat.isGroupChat && (
                  <div
                    key={chat._id}
                    className=" cursor-pointer z-10"
                    onClick={() => handleSelectedChat(chat)}
                  >
                    <div className="p-3 flex hover:bg-gray-700 border-b border-gray-600">
                      <div className="flex w-5/6 items-center ">
                        <div className=" relative">
                          <Image
                            src={getSenderFull(userInfo, chat.users).pic}
                            className=" h-10 w-10 rounded-full mr-3"
                            alt=""
                            layout="fixed"
                            width={40}
                            height={40}
                          />
                          <div className=" absolute -right-1 bottom-1 h-4 w-4 bg-green-500 border-[3px] border-gray-900 rounded-full"></div>
                        </div>

                        <div className="ml-4">
                          <p className="font-semibold text-white capitalize">
                            {getSenderFull(userInfo, chat.users).name}
                          </p>
                          {chat.latestMessage ? (
                            <div className=" flex justify-start  truncate  w-32">
                              <p className="text-sky-500 text-lg">
                                <IoCheckmarkDoneOutline />
                              </p>
                              <p className="ml-2 text-gray-200 text-sm  truncate w-14">
                                {chat.latestMessage.content}
                              </p>
                            </div>
                          ) : (
                            <div className=" text-gray-200 text-sm truncate  w-32">
                              messages not available
                            </div>
                          )}

                          {/* {isTyping && (
                                <p className="text-green-500 font-semibold text-sm">
                                  typing...
                                </p>
                              )} */}
                        </div>
                      </div>
                      <div className=" mx-auto ">
                        <p className="text-gray-500 text-xs">17:07</p>

                        {chat.notify && chat.notify > 0 && (
                          <p className="mx-auto text-center text-white h-5 w-5 rounded-full bg-green-500 text-xs">
                            <span className="align-middle">{chat.notify}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
            )}
          </div>
        )}
      </div>
      <ToastContainer limit={2} />
    </div>
  );
}
