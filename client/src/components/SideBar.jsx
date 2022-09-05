import React, { memo } from "react";
import { NavLink } from "react-router-dom";
import { MdOutlineLibraryMusic, MdOutlineRadio } from "react-icons/md";
import { AiOutlinePlayCircle , AiOutlineStar} from "react-icons/ai";
import { IoSyncCircleOutline } from "react-icons/io5";
import { RiPieChartLine } from "react-icons/ri";
import { CgNotes } from "react-icons/cg";
import { isActiveStyles, isNotActiveStyles } from "../styles";
import { useStateValue } from "../context/StateProvider";

const SideBar = () => {
  const [{ user }] = useStateValue();
  return (
    <aside className="h-full relative z-100 w-240 bg-sideBar pt-70 pb-54   ">
      <div className="flex flex-col h-full break-words">
        <nav className="w-full h-70">
          <div className="w-240 h-70 top-0 py-0 pr-6 pl-7 flex fixed items-center">
            <div>
              <button className="inline-block leading-0 rounded-none text-sm text-center font-normal cursor-pointer relative">
                <div className="bg-[url('./img/logo-dark.svg')] w-120 h-40 inline-block bg-no-repeat bg-contain"></div>
              </button>
            </div>
          </div>
        </nav>
        <nav className="w-full relative mb-3.6">
          {user?.isAdmin ? (
            <NavLink
              to="/dashboard/home"
              className={({ isActive }) =>
                isActive ? isActiveStyles : isNotActiveStyles
              }
            >
              <MdOutlineLibraryMusic className="rounded w-24 h-24 mr-2.5 leading-9 inline-block" />
              <span className="text-sm font-bold">Dash Board</span>
              <button className="h-20 w-20 absolute right-5 items-center justify-center hidden group-hover:block">
                <AiOutlinePlayCircle className="text-xl" />
              </button>
            </NavLink>
          ) : (
            <NavLink
              to="/mymusic/home"
              className={({ isActive }) =>
                isActive ? isActiveStyles : isNotActiveStyles
              }
            >
              <MdOutlineLibraryMusic className="rounded w-24 h-24 mr-2.5 leading-9 inline-block" />
              <span className="text-sm font-bold">Cá Nhân</span>
              <button className="h-20 w-20 absolute right-5 items-center justify-center hidden group-hover:block">
                <AiOutlinePlayCircle className="text-xl" />
              </button>
            </NavLink>
          )}

          <NavLink
            to="/khampha"
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
          >
            <IoSyncCircleOutline className="rounded w-24 h-24 mr-2.5 leading-9 inline-block" />
            <span className="text-sm font-bold">Khám Phá</span>
            <button className="h-20 w-20 absolute right-5 items-center justify-center hidden group-hover:block">
              <AiOutlinePlayCircle className="text-xl" />
            </button>
          </NavLink>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
          >
            <RiPieChartLine className="rounded w-24 h-24 mr-2.5 leading-9 inline-block" />
            <span className="text-sm font-bold">#zingchart</span>
            <button className="h-20 w-20 absolute right-5 items-center justify-center hidden group-hover:block">
              <AiOutlinePlayCircle className="text-xl" />
            </button>
          </NavLink>
          <NavLink
            to="/top100"
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
          >
            <AiOutlineStar className="rounded w-24 h-24 mr-2.5 leading-9 inline-block" />
            <span className="text-sm font-bold">Top 100</span>
            <button className="h-20 w-20 absolute right-5 items-center justify-center hidden group-hover:block">
              <AiOutlinePlayCircle className="text-xl" />
            </button>
          </NavLink>
          <NavLink
            to="/2"
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
          >
            <CgNotes className="rounded w-24 h-24 mr-2.5 leading-9 inline-block" />
            <span className="text-sm font-bold">Theo Dõi</span>
            <button className="h-20 w-20 absolute right-5 items-center justify-center hidden group-hover:block">
              <AiOutlinePlayCircle className="text-xl" />
            </button>
          </NavLink>
        </nav>
      </div>
    </aside>
  );
};

export default memo(SideBar);
