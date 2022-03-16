import { useState, useRef, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/router";
import { Store } from "../utils/Store";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Image from "next/image";

import { io } from "socket.io-client";
import DefaultImage from "../component/DefaultImage";

import ChatHeader from "../component/ChatHeader";
import ChatFooter from "../component/ChatFooter";
import ChatBody from "../component/ChatBody";
import MenuModal from "../component/MenuModal";
import { BiMessageSquareAdd, BiDotsVerticalRounded } from "react-icons/bi";

import UpdateGroupChatModal from "../component/UpdateGroupChatModal";
import UserList from "../component/UserList";
import ProfileModal from "../component/ProfileModal";
import CreatGroupChatModal from "../component/CreatGroupChatModal";
const ENDPOINT = "https://whats-app-c.herokuapp.com";
var socket, selectedChatCompare;

export default function Messages() {
  const [chatOpen, setChatOpen] = useState(false);
  const [profileData, setProfileData] = useState("");
  const [fetchAgain, setFetchAgain] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [groupName, setGroupName] = useState();
  const [groupInfoModalOpen, setGroupInfoModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const router = useRouter();
  const { selectedChat, chats, setChats, state } = useContext(Store);
  const { userInfo } = state;

  const fetchChatsData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(
        `https://whats-app-c.herokuapp.com/api/chat`,
        config
      );
      setChats(data);
    } catch (error) {
      toast.error("Failed to Load the Search Results");
    }
  };
  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }
    fetchChatsData();
  }, []);

  //chat body code
  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `https://whats-app-c.herokuapp.com/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast.error("Failed to Load the Messages");
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    if (newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "https://whats-app-c.herokuapp.com/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast.error("Failed to Send the Message");
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userInfo);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (chats) {
          const newChats = chats.map((chat) => {
            if (chat._id === newMessageReceived.chat._id) {
              if (chat.notify) {
                return { ...chat, notify: chat.notify + 1 };
              } else {
                return { ...chat, notify: 1 };
              }
            }
            return chat;
          });

          setChats(() => newChats);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const stopTypingHandler = () => {
    socket.emit("stop typing", selectedChat._id);
    setTyping(false);
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const [loggedUser, setLoggedUser] = useState();
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(
        "https://whats-app-c.herokuapp.com/api/chat",
        config
      );
      setChats(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoggedUser(userInfo);
    fetchChats();
  }, []);
  //chat body code

  // handleGroup;

  // handleGroup;

  const handleProfile = (profile) => {
    setProfileData(profile);
    setProfileOpen(true);
  };

  return (
    <>
      <div className=" flex w-screen h-screen bg-gray-900">
        {/* Sidebar */}

        <div className=" sticky h-screen max-h-screen overflow-hidden  w-full md:w-2/5 lg:w-1/3 bg-gray-900 border-r border-gray-500 ">
          {/* SidebarHeader */}
          <div className="bg-gray-800 w-full h-16 flex justify-between items-center border-b border-gray-500 ">
            {/*  nama */}
            {userInfo ? (
              <div className="flex w-3/5 items-center">
                <div
                  className="ml-4 flex cursor-pointer"
                  onClick={() => handleProfile(userInfo)}
                >
                  <Image
                    src={userInfo.pic}
                    className=" rounded-full"
                    alt=""
                    layout="fixed"
                    width={30}
                    height={30}
                  />
                </div>

                <div className="text-white text-lg font-semibold p-4 capitalize truncate ">
                  {userInfo.name}
                </div>
              </div>
            ) : (
              <div className="text-white text-lg font-semibold p-4 capitalize">
                whatsapp
              </div>
            )}

            {/* <!-- button --> */}
            <div className="text-white p-4 ">
              {/* <!-- search button --> */}
              <div className="inline-flex relative">
                <button
                  className="h-10 w-10 rounded-full hover:bg-gray-700  "
                  onClick={() => {
                    setSearchOpen(true);
                  }}
                >
                  <span className=" flex justify-center items-center text-2xl  text-center text-gray-400">
                    <BiMessageSquareAdd />
                  </span>
                </button>
              </div>

              <div className="inline-flex ">
                {/*menu button*/}
                <button
                  className="h-10 w-10 rounded-full hover:bg-gray-700 text-center "
                  onClick={() => {
                    setMenuOpen(!menuOpen);
                  }}
                >
                  <span className=" flex justify-center items-center text-2xl  text-center text-gray-400">
                    <BiDotsVerticalRounded />
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div>
            {/*handleGroup modal*/}
            {groupInfoModalOpen && (
              <UpdateGroupChatModal
                fetchMessages={fetchMessages}
                setGroupInfoModalOpen={setGroupInfoModalOpen}
              />
            )}

            {searchOpen && (
              <CreatGroupChatModal setSearchOpen={setSearchOpen} />
            )}

            {/* menu modal*/}
            <MenuModal
              handleProfile={handleProfile}
              setMenuOpen={setMenuOpen}
              menuOpen={menuOpen}
            />
          </div>
          {/* SidebarHeader */}

          {/* User list */}
          <UserList setChatOpen={setChatOpen} />
        </div>

        {/* Sidebar */}

        {profileOpen && (
          <ProfileModal
            setProfileOpen={setProfileOpen}
            profileData={profileData}
          />
        )}

        {selectedChat ? (
          <div
            className={` flex flex-col h-full max-h-screen   w-full md:w-3/5  lg:w-2/3 md:static  ${
              chatOpen ? "md:block absolute" : "hidden "
            }`}
          >
            {/* ChatHeader */}
            <ChatHeader
              setChatOpen={setChatOpen}
              setSideMenuOpen={setSideMenuOpen}
              sideMenuOpen={sideMenuOpen}
              handleProfile={handleProfile}
              setGroupInfoModalOpen={setGroupInfoModalOpen}
            />

            {/* ChatHeader */}

            <div className="bg-gray-900 w-full h-5/6">
              {/* //ChatBody */}

              <ChatBody messages={messages} />

              {/* //ChatBody */}
            </div>
            {/* ChatFooter */}
            <ChatFooter
              isTyping={isTyping}
              newMessage={newMessage}
              typingHandler={typingHandler}
              stopTypingHandler={stopTypingHandler}
              sendMessage={sendMessage}
            />

            {/* ChatFooter */}
          </div>
        ) : (
          <div className="hidden h-full max-h-screen  w-full md:w-3/5  lg:w-2/3">
            <DefaultImage />
          </div>
        )}
      </div>
      <ToastContainer limit={2} />
    </>
  );
}
