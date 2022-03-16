import { useState, useRef, useEffect, useContext } from "react";
import Image from "next/image";
import avatarIcon from "../public/7.png";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/router";
import { Store } from "../utils/Store";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
  getSender,
} from "../config/ChatLogics";

export default function ChatBody({ messages }) {
  const [loggedUser, setLoggedUser] = useState();
  const router = useRouter();
  const {
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
    chats,
    setChats,
    state,
    dispatch,
  } = useContext(Store);
  const { userInfo } = state;

  return (
    <div className=" overflow-y-scroll max-h-full ">
      <ScrollableFeed>
        {messages?.map((m, i) => (
          <div
            key={m._id}
            className={`" flex " ${
              isSameSender(messages, m, i, userInfo._id)
                ? " justify-start  "
                : " justify-end"
            }`}
          >
            <div className=" h-16 ml-6 flex items-center">
              {(isSameSender(messages, m, i, userInfo._id) ||
                isLastMessage(messages, i, userInfo._id)) && (
                <div className="" onClick={() => handleProfile(m.sender)}>
                  <Image
                    src={m.sender.pic}
                    className=" bg-gray-700 p-4 rounded-full"
                    alt=""
                    layout="fixed"
                    width={35}
                    height={35}
                  />
                </div>
              )}

              <p
                className={`" mx-4 my-10 py-1 px-4 rounded-full  text-xl text-gray-300 " ${
                  isSameSender(messages, m, i, userInfo._id)
                    ? " rounded-bl-none bg-green-500/40 "
                    : " rounded-br-none bg-gray-700"
                }`}
              >
                {m.content}
              </p>
            </div>
          </div>
        ))}
      </ScrollableFeed>
    </div>
  );
}
