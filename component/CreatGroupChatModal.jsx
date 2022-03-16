import React, { useState, useContext } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsArrowLeftCircle } from "react-icons/bs";
import LoadingList from "../utils/LoadingList";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Store } from "../utils/Store";
export default function CreatGroupChatModal({ setSearchOpen }) {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState();
  const { selectedChat, setSelectedChat, state } = useContext(Store);
  const { userInfo } = state;

  const handleAddGroupUser = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast.warning("User already added");

      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleGroupUserSearch = async (query) => {
    setSearch(query);
    if (!query) {
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
    } catch (error) {
      toast.error("Failed to Load the Search Results");
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmitGroup = async () => {
    if (!groupName || !selectedUsers) {
      toast.warning("Please fill all the fields");

      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post(
        `https://whats-app-c.herokuapp.com/api/chat/group`,
        {
          name: groupName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      toast.success("New Group Chat Created!");
      setSearchOpen(false);
    } catch (error) {
      toast.error("Failed to Create the Chat!");
    }
  };

  return (
    <div className=" z-10 bg-gray-800 w-full  h-screen absolute right-0 top-0 shadow-2xl ">
      <div className=" border-b border-gray-800 px-6 py-2 flex-col justify-between items-center w-full">
        <div className=" flex gap-3">
          <button
            className="text-gray-100 py-4"
            onClick={() => {
              setSearchOpen(false);
            }}
          >
            <span className=" flex justify-center items-center text-2xl  text-center text-gray-400">
              <BsArrowLeftCircle />
            </span>
          </button>
          <div className="my-2">
            <input
              type="text"
              placeholder="GroupName..."
              autoFocus="1"
              className="p-2 rounded-lg inline text-gray-400  bg-gray-700 focus:outline-none w-full "
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>{" "}
        </div>
        <div className="py-2 flex justify-start gap-3 flex-wrap overflow-y-scroll  max-h-32">
          {selectedUsers.map((u) => (
            <div
              key={u._id}
              className="flex justify-start  items-center bg-gray-700 rounded-lg py-1 px-2"
            >
              <div className=" flex">
                <Image
                  src={u.pic}
                  className=" h-10 w-10 rounded-full mr-3"
                  alt=""
                  layout="fixed"
                  width={25}
                  height={25}
                />
              </div>
              <div className=" ml-2 text-base  text-gray-300 capitalize">
                {u.name}
              </div>
              <div
                className=" ml-1 px-2  text-base  text-gray-400 capitalize hover:bg-red-500 hover:text-gray-100 rounded-full cursor-pointer transition duration-200"
                onClick={() => handleDelete(u)}
              >
                X
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="cursor-pointer z-10 p-3   border-b border-gray-700">
          <div className=" relative ">
            <input
              type="text"
              placeholder="Search..."
              autoFocus="1"
              className="p-2 rounded-lg inline text-gray-400  bg-gray-700 focus:outline-none w-full "
              onChange={(e) => setSearch(e.target.value)}
            />

            <div
              className=" text-2xl text-gray-400 absolute top-1/4 right-3"
              onClick={handleGroupUserSearch}
            >
              <BiSearchAlt2 />
            </div>
          </div>
        </div>
        <div className=" h-[27rem] overflow-y-scroll">
          {loading ? (
            <LoadingList item={4} />
          ) : (
            searchResult?.map((user) => (
              <div
                key={user._id}
                className=" cursor-pointer z-10"
                onClick={() => handleAddGroupUser(user)}
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
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <button
        className=" w-full absolute bottom-2 left-0 bg-green-500 py-2 px-4 rounded-lg text-lg  uppercase text-gray-100 font-bold"
        onClick={handleSubmitGroup}
      >
        Creat Group
      </button>
      <ToastContainer limit={2} />
    </div>
  );
}
