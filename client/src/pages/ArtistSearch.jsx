import React, { useEffect, useState } from "react";
import { BsShuffle } from "react-icons/bs";
import { RiUserAddLine } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAllArtistResults } from "../api";
import Header from "../components/Header";
import HeaderSearch from "../components/HeaderSearch";
import SideBar from "../components/SideBar";
import { actionType } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";

import { motion } from "framer-motion";

const ArtistSearch = ({ myRef }) => {
  const [{ songsWait, textSearch }, dispatch] = useStateValue();

  const location = useLocation();

  const navigate = useNavigate();

  const [allResults, setAllResults] = useState(null);

  const [firstAlpha, setFirstAlpha] = useState(location.pathname.split("/")[2]);

  const linkToArtist = (artist) => {
    dispatch({ type: actionType.GET_NAME_ARTIST, payload: artist });
    navigate(`/nghe-si/${artist.replace(artist.replace(/\s+/g, "-"))}`);
  };

  useEffect(() => {
    dispatch({ type: actionType.SET_NO_OWNER_PLAYLIST });
    getAllArtistResults(textSearch).then((data) => {
      setAllResults(data);
    });
  }, [textSearch]);
  return (
    <div className="w-screen flex min-w-[768px] h-[calc(100vh-90px)] bg-layoutBg relative">
      <SideBar />
      <Header myRef={myRef} />
      <div className="grow relative w-[calc(100%-570px)] min-h-full block">
        <div className="relative overflow-hidden w-full h-full">
          <main className="absolute inset-0 overflow-x-hidden overflow-y-scroll mr-[-6px] mb-[0px] px-[59px] mx-auto my-0 py-0 ">
            <div className="grow mx-auto my-0 relative w-full min-h-[calc(100%-158px)] mt-[70px]">
              <HeaderSearch firstAlpha={firstAlpha} />
              <div className="grow mx-auto my-0 relative w-full">
                <h3 className="text-[20px] text-white mb-[10px] font-bold capitalize block">
                  Bài Hát
                </h3>
                <div className="flex flex-wrap relative mx-[-15px] my-0">
                  {allResults?.map((artist) => (
                    <motion.div
                      key={artist._id}
                      className="xl:w-[20%] w-[25%] relative min-h-[1px] pl-[14px] pr-[14px] float-left shrink-0 px-[10px] py-0 flex flex-col"
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="w-full text-center max-w-full relative ">
                        <div className="relative">
                          <div className="overflow-hidden !rounded-full block relative shrink-0 group">
                            <div
                            onClick={() => linkToArtist(artist.name)}
                            className="cursor-pointer"
                            >
                              <figure className="leading-[0] h-0 pb-[100%] rounded-[5px] overflow-hidden bg-loadingBg group-hover:scale-110 duration-700 transition-all ease-in-out">
                                <img
                                  src={artist.thumbnailM}
                                  className="h-auto w-full"
                                  alt=""
                                />
                              </figure>
                              <div className="bg-darkAlpha10 w-full h-full absolute top-0 left-0 invisible group-hover:visible"></div>
                              <div className="absolute inset-0 ">
                                <div className="absolute left-[50%] top-[50%] bottom-auto right-auto z-[4] translate-x-[-50%] translate-y-[-50%] flex justify-around items-center invisible w-[80%] group-hover:visible">
                                  <button className="text-[14px] rounded-full border-none inline-block text-center relative">
                                    <BsShuffle className="border-none text-[26px] w-[45px] h-[45px] flex items-center justify-center rounded-[50%] text-white leading-[66%]" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="min-h-[52px]">
                          <div className="text-[14px] font-medium leading-[1.36] text-white overflow-hidden text-ellipsis capitalize block ">
                            <span
                              onClick={() => linkToArtist(artist.name)}
                              className="mt-[15px] whitespace-nowrap overflow-hidden text-ellipsis block text-center font-medium capitalize mr-0 mb-[4px] ml-0 hover:text-purplePrimary cursor-pointer hover:underline"
                            >
                              <span>{artist.name}</span>
                            </span>
                          </div>
                          <div className="text-[12px] font-normal leading-[1.33] text-songItemAction">
                            <span>{artist.totalFollow} quan tâm</span>
                          </div>
                        </div>
                        <div>
                          <button className="bg-purplePrimary border-purplePrimary text-white text-[12px] px-[19px] py-[6px] flex justify-center items-center font-normal border-[1px] border-solid border-borderPrimary mx-auto my-0 uppercase !mb-[20px] !mt-[20px] rounded-full leading-normal text-center cursor-pointer relative">
                            <RiUserAddLine className="text-[14px] mr-[5px] leading-[66%] inline-block" />
                            <span>Quan tâm</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ArtistSearch;
