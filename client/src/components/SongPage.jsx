import React, { useState } from "react";
import { BsDash, BsHeartFill } from "react-icons/bs";
import {
  AiFillLike,
  AiOutlineHeart,
  AiOutlinePlusCircle,
  AiOutlinePlusSquare,
} from "react-icons/ai";
import { BsPlayFill, BsPauseFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { GiMicrophone } from "react-icons/gi";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";
import { putLikeSong, putDislikeSong, getAllPlaylist } from "./../api/index";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";

const SongPage = ({ songWait, index, myRef }) => {
  const [
    { user, songsWait, songs, songIndex, isSongPlaying, songInfo, allPlaylist , isOpenInfoTrack },
    dispatch,
  ] = useStateValue();

  const btn = useRef();
  const navigate = useNavigate();

  const handerSetPlay = () => {
    if (songs?.length !== songsWait.length || !songsWait?.every((track,index) => track._id === songs[index]._id)) {
      dispatch({ type: actionType.SET_ALL_SONGS, payload: songsWait });
    }
    dispatch({ type: actionType.SET_SONG, payload: index - 1 });
    dispatch({ type: actionType.SET_SONG_PLAYING, payload: true });
    myRef.current.audio.current.play();
  };

  const handerSetPause = () => {
    dispatch({ type: actionType.SET_SONG_PLAYING, payload: false });
    myRef.current.audio.current.pause();
  };

  const handleLikeSong = () => {
    if (user) {
      dispatch({ type: actionType.ADD_SONG_LIKE, payload: songWait });
      putLikeSong({ idUser: user._id, idTrack: songWait._id }).then((data) => {
        toast.success("You liked the song!");
      });
    } else {
      window.alert("Sorry, you did not login");
    }
  };

  const handleDislikeSong = () => {
    dispatch({ type: actionType.REMOVE_SONG_DISLIKE, payload: songWait._id });
    putDislikeSong({ idUser: user._id, idTrack: songWait._id }).then((data) => {
      toast.success("You disliked the song!");
    });
  };

  const linkToArtist = (artist) => {
    dispatch({ type: actionType.GET_NAME_ARTIST, payload: artist });
    navigate(`/nghe-si/${artist.replace(artist.replace(/\s+/g, "-"))}`);
  };

  const infoTrack = () => {
    if (!isOpenInfoTrack) {
      const top = btn?.current.getBoundingClientRect().top;
      const left = btn?.current.getBoundingClientRect().left;
      dispatch({ type: actionType.INFO_TRACK, payload: [left, top, songWait] });
    } else {
      if (songWait._id !== songInfo._id) {
        const top = btn?.current.getBoundingClientRect().top;
        const left = btn?.current.getBoundingClientRect().left;
        dispatch({
          type: actionType.INFO_TRACK,
          payload: [left, top, songWait],
        });
      } else {
        dispatch({type: actionType.SET_OPEN_SUB_INFO_TRACK});
      }
    }
    if (!allPlaylist && user) {
      getAllPlaylist(user._id).then((allPlaylist) => {
        dispatch({ type: actionType.SET_ALL_PLAYLIST, payload: allPlaylist });
      });
    }
  };
  
  return (
    <motion.div
      className="rounded group"
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: "0%", opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className={`border-b-[1px] border-b-solid border-b-sideBar rounded hover:bg-alphaBg ${
          songs
            ? songs[songIndex]?._id === songWait._id || songInfo?._id === songWait._id
              ? "bg-alphaBg"
              : ""
            : ""
        }`}
      >
        <div className="rounded bg-transparent items-center flex text-left p-[10px] ">
          <div className="flex w-1/2 mr-[10px] grow ">
            <div className="flex justify-center items-center text-xs text-songItemAction font-bold mr-[15px]">
              <span
                className={`w-[40px] text-[rgba(74,144,226,0)] m-w-[38px] text-[32px] font-black font-[Roboto,sans-serif] flex seft-center items-center mr-[5px] is-top-${
                  index < 4 ? index : 4
                }`}
              >
                {index}
              </span>
              <div className="w-[18px] h-[36px] flex flex-col justify-center items-center text-textItemHover ">
                <BsDash className="text-songItemAction flex seft-center justify-center items-center w-[18px] h-[18px] leading-[66%] " />
              </div>
            </div>
            <div className="mr-[10px] block relative rounded cursor-pointer shrink-0">
              <figure className="w-[40px] h-[40px] bg-alphaBg p-[0] ">
                <img
                  src={songWait.thumbnail}
                  className="h-auto w-full "
                  alt=""
                />
              </figure>
              <div className="invisible group-hover:visible w-full h-full absolute top-0 left-0 bg-darkAlpha50 "></div>
              {songs[songIndex]?._id === songWait._id ? (
                <div className="absolute top-0 left-0 bottom-0 right-0 ">
                  <div className="visible w-full h-full absolute top-0 left-0 bg-darkAlpha50 "></div>
                  <div className="absolute left-[4px] top-[4px] bottom-auto right-auto z-[90] flex justify-around items-center visible w-[80%] ">
                    {isSongPlaying ? (
                      <button
                        className="text-lg leading-[0] h-[24px] rounded-full border-[0] inline-block text-center cursor-pointer relative font-normal p-[0]"
                        onClick={handerSetPause}
                      >
                        <BsPauseFill className="text-white text-4xl p-[5px] rounded-[50%] leading-[66%] inline-block" />
                      </button>
                    ) : (
                      <button
                        className="text-lg leading-[0] h-[24px] rounded-full border-[0] inline-block text-center cursor-pointer relative font-normal p-[0]"
                        onClick={handerSetPlay}
                      >
                        <BsPlayFill className="text-white text-4xl p-[5px] rounded-[50%] leading-[66%] inline-block" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="absolute top-0 left-0 bottom-0 right-0 ">
                  <div className="invisible group-hover:visible w-full h-full absolute top-0 left-0 bg-darkAlpha50 "></div>
                  <div className="absolute left-[4px] top-[4px] bottom-auto right-auto z-[90] flex justify-around items-center invisible w-[80%] group-hover:visible">
                    <button
                      className="text-lg leading-[0] h-[24px] rounded-full border-[0] inline-block text-center cursor-pointer relative font-normal p-[0]"
                      onClick={handerSetPlay}
                    >
                      <BsPlayFill className="text-white text-4xl p-[5px] rounded-[50%] leading-[66%] inline-block" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="overflow-hidden flex flex-col w-full ">
              <div className="max-w-full flex items-center ">
                <span className="flex items-center grow shrink leading-[1.3] overflow-hidden max-w-full text-ellipsis font-medium align-top text-white ">
                  {songWait.title}
                </span>
              </div>
              <h3 className="block text-xs mt-[3px] overflow-hidden max-w-full text-ellipsis font-normal text-songItemAction hover:text-linkTextHover">
                {songWait.artistsNames.map((name, index) => (
                  <button
                    key={index}
                    className="text-songItemAction inline-block hover:underline hover:!text-linkTextHover"
                    onClick={() => linkToArtist(name)}
                  >
                    {name}
                    {index < songWait.artistsNames.length - 1 ? "," : ""}
                  </button>
                ))}
              </h3>
            </div>
          </div>
          <div className="grow-0 shrink-0">
            <div className="hidden group-hover:block">
              <div className="flex items-center justify-between">
                <div className="grow mb-0 mr-0 items-center flex justify-center ">
                  <button className="leading-[0] p-[6px] my-0 mx-[4px] text-sm rounded-full inline-block font-normal text-center relative w-full h-full hover:bg-alphaBg">
                    <GiMicrophone className="text-white text-base p-[5px] rounded-[50%] leading-[66%] inline-block w-full h-full" />
                  </button>
                </div>
                <div className="grow mb-0 mr-0 items-center flex justify-center">
                  {user?.likes?.includes(songWait._id) ? (
                    <button
                      className="leading-[0] p-[6px] my-0 mx-[4px] text-sm rounded-full inline-block font-normal text-center relative w-full h-full hover:bg-alphaBg"
                      onClick={handleDislikeSong}
                    >
                      <BsHeartFill className="text-purplePrimary text-base p-[5px] rounded-[50%] leading-[66%] inline-block w-full h-full" />
                    </button>
                  ) : (
                    <button
                      className="leading-[0] p-[6px] my-0 mx-[4px] text-sm rounded-full inline-block font-normal text-center relative w-full h-full hover:bg-alphaBg"
                      onClick={handleLikeSong}
                    >
                      <AiOutlineHeart className="text-white text-base p-[5px] rounded-[50%] leading-[66%] inline-block w-full h-full" />
                    </button>
                  )}
                </div>
                <div className="relative grow mb-0 mr-0 items-center flex justify-center">
                  <button
                    className="leading-[0] p-[6px] my-0 mx-[4px] text-sm rounded-full inline-block font-normal text-center relative w-full h-full hover:bg-alphaBg"
                    ref={btn}
                    onClick={infoTrack}
                  >
                    <BiDotsHorizontalRounded className="text-white text-base p-[5px] rounded-[50%] leading-[66%] inline-block w-full h-full" />
                  </button>
                </div>
              </div>
            </div>
            <div className="group-hover:hidden">
              <div className="flex items-center justify-between">
                <div className="grow mb-0 mr-0 items-center flex justify-center">
                  {user?.likes?.includes(songWait._id) && (
                    <button
                      className="leading-[0] p-[6px] my-0 mx-[4px] text-sm rounded-full inline-block font-normal text-center relative w-full h-full hover:bg-alphaBg"
                      onClick={handleDislikeSong}
                    >
                      <BsHeartFill className="text-purplePrimary text-base p-[5px] rounded-[50%] leading-[66%] inline-block w-full h-full" />
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-xs w-[46px] text-songItemAction grow items-center flex justify-center">
                    {Math.floor(songWait.duration / 60)}:
                    {songWait.duration % 60 < 10
                      ? `0${songWait.duration % 60}`
                      : `${songWait.duration % 60}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SongPage;
