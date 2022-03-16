import { useContext } from "react";
import Cookies from "js-cookie";

import { useRouter } from "next/router";
import { Store } from "../utils/Store";
const MenuList = [
  "New group",
  "New broadcast",
  "Linked devices",
  "Starred messages",
  "Settings",
];
export default function MenuModal({ handleProfile, setMenuOpen, menuOpen }) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const handelLogOut = () => {
    dispatch({ type: "USER_LOGOUT" });
    router.push("/login");
    Cookies.remove("userInfo");
  };
  return (
    <div
      className=" z-10 bg-gray-800 shadow-2xl h-auto w-48 absolute right-0 top-16"
      onClick={() => {
        setMenuOpen(!menuOpen);
      }}
    >
      {menuOpen && (
        <ul className=" text-gray-200 capitalize">
          <li
            className="py-2 px-4  hover:bg-gray-700 border-b border-gray-900 cursor-pointer"
            onClick={() => handleProfile(userInfo)}
          >
            My Profile
          </li>
          <li className="py-2 px-4  hover:bg-gray-700 border-b border-gray-900 cursor-pointer">
            New broadcast
          </li>
          <li
            className="py-2 px-4  hover:bg-gray-700 border-b border-gray-900 cursor-pointer"
            onClick={handelLogOut}
          >
            log out
          </li>
        </ul>
      )}
    </div>
  );
}
