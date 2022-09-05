import React, { memo, useEffect, useState } from "react";
import SideBar from "./../components/SideBar";
import HeaderMyMusic from "./../components/HeaderMyMusic";
import OnePlayList from "./../components/OnePlayList";
import { useStateValue } from "../context/StateProvider";
import { Link, useNavigate } from "react-router-dom";
import { getAllPlaylist } from "../api";
import { actionType } from "./../context/reducer";

import { BsFillPlusCircleFill, BsX } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import Header from "../components/Header";
import { toast } from "react-toastify";
import axios from "axios";

const MyPlayList = ({ myRef }) => {
  const [{ user, allPlaylist }, dispatch] = useStateValue();

  const [isAddPlaylist, setIsAddPlaylist] = useState(false);

  const navigate = useNavigate();

  const [title, setTitle] = useState("");

  const handleCreatePlaylist = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/abum/create", {
        title: title,
        userId: user._id,
        userName: user.name,
        thumbnail:
          "https://firebasestorage.googleapis.com/v0/b/zingmp3-e389e.appspot.com/o/images%2Falbum_default.png?alt=media&token=ef9b8dbc-b81f-4135-8fec-2d3971681e1f",
      });
      if (res) {
        toast.success("You created success a new playlist!");
        dispatch({ type: actionType.CREATE_PLAYLIST, payload: res.data });
        setIsAddPlaylist(false);
        navigate(`/playlist/${res.data.title}/${res.data._id}`);
      } else {
        setIsAddPlaylist(false);
      }
    } catch (error) {
      window.alert("Dont create playlist");
      setIsAddPlaylist(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      if (!allPlaylist) {
        getAllPlaylist(user._id).then((allPlaylist) => {
          dispatch({ type: actionType.SET_ALL_PLAYLIST, payload: allPlaylist });
        });
      }
    }
  }, []);

  return (
    <>
      <div className="w-screen flex min-w-[768px] h-[calc(100vh-90px)] bg-layoutBg">
        <SideBar />
        <Header myRef={myRef} />
        <div className="grow relative min-h-full w-[calc(100%-570px)]">
          <div className="relative overflow-hidden w-full h-full">
            <main className="absolute overflow-x-hidden overflow-y-scroll mr-[-6px] mb-0 px-[59px] py-0 inset-0 mx-auto">
              <div className="grow mx-auto my-0 relative w-full ">
                <div className="pt-[70px] grow mx-auto my-0 relative w-full ">
                  <div className="relative">
                    <div className="min-h-[calc(100%-70px)]">
                      <HeaderMyMusic />
                      <div className="ml-[10px] mt-[50px]">
                        <div className="relative my-0 mx-auto w-full">
                          <h3 className="mb-[16px] flex justify-between items-center text-[20px] text-white font-bold capitalize">
                            <div>
                              PLAYLIST
                              <button
                                className="bg-alphaBg text-[14px] rounded-full border-none inline-block font-normal text-center relative p-0"
                                onClick={() => setIsAddPlaylist(true)}
                              >
                                <BsFillPlusCircleFill className="text-[28px] p-[5px] rounded-[50%] leading-[66%] inline-block" />
                              </button>
                            </div>
                            <Link
                              to="/mymusic/library/playlist"
                              className="text-[14px] font-medium uppercase flex items-center text-songItemAction hover:text-purplePrimary"
                            >
                              Tất cả
                              <IoIosArrowForward className="text-[18px] relative top-0 ml-[6px] text-inherit leading-[66%] inline-block" />
                            </Link>
                          </h3>
                          <div className="relative">
                            <div className="flex my-0 mx-[15px] relative">
                              <div className="flex w-full">
                                {allPlaylist?.slice(-4).map((playlist) => (
                                  <OnePlayList
                                    key={playlist._id}
                                    playlist={playlist}
                                    myRef={myRef}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
      {isAddPlaylist && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-darkAlpha80 flex items-center justify-center z-[999]">
          <div className="bg-primaryBg rounded-lg max-h-full flex items-center flex-col justify-center fixed z-[40]">
            <div>
              <div>
                <div className="w-[290px] text-center m-[20px]">
                  <button
                    className="absolute right-[10px] top-[10px] text-[14px] rounded-full border-none inline-block text-center"
                    onClick={() => setIsAddPlaylist(false)}
                  >
                    <BsX className="text-white text-[30px] p-[5px] rounded-[50%] leading-[66%] inline-block" />
                  </button>
                  <h3 className="text-center mb-[10px] text-white font-bold block">
                    Tạo playlist mới
                  </h3>
                  <input
                    type="text"
                    className="h-[40px] w-full rounded-full border-[1px] border-solid border-loadingBg bg-alphaBg px-[15px] py-0 text-[14px] max-w-full inline-flex justify-start align-top items-center text-white focus:outline-none"
                    placeholder="Nhập tên playlist"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <button
                    className="bg-purplePrimary text-white py-[8px] px-0 flex justify-center items-center border-[1px] border-solid border-loadingBg mx-auto my-0 w-full uppercase !mt-[20px] rounded-full text-center relative hover:bg-[#4e0271]"
                    type="submit"
                    onClick={handleCreatePlaylist}
                  >
                    <span>Tạo mới</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(MyPlayList);
