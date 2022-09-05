import React, { useEffect, useState } from "react";
import SideBar from "./../components/SideBar";
import Header from "./../components/Header";
import { useStateValue } from "../context/StateProvider";
import { useParams } from "react-router-dom";
import { actionType } from "../context/reducer";
import { AiOutlineHeart } from "react-icons/ai";
import { BiDotsHorizontalRounded, BiPause, BiPlay } from "react-icons/bi";
import { BsPencil } from "react-icons/bs";
import { TbArrowsSort } from "react-icons/tb";
import { HiIdentification, HiOutlineMusicNote } from "react-icons/hi";
import { getAllPlaylist, getPlaylistById, getRelateTrack } from "../api";
import { motion } from "framer-motion";

import TrackPlaylist from "../components/TrackPlaylist";
import { toast } from "react-toastify";
import StreamPlaylist from "../components/StreamPlaylist";
import { IoReloadOutline } from "react-icons/io5";

const imageAnimation = {
  animationTwo: {
    rotate: [180, 0],
    borderRadius: ["50%", "25%", "8px"],
    transition: {
      rotate: {
        type: "spring",
        duration: 0.4,
      },
      borderRadius: {
        type: "spring",
        duration: 0.2,
        delay: 0.3,
      },
    },
  },
};

const PlayList = ({ myRef }) => {
  const params = useParams();
  const id = params.id;

  const [
    {
      user,
      allPlaylist,
      currentPlaylist,
      songInfo,
      isSongPlaying,
      songs,
      relateTrack,
    },
    dispatch,
  ] = useStateValue();
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenSort, setIsOpenSort] = useState(false);
  const [isOpenSub, setIsOpenSub] = useState(false);

  const [isPlaying, setIsPlaying] = useState(null);

  const [totalDuration, setTotalDuration] = useState(null);

  const handerSetPlay = () => {
    if (isPlaying) {
      myRef?.current.audio.current.play();
    } else {
      setIsPlaying(true);
      dispatch({
        type: actionType.SET_ALL_SONGS,
        payload: currentPlaylist?.tracks,
      });
      dispatch({ type: actionType.SET_SONG, payload: 0 });
      dispatch({ type: actionType.SET_SONG_PLAYING, payload: true });
      myRef.current.audio.current.play();
    }
  };

  const handerSetPause = () => {
    dispatch({ type: actionType.SET_SONG_PLAYING, payload: false });
    myRef.current.audio.current.pause();
  };

  useEffect(() => {
    setIsLoading(true);
    getPlaylistById(id).then((data) => {
      dispatch({
        type: actionType.SET_PLAYLIST,
        payload: data,
      });
      if (user?._id === data?.userId) {
        dispatch({ type: actionType.SET_OWNER_PLAYLIST, payload: id });
      } else {
        dispatch({ type: actionType.SET_NO_OWNER_PLAYLIST });
      }
      setTotalDuration(
        Math.floor(
          data?.tracks?.reduce((acc, obj) => acc + obj.duration, 0) /
            60
        )
      );
      setIsPlaying(
        data?._id === id &&
          songs.length === data?.tracks.length &&
          songs?.every((song) =>
            data?.tracks?.some((track) => track._id === song._id)
          )
      );
      if (user?._id === data?.userId) {
        getRelateTrack([
          ...new Set(data?.tracks?.map((track) => track.genreIds).flat()),
        ]).then((data01) => {
          const newTracks = data01.filter((song) =>
            data?.tracks?.every((track) => track._id !== song._id)
          );
          dispatch({ type: actionType.SET_RELATE_TRACK, payload: newTracks });
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });
  }, []);

  return (
    <>
      <div className="w-screen flex min-w-[768px] h-[calc(100vh-90px)] bg-layoutBg relative">
        <SideBar />
        <Header />
        {!isLoading && (
          <div className="grow relative w-[calc(100%-570px)] min-h-full block z-[1]">
            <div className="relative overflow-hidden w-full h-full ">
              <main className="absolute inset-0 overflow-x-hidden overflow-y-scroll mr-[-6px] mb-[0px] px-[59px]">
                <div className="grow mx-auto my-0 relative w-full !pt-[20px] mt-[70px] min-h-[calc(100%-158px)]">
                  <div className="pt-[20px] grow my-0 mx-auto relative w-full ">
                    <div>
                      <div className="sticky top-[110px] block w-[300px] float-left pt-0 pb-[30px] items-center text-left rounded-[5px] ">
                        <div className="mr-0 grow-0 shrink-0 ">
                          <div className="relative max-w-full ">
                            <div className="rounded-[8px] overflow-hidden block relative shrink-0 group">
                              {isPlaying && isSongPlaying ? (
                                <motion.div
                                  className="relative h-full w-full !overflow-hidden rounded-[8px] shadow-md"
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    ease: "linear",
                                    duration: 8,
                                    repeat: Infinity,
                                  }}
                                >
                                  <figure className="w-[300px] h-[300px] leading-0 pb-[100%] rounded-[50%] overflow-hidden bg-loadingBg">
                                    <img
                                      src={currentPlaylist?.thumbnail}
                                      alt={currentPlaylist?.title}
                                      className="h-auto w-full"
                                    />
                                  </figure>
                                  <div className="w-full h-full absolute top-0 left-0 bg-darkAlpha50 rounded-[8px] invisible"></div>
                                </motion.div>
                              ) : (
                                <motion.div
                                  className="relative h-full w-full !overflow-hidden rounded-[8px] shadow-md"
                                  variants={imageAnimation}
                                  animate="animationTwo"
                                >
                                  <figure className="w-[300px] h-[300px] leading-0 pb-[100%] rounded-[5px] overflow-hidden bg-loadingBg group-hover:scale-[1.2] transition-all ease-in-out duration-500">
                                    <img
                                      src={currentPlaylist?.thumbnail}
                                      alt={currentPlaylist?.title}
                                      className="h-auto w-full"
                                    />
                                  </figure>
                                  <div className="w-full h-full absolute top-0 left-0 bg-darkAlpha50 rounded-[8px] invisible group-hover:visible"></div>
                                </motion.div>
                              )}
                              <div className="absolute top-0 left-0 bottom-0 right-0">
                                <div
                                  className={`${
                                    isPlaying && isSongPlaying
                                      ? "!visible"
                                      : "invisible"
                                  } w-full justify-evenly absolute left-[50%] top-[50%] bottom-auto right-auto z-[98] flex items-center translate-x-[-50%] translate-y-[-50%] group-hover:visible`}
                                >
                                  <button
                                    className={`${
                                      isPlaying && isSongPlaying
                                        ? "invisible"
                                        : ""
                                    } text-[20px] rounded-full border-none inline-block text-center relative hover:bg-alphaBg`}
                                  >
                                    <AiOutlineHeart className="text-[30px] text-white p-[5px] rounded-[50%] leading-[66%] inline-block" />
                                  </button>
                                  {isPlaying && isSongPlaying ? (
                                    <button
                                      className="text-[14px] rounded-full border-none inline-block text-center relative"
                                      onClick={handerSetPause}
                                    >
                                      <BiPause className="w-[45px] h-[45px] flex items-center justify-center border-[1px] border-solid border-white rounded-[50%] text-[20px] text-white" />
                                    </button>
                                  ) : (
                                    <button
                                      className="text-[14px] rounded-full border-none inline-block text-center relative"
                                      onClick={
                                        currentPlaylist?.tracks?.length > 0
                                          ? handerSetPlay
                                          : null
                                      }
                                    >
                                      <BiPlay className="w-[45px] h-[45px] flex items-center justify-center border-[1px] border-solid border-white rounded-[50%] text-[20px] text-white" />
                                    </button>
                                  )}
                                  <button
                                    className={`${
                                      isPlaying && isSongPlaying
                                        ? "invisible"
                                        : ""
                                    } text-[20px] rounded-full border-none inline-block text-center relative hover:bg-alphaBg`}
                                  >
                                    <BiDotsHorizontalRounded className="text-[35px] text-white p-[5px] rounded-[50%] leading-[66%] inline-block" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center mt-[12px] w-full flex-col grow shrink text-left">
                          <div className="text-center w-full ">
                            <div className="justify-center flex items-center ">
                              <h3 className="text-[20px] font-bold leading-[1.5] mb-0 text-ellipsis overflow-hidden max-w-full inline-block align-top text-white ">
                                {currentPlaylist?.title}
                                {user && currentPlaylist?.userId === user?._id && (
                                <button className="!ml-[5px] text-[14px] rounded-full border-none inline-block text-center relative p-0">
                                  <BsPencil className="text-[18px] align-bottom leading-[66%] inline-block" />
                                </button>
                                )}
                              </h3>
                            </div>
                            <div className="text-songItemAction text-[12px] leading-[1.75] ">
                              Tạo bởi
                              <span className="text-white">
                                {currentPlaylist?.userName}
                              </span>
                            </div>
                            <h3 className="block text-[12px] mt-[3px] text-ellipsis overflow-hidden max-w-full text-songItemAction font-normal text-center">
                              Công khai
                            </h3>
                          </div>
                          {currentPlaylist?.tracks?.length > 0 && (
                            <div className="flex flex-col mt-[16px] justify-center items-center ">
                              {!isSongPlaying ? (
                                <button
                                  className="mb-[16px] flex items-center mr-[10px] bg-purplePrimary border-purplePrimary text-white text-[14px] px-[24px] py-[9px] justify-center border-[1px] border-solid border-borderPrimary mx-auto my-0 uppercase rounded-full text-center relative"
                                  onClick={handerSetPlay}
                                >
                                  <BiPlay className="text-[20px] mr-[5px] leading-[66%] inline-block" />
                                  <span>Tiếp tục phát</span>
                                </button>
                              ) : !isPlaying ? (
                                <button
                                  className="mb-[16px] flex items-center mr-[10px] bg-purplePrimary border-purplePrimary text-white text-[14px] px-[24px] py-[9px] justify-center border-[1px] border-solid border-borderPrimary mx-auto my-0 uppercase rounded-full text-center relative"
                                  onClick={handerSetPlay}
                                >
                                  <BiPlay className="text-[20px] mr-[5px] leading-[66%] inline-block" />
                                  <span>Tiếp tục phát</span>
                                </button>
                              ) : isSongPlaying ? (
                                <button
                                  className="mb-[16px] flex items-center mr-[10px] bg-purplePrimary border-purplePrimary text-white text-[14px] px-[24px] py-[9px] justify-center border-[1px] border-solid border-borderPrimary mx-auto my-0 uppercase rounded-full text-center relative"
                                  onClick={handerSetPause}
                                >
                                  <BiPause className="text-[20px] mr-[5px] leading-[66%] inline-block" />
                                  <span>Tạm dừng</span>
                                </button>
                              ) : (
                                <button
                                  className="mb-[16px] flex items-center mr-[10px] bg-purplePrimary border-purplePrimary text-white text-[14px] px-[24px] py-[9px] justify-center border-[1px] border-solid border-borderPrimary mx-auto my-0 uppercase rounded-full text-center relative"
                                  onClick={handerSetPlay}
                                >
                                  <BiPlay className="text-[20px] mr-[5px] leading-[66%] inline-block" />
                                  <span>Tiếp tục phát</span>
                                </button>
                              )}
                              <div className="items-center flex grow-0 shrink-0 justify-center">
                                <button className="text-[14px] w-[35px] h-[35px] rounded-full border-none bg-alphaBg flex items-center justify-center text-center relative mr-[10px] ">
                                  <BiDotsHorizontalRounded className="text-[30px] text-white p-[5px] rounded-[50%] leading-[66%] inline-block" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="ml-[330px]">
                        {currentPlaylist?.tracks.length === 0 ? (
                          <div className="w-full text-songItemAction !m-0 grow relative">
                            <div className="w-full px-0 py-[30px] min-h-[220px] bg-alphaBg flex flex-col justify-center items-center ">
                              <HiOutlineMusicNote className="text-[80px] mb-[20px] w-[90px] h-[90px]" />
                              <span className="text-[16px]">
                                Không có bài hát trong playlist của bạn
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="mb-[20px] grow mx-auto my-0 relative w-full ">
                            <div className="mb-[10px]">
                              <div className="mb-[10px]">
                                <div className="border-b-[1px] border-b-solid border-b-sideBar items-center flex p-[10px] rounded-[5px] justify-between">
                                  <div className="w-[50%] mr-[10px] grow-0 shrink-0 ">
                                    <div className="flex items-center">
                                      <div className="mr-[10px] relative">
                                        <div className="leading-[1]">
                                          <button
                                            className="text-[16px] text-songItemAction rounded-full border-none inline-block text-center relative"
                                            onClick={() =>
                                              setIsOpenSort(!isOpenSort)
                                            }
                                          >
                                            <TbArrowsSort className="leadiing-[66%] inline-block" />
                                          </button>
                                        </div>
                                        {isOpenSort && (
                                          <div className="p-[5px] rounded-[8px] bg-primaryBg shadow-md w-max absolute min-w-full z-[99] top-[calc(100%+10px)] left-0 text-white">
                                            <div className="text-[12px] rounded leading-[1] p-[10px] text-left cursor-pointer hover:bg-alphaBg">
                                              Mặc định
                                            </div>
                                            <div className="text-[12px] rounded leading-[1] p-[10px] text-left cursor-pointer hover:bg-alphaBg">
                                              Tên bài hát (A-Z)
                                            </div>
                                            <div className="text-[12px] rounded leading-[1] p-[10px] text-left cursor-pointer hover:bg-alphaBg">
                                              Tên ca sĩ (A-Z)
                                            </div>
                                            <div className="text-[12px] rounded leading-[1] p-[10px] text-left cursor-pointer hover:bg-alphaBg">
                                              Tên Album (A-Z)
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      <div className="text-[12px] font-medium uppercase text-songItemAction">
                                        Bài hát
                                      </div>
                                    </div>
                                  </div>
                                  <div className="ml-[10px] grow-0 shrink-0">
                                    <div className="text-[12px] font-medium uppercase text-songItemAction">
                                      Thời gian
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  {currentPlaylist?.tracks.map(
                                    (track, index) => (
                                      <TrackPlaylist
                                        key={track._id}
                                        track={track}
                                        myRef={myRef}
                                        setIsPlaying={setIsPlaying}
                                        index={index}
                                        isPlaying={isPlaying}
                                      />
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                            {currentPlaylist?.tracks?.length > 0 && (
                              <h3 className="text-[12px] text-songItemAction font-normal ">
                                <span className="my-0 mx-[8px] ml-0">
                                  {currentPlaylist?.tracks?.length} bài hát
                                </span>
                                *
                                <span className="my-0 mx-[8px] mr-0">
                                  {totalDuration} phút
                                </span>
                              </h3>
                            )}
                          </div>
                        )}
                        {user && user._id === currentPlaylist?.userId && (
                          <div className="grow mx-auto my-0 relative w-full">
                            <div className="flex items-center justify-between  ">
                              <h3 className="flex justify-between items-center text-[20px] text-white !mx-0 font-bold capitalize">
                                Bài hát gợi ý
                              </h3>
                              <button className="m-0 bg-purplePrimary border-purplePrimary text-white text-[12px] px-[19px] py-[6px] flex justify-center items-center font-normal border-[1px] border-solid border-borderPrimary uppercase rounded-full text-center cursor-pointer relative">
                                <IoReloadOutline className="text-[14px] mr-[5px] leading-[66%] inline-block" />
                                <span>Làm mới</span>
                              </button>
                            </div>
                            <h3 className="text-songItemAction !mb-[15px] font-normal">
                              Dựa trên các bài hát trong playlist này
                            </h3>
                            <div>
                              {relateTrack?.map((trackStream) => (
                                <StreamPlaylist
                                  trackStream={trackStream}
                                  key={trackStream._id}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PlayList;
