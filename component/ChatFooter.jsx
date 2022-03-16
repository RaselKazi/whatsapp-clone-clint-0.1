import React from "react";
import { FiSend } from "react-icons/fi";
import { ImAttachment } from "react-icons/im";
import { BsMic } from "react-icons/bs";
import { FaRegSmile } from "react-icons/fa";
export default function ChatFooter({
  isTyping,
  newMessage,
  typingHandler,
  stopTypingHandler,
  sendMessage,
}) {
  return (
    <div className=" relative">
      <div className=" absolute -top-10 left-0">
        {isTyping && (
          <p
            className=" flex 
                 items-end justify-between text-green-500 font-semibold text-base capitalize w-28 bg-gray-900 py-2 px-4"
          >
            typing
            <div>
              <div className="dot-flashing -mx-5"></div>
            </div>
          </p>
        )}
      </div>
      <form
        className="bg-gray-800
          w-full flex justify-center items-center py-2 px-10"
      >
        <div className=" w-24 flex items-center justify-evenly">
          <div className="flex justify-center items-center text-xl  text-center text-gray-400 cursor-pointer">
            <FaRegSmile />
          </div>

          <div className=" relative">
            <input
              type="file"
              className="file:hidden absolute text-transparent text-xs w-1"
              id="hidden-file"
            />
            <label
              className="flex justify-center items-center text-xl  text-center text-gray-400 cursor-pointer"
              htmlFor="hidden-file"
            >
              <ImAttachment />
            </label>
          </div>
        </div>
        <div className=" flex justify-between items-center  w-4/6">
          <input
            placeholder="Type something..."
            value={newMessage}
            onChange={typingHandler}
            onBlur={stopTypingHandler}
            className="p-2 px-6 inline text-gray-200 w-full bg-gray-700 rounded-full focus:outline-none"
          />
          <button
            type="submit"
            onClick={sendMessage}
            className=" ml-2 flex items-center justify-center  rounded-full h-10 w-14 outline-none"
          >
            <div className="flex justify-center items-center text-xl  text-center text-gray-400 cursor-pointer">
              <FiSend />
            </div>
          </button>
          <div className="flex justify-center items-center text-xl  text-center text-gray-400 cursor-pointer">
            <BsMic />
          </div>
        </div>

        <div className="flex"></div>
      </form>
    </div>
  );
}
