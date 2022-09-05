import React, { useState } from "react";
import { useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { getAllResults } from "../api";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import { useStateValue } from "../context/StateProvider";
import { BsPauseFill, BsPlayFill, BsShuffle } from "react-icons/bs";
import { IoIosArrowRoundForward } from "react-icons/io";
import { BiDotsHorizontalRounded, BiPause, BiPlay } from "react-icons/bi";

import { motion } from "framer-motion";
import { AiOutlineClose, AiOutlineHeart } from "react-icons/ai";
import { RiUserAddLine } from "react-icons/ri";
import { actionType } from "../context/reducer";
import HeaderSearch from "../components/HeaderSearch";

const AllSearch = ({ myRef }) => {
  const [{ textSearch, songs, songIndex, isSongPlaying }, dispatch] =
    useStateValue();

  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const [results, setResult] = useState([]);
  const location = useLocation();

  const [firstAlpha, setFirstAlpha] = useState(
    location.pathname.split("/")[2]
  );

  const navigate = useNavigate();

  const handerSetPlay = (index) => {
    if (songs?.length !== results[1]?.items?.length) {
      dispatch({ type: actionType.SET_ALL_SONGS, payload: results[1]?.items });
    }
    dispatch({ type: actionType.SET_SONG, payload: index });
    dispatch({ type: actionType.SET_SONG_PLAYING, payload: true });
    myRef?.current.audio.current.play();
  };

  const handerSetPause = () => {
    dispatch({ type: actionType.SET_SONG_PLAYING, payload: false });
    myRef.current.audio.current.pause();
  };

  const linkToArtist = (artist) => {
    dispatch({ type: actionType.GET_NAME_ARTIST, payload: artist });
    navigate(`/nghe-si/${artist.replace(artist.replace(/\s+/g, "-"))}`);
  };

  const linkToPlaylist = (playlist) => {
    navigate(`/playList/${playlist.title}/${playlist._id}`)
  }

  useEffect(() => {
    setLoading(true);
    getAllResults(textSearch).then((data) => {
      setLoading(false);
      setResult(data);
      console.log(results);
    });
  }, [textSearch]);

  return (
    <div className="w-screen flex min-w-[768px] h-[calc(100vh-90px)] bg-layoutBg relative">
      <SideBar />
      <Header myRef={myRef} />
      <div className="grow relative w-[calc(100%-570px)] min-h-full block">
        <div className="relative overflow-hidden w-full h-full ">
          <main className="absolute inset-0 overflow-x-hidden overflow-y-scroll mr-[-6px] mb-[0px] px-[59px] mx-auto my-0 py-0 ">
            <div className="grow mx-auto my-0 relative w-full min-h-[calc(100%-158px)] mt-[70px]">
              <HeaderSearch firstAlpha={firstAlpha} />
              {!loading && (
                <div className="grow my-0 mx-auto relative w-full">
                  <div>
                    <div>
                      <div className="grow mx-auto my-0 relative w-full">
                        <h3 className="mb-[16px] flex justify-between items-center text-[20px] text-white font-bold capitalize">
                          Nổi bật
                        </h3>
                        <div className="relative ">
                          <div className="flex mx-[-15px] my-0 overflow-hidden relative ">
                            <div className="flex z-[3] w-full">
                              {results[0]?.items?.map((item, index) => (
                                <div
                                  key={item._id}
                                  className="cursor-pointer w-[33.3333%] relative min-h-[1px] pl-[14px] pr-[14px] float-left shrink-0 px-[10px] py-0 flex flex-col group"
                                  onClick={item.title ? () => linkToPlaylist(item) : () => linkToArtist(item.name)}
                                >
                                  <div>
                                    <div className="bg-boxHotItemBg items-center flex text-left p-[10px] rounded-[5px] group-hover:bg-alphaBg">
                                      <div className="mr-[10px] grow-0 shrink-0">
                                        <div>
                                          <div
                                            className={`${
                                              item.title
                                                ? "rounded"
                                                : "!rounded-full"
                                            } overflow-hidden relative block shrink-0`}
                                          >
                                            <div>
                                              <figure className="leading-0 h-0 pb-[100%] rounded-[5px] overflow-hidden w-[84px] bg-loadingBg ">
                                                <img
                                                  src={item.thumbnail}
                                                  alt=""
                                                  className="h-auto w-full"
                                                />
                                              </figure>
                                              <div className="invisible w-full h-full absolute top-0 left-0 bg-darkAlpha50 group-hover:visible"></div>
                                              <div className="absolute inset-0">
                                                <div className="absolute left-[50%] top-[50%] bottom-auto right-auto z-[4] translate-x-[-50%] translate-y-[-50%] flex justify-around items-center invisible w-[80%] group-hover:visible">
                                                  <button className="text-[14px] rounded-full border-none inline-block text-center relative">
                                                    {item.title ? (
                                                      <BsPlayFill className="border-none text-[16px] w-[20px] h-[20px] flex items-center justify-center rounded-[50%] text-white leading-[66%]" />
                                                    ) : (
                                                      <BsShuffle className="border-none text-[16px] w-[20px] h-[20px] flex items-center justify-center rounded-[50%] text-white leading-[66%]" />
                                                    )}
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="grow shrink ml-[6px]">
                                        <p className="text-[12px] leading-[18px] font-normal text-songItemAction mb-[6px] whitespace-nowrap ">
                                          {item.title ? "Playlist" : "Nghệ sĩ"}
                                        </p>
                                        <div className="font-[600] text-[14px] leading-[20px] text-white mb-0 w-full whitespace-nowrap text-ellipsis overflow-hidden max-w-full inline-block align-top capitalize ">
                                          <div>
                                            <span>
                                              {item.title
                                                ? item.title
                                                : item.name}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="mt-[2px] font-normal text-[12px] leading-[18px] text-songItemAction block whitespace-nowrap text-ellipsis overflow-hidden max-w-full align-top capitalize">
                                          <span className="font-normal text-[12px] leading-[18px] text-songItemAction whitespace-nowrap ">
                                            {item.title
                                              ? item.userName
                                              : item.totalFollow + " quan tâm"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="!mt-[30px] grow mx-auto my-0 relative w-full">
                    <h3 className="mb-[16px] flex justify-between items-center text-[20px] text-white font-bold capitalize ">
                      Bài Hát
                      <Link
                        to="/tim-kiem/bai-hat"
                        className="text-[12px] font-medium uppercase flex items-center text-songItemAction hover:text-purplePrimary"
                      >
                        Tất cả
                        <IoIosArrowRoundForward className="text-[18px] relative top-0 ml-[6px] text-inherit leading-[66%] inline-block" />
                      </Link>
                    </h3>
                    <div className="flex flex-wrap relative mx-[-15px] my-0">
                      {[0, 1].map((number, index) => (
                        <div
                          className="w-[50%] relative min-h-[1px] pl-[14px] pr-[14px] float-left shrink-0 !mb-0 block px-[15px] py-0"
                          key={index}
                        >
                          <div>
                            {results[1]?.items
                              .slice(0 + number * 3, number * 3 + 3)
                              .map((track, index01) => (
                                <div key={track._id}>
                                  <div
                                    className={`border-b-[1px] border-b-solid border-b-sideBar rounded hover:bg-alphaBg group`}
                                  >
                                    <div className="flex items-center text-left p-[10px] rounded-[5px]">
                                      <div className="grow shrink flex w-[50%] mr-[10px] basic-auto">
                                        <div className="mr-[10px] shrink-0 block relative overflow-hidden rounded cursor-pointer">
                                          <figure className="w-[40px] h-[40px] bg-borderPrimary">
                                            <img
                                              src={track.thumbnail}
                                              alt=""
                                              className="h-auto w-full"
                                            />
                                          </figure>
                                          <div className="invisible w-full h-full absolute top-0 left-0 bg-darkAlpha50 "></div>
                                          {songs[songIndex]?._id ===
                                          track._id ? (
                                            <div className="absolute top-0 left-0 bottom-0 right-0 ">
                                              <div className="visible w-full h-full absolute top-0 left-0 bg-darkAlpha50 "></div>
                                              <div className="absolute left-[50%] top-[50%] bottom-auto right-auto z-[4] flex justify-center items-center visible w-[80%] translate-x-[-50%] translate-y-[-50%]">
                                                {isSongPlaying ? (
                                                  <button
                                                    className="text-[20px] leading-[0] h-[18px] rounded-full border-[0] inline-block text-center cursor-pointer relative font-normal p-[0]"
                                                    onClick={handerSetPause}
                                                  >
                                                    <BsPauseFill className="text-white rounded-[50%] leading-[66%] inline-block" />
                                                  </button>
                                                ) : (
                                                  <button
                                                    className="text-[20px] leading-[0] h-[18px] rounded-full border-[0] inline-block text-center cursor-pointer relative font-normal p-[0]"
                                                    onClick={() =>
                                                      handerSetPlay(
                                                        index + index01
                                                      )
                                                    }
                                                  >
                                                    <BsPlayFill className="text-white rounded-[50%] leading-[66%] inline-block" />
                                                  </button>
                                                )}
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="absolute top-0 left-0 bottom-0 right-0 ">
                                              <div className="invisible group-hover:visible w-full h-full absolute top-0 left-0 bg-darkAlpha50 "></div>
                                              <div className="absolute left-[50%] top-[50%] bottom-auto right-auto z-[4] flex justify-around items-center invisible w-[80%] translate-x-[-50%] translate-y-[-50%] group-hover:visible">
                                                <button
                                                  className="text-[20px] leading-[0] h-[18px] rounded-full border-[0] inline-block text-center cursor-pointer relative font-normal p-[0]"
                                                  onClick={() =>
                                                    handerSetPlay(
                                                      index + index01
                                                    )
                                                  }
                                                >
                                                  <BsPlayFill className="text-white rounded-[50%] leading-[66%] inline-block" />
                                                </button>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                        <div className="overflow-hidden flex flex-col w-full ">
                                          <div className="max-w-full flex items-center ">
                                            <span className="flex items-center grow shrink leading-[1.3] overflow-hidden max-w-full text-ellipsis font-medium align-top text-white whitespace-nowrap">
                                              {track.title}
                                            </span>
                                          </div>
                                          <h3 className="block text-xs mt-[3px] overflow-hidden max-w-full text-ellipsis font-normal text-songItemAction whitespace-nowrap hover:text-linkTextHover">
                                            {track.artistsNames.map(
                                              (name, index02) => (
                                                <button
                                                  key={index02}
                                                  className="text-songItemAction inline-block hover:underline hover:!text-linkTextHover"
                                                >
                                                  {name}
                                                  {index02 <
                                                  track.artistsNames.length - 1
                                                    ? ","
                                                    : ""}
                                                </button>
                                              )
                                            )}
                                          </h3>
                                        </div>
                                      </div>
                                      <div className="ml-[10px] basic-auto grow-0 shrink-0">
                                        <div className="invisible group-hover:visible">
                                          <div className="flex items-center justify-between">
                                            <div className="grow mb-0 mr-0 items-center flex shrink-0 justify-center ">
                                              <button className="leading-[0] my-0 mx-[4px] text-sm rounded-full inline-block font-normal text-center relative w-full h-full hover:bg-alphaBg">
                                                <AiOutlineHeart className="text-white text-base p-[6px] rounded-[50%] leading-[66%] inline-block w-[30px] h-full" />
                                              </button>
                                            </div>
                                            <div className="grow mb-0 mr-0 items-center flex shrink-0 justify-center ">
                                              <button className="leading-[0] my-0 mx-[4px] text-sm rounded-full inline-block font-normal text-center relative w-full h-full hover:bg-alphaBg">
                                                <BiDotsHorizontalRounded className="text-white text-base p-[5px] rounded-[50%] leading-[66%] inline-block w-[30px] h-full" />
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="!mt-[30px]">
                    <div className="grow mx-auto my-0 relative w-full">
                      <h3 className="mb-[16px] flex justify-between items-center text-[20px] text-white font-bold capitalize">
                        Playlist/Album
                        <Link
                          to="/tim-kiem/playlist"
                          className="text-[12px] font-medium uppercase flex items-center text-songItemAction hover:text-purplePrimary"
                        >
                          Tất cả
                          <IoIosArrowRoundForward className="text-[18px] relative top-0 ml-[6px] text-inherit leading-[66%] inline-block" />
                        </Link>
                      </h3>
                      <div className="relative">
                        <div className="flex mx-[-15px] my-0 relative overflow-hidden">
                          <div className="flex z-[3] w-full">
                            {results[2]?.items?.map((playlist) => (
                              <motion.div
                                key={playlist._id}
                                className="xl:w-[20%] w-[25%] relative min-h-[1px] pl-[14px] pr-[14px] float-left shrink-0 px-[15px] py-0 flex flex-col "
                                initial={{ scale: 0.7, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.6 }}
                              >
                                <div>
                                  <div className="w-full max-w-full relative group">
                                    <Link
                                      to={`../../playList/${playlist.title}/${playlist._id}`}
                                    >
                                      <div className="relative block overflow-hidden rounded shrink-0">
                                        <div className="absolute top-0 left-0 bottom-0 right-0">
                                          <div
                                            className={`${
                                              isPlaying
                                                ? "visible"
                                                : "invisible"
                                            } w-full justify-evenly absolute left-[50%] top-[50%] bottom-auto right-auto z-[4] flex items-center translate-x-[-50%] translate-y-[-50%] group-hover:visible`}
                                          >
                                            <button className="text-[20px] rounded-full border-none inline-block text-center relative hover:bg-alphaBg">
                                              <AiOutlineClose className="text-[30px] text-white p-[5px] rounded-[50%] leading-[66%] inline-block" />
                                            </button>
                                            {isPlaying ? (
                                              <button className="text-[14px] rounded-full border-none iline-block text-center relative">
                                                <BiPause className="w-[45px] h-[45px] flex items-center justify-center border-[1px] border-solid border-white rounded-[50%] text-[20px] text-white" />
                                              </button>
                                            ) : (
                                              <button className="text-[14px] rounded-full border-none iline-block text-center relative">
                                                <BiPlay className="w-[45px] h-[45px] flex items-center justify-center border-[1px] border-solid border-white rounded-[50%] text-[20px] text-white" />
                                              </button>
                                            )}
                                            <button className="text-[20px] rounded-full border-none iline-block text-center relative">
                                              <BiDotsHorizontalRounded className="text-[35px] text-white p-[5px] rounded-[50%] leading-[66%] inline-block" />
                                            </button>
                                          </div>
                                        </div>
                                        <figure className="leading-0 h-0 pb-[100%] rounded-[5px] overflow-hidden bg-loadingBg transition-all duration-500 group-hover:scale-110 ">
                                          <img
                                            src={playlist.thumbnail}
                                            alt=""
                                            className="h-auto w-full "
                                          />
                                        </figure>
                                        <div className="w-full h-full absolute top-0 left-0 bg-darkAlpha50 invisible group-hover:visible"></div>
                                      </div>
                                    </Link>
                                  </div>
                                  <div>
                                    <h4 className="text-[14px] font-medium leading-[1.36] text-white overflow-hidden text-ellipsis block">
                                      <Link
                                        to={`../../playList/${playlist.title}/${playlist._id}`}
                                        className="font-medium text-left mt-[8px] mr-0 mb-[4px] flex hover:text-purplePrimary"
                                      >
                                        <span>{playlist.title}</span>
                                      </Link>
                                    </h4>
                                    <h3 className="text-[12px] font-basic leading-[1.33] text-songItemAction cursor-default">
                                      {playlist.userName}
                                    </h3>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* a */}
                  <div className="!mt-[30px]">
                    <div className="grow mx-auto my-0 relative w-full ">
                      <h3 className="mb-[16px] flex justify-between items-center text-[20px] text-white font-bold capitalize">
                        Nghệ Sĩ/OA
                        <Link
                          to="/tim-kiem/nghe-si"
                          className="text-[12px] font-medium uppercase flex items-center text-songItemAction hover:text-purplePrimary"
                        >
                          Tất cả
                          <IoIosArrowRoundForward className="text-[18px] relative top-0 ml-[6px] text-inherit leading-[66%] inline-block" />
                        </Link>
                      </h3>
                      <div className="relative">
                        <div className="flex mx-[-15px] my-0 overflow-hidden relative ">
                          <div className="flex z-[3] w-full">
                            {results[3]?.items?.map((artist) => (
                              <div
                                key={artist._id}
                                className="xl:w-[20%] w-[25%] relative min-h-[1px] pl-[14px] pr-[14px] float-left shrink-0 px-[10px] py-0 flex flex-col"
                              >
                                <div className="w-full text-center max-w-full relative ">
                                  <div className="relative ">
                                    <div className="overflow-hidden !rounded-full block relative shrink-0 group">
                                      <Link to="/">
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
                                      </Link>
                                    </div>
                                  </div>
                                  <div className="min-h-[52px]">
                                    <div className="text-[14px] font-medium leading-[1.36] text-white overflow-hidden text-ellipsis capitalize block ">
                                      <Link
                                        to="/"
                                        className="mt-[15px] whitespace-nowrap overflow-hidden text-ellipsis block text-center font-medium capitalize mr-0 mb-[4px] ml-0 "
                                      >
                                        <span>{artist.name}</span>
                                      </Link>
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
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AllSearch;
