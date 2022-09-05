import React, { useEffect, useState } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Link } from "react-router-dom";
import { getNewTracks } from "../api";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import { actionType } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";

import { motion } from "framer-motion";
import Top100 from "../components/Top100";
import NewTrack from "../components/NewTrack";

const Discover = ({ myRef }) => {
  const [{ songs , songsWait }, dispatch] =
    useStateValue();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    dispatch({ type: actionType.SET_NO_OWNER_PLAYLIST });
    getNewTracks().then((data) => {
      dispatch({ type: actionType.SET_SONGS_WAIT, payload: data });
      setIsLoading(false);
    });
  }, []);
  return (
    <>
      <div className="w-screen flex min-w-[768px] h-[calc(100vh-90px)] bg-layoutBg relative">
        <SideBar />
        <Header myRef={myRef}/>
        <div className="grow relative w-[calc(100%-570px)] min-h-full block">
          <div className="relative overflow-hidden w-full h-full">
            <main className="absolute inset-0 overflow-x-hidden overflow-y-scroll mr-[-6px] mb-[0px] px-[59px]">
              <div className="min-h-[calc(100%-158px)] mt-[90px] grow mx-auto my-0 relative w-full">
                <div className="relative !mt-[30px]">
                  <h3 className="flex mb-[16px] justify-between items-center text-[20px] text-white font-bold capitalize">
                    Mới phát hành
                  </h3>
                  <Link
                    to="/new-release/song"
                    className="absolute right-0 top-[50px] text-[12px] font-medium uppercase flex items-center text-songItemAction hover:text-purplePrimary"
                  >
                    Tất cả
                    <IoIosArrowRoundForward className="text-[18px] relative top-0 ml-[6px] text-inherit leading-[66%] inline-block" />
                  </Link>
                  <div className="mb-[20px]">
                    <button className="border-borderPrimary border-purplePrimary bg-purplePrimary text-white px-[24px] py-[4px] border-[1px] border-solid rounded-[100px] font-normal text-[12px] uppercase mr-[15px] inline-block text-center relative">
                      Bài hát
                    </button>
                    <button className="border-borderPrimary text-white px-[24px] py-[4px] border-[1px] border-solid rounded-[100px] font-normal text-[12px] uppercase mr-[15px] inline-block text-center relative">
                      Playlist
                    </button>
                  </div>
                  {!isLoading && (
                    <div className="min-h-[190px] h-[241px] grid grid-cols-3 relative mx-[-15px] my-0">
                      {[0,1,2].map((number, index) => (
                        <motion.div
                          className="relative min-h-[1px] pl-[14px] pr-[14px] float-left shrink-0 !mb-0 block py-0 px-[15px]"
                          key={index}
                          initial={{ x: "20%", opacity: 0 }}
                          animate={{ x: "0%", opacity: 1 }}
                          transition={{ duration: 0.5, ease: "linear" }}
                        >
                          <div>
                            {songsWait?.slice(0 + number * 3, number * 3 + 3).map((track, index01) => (
                              <NewTrack key={track._id} index01={index01} index={index} track={track} myRef={myRef}/>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
                <Top100 />
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Discover;
