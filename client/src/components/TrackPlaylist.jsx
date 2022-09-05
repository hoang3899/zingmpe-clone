import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { actionType } from "../context/reducer";
import { AiOutlineHeart } from "react-icons/ai";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BsHeartFill, BsPauseFill, BsPlayFill } from "react-icons/bs";
import { MdDragIndicator } from "react-icons/md";
import { GiMicrophone } from "react-icons/gi";

import { motion } from "framer-motion";
import { useStateValue } from "../context/StateProvider";
import { getAllPlaylist, putDislikeSong, putLikeSong } from "../api";
import { toast } from "react-toastify";

const TrackPlaylist = ({ isPlaying, track, myRef, setIsPlaying, index }) => {
  const btn = useRef();

  const [
    {
      user,
      songs,
      songIndex,
      isSongPlaying,
      songInfo,
      currentPlaylist,
      isOpenInfoTrack,
      allPlaylist
    },
    dispatch,
  ] = useStateValue();

  const handleLikeSong = (track) => {
    if (user) {
      dispatch({ type: actionType.ADD_SONG_LIKE, payload: track });
      putLikeSong({ idUser: user._id, idTrack: track._id }).then((data) => {
        toast.success("You added the song to the track favorites list.")
      });
    } else {
      window.alert("Sorry, you did not login");
    }
  };

  const handleDislikeSong = (track) => {
    dispatch({ type: actionType.REMOVE_SONG_DISLIKE, payload: track._id });
    putDislikeSong({ idUser: user._id, idTrack: track._id }).then((data) => {
      toast.success("You removed the song to the track favorites list.")
    });
  };

  

  const infoTrack = () => {
    if (!isOpenInfoTrack) {
      const top = btn?.current.getBoundingClientRect().top;
      const left = btn?.current.getBoundingClientRect().left;
      dispatch({ type: actionType.INFO_TRACK, payload: [left, top, track] });
    } else {
      if (track._id !== songInfo?._id) {
        const top = btn?.current.getBoundingClientRect().top;
        const left = btn?.current.getBoundingClientRect().left;
        dispatch({
          type: actionType.INFO_TRACK,
          payload: [left, top, track],
        });
      } else {
        dispatch({ type: actionType.SET_OPEN_SUB_INFO_TRACK });
      }
    }
    if (!allPlaylist && user) {
      getAllPlaylist(user._id).then((allPlaylist) => {
        dispatch({ type: actionType.SET_ALL_PLAYLIST, payload: allPlaylist });
      });
    }
  };

  const handerSetPlay = () => {
    if (isPlaying) {
      dispatch({ type: actionType.SET_SONG, payload: index });
      dispatch({ type: actionType.SET_SONG_PLAYING, payload: true });
    } else {
      dispatch({
        type: actionType.SET_ALL_SONGS,
        payload: currentPlaylist.tracks,
      });
      dispatch({ type: actionType.SET_SONG, payload: index });
      dispatch({ type: actionType.SET_SONG_PLAYING, payload: true });
    }
    setIsPlaying(true);
    myRef.current.audio.current.play();
  };

  const handerSetPause = () => {
    dispatch({ type: actionType.SET_SONG_PLAYING, payload: false });
    myRef.current.audio.current.pause();
  };

  return (
    <motion.div
      className="grow group hover:bg-alphaBg"
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: "0%", opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className={`${
          songs
            ? songs[songIndex]?._id === track._id || songInfo?._id === track._id
              ? "bg-alphaBg"
              : ""
            : songInfo?._id === track._id
            ? "bg-alphaBg"
            : ""
        } flex relative `}
      >
        <div className="group-hover:flex cursor-pointer absolute w-[34px] h-[34px] hidden items-center justify-center translate-y-[-50%] top-[50%] z-[2]">
          <label
            htmlFor="check"
            className="justify-center items-center cursor-pointer relative leading-[1.25] flex text-[12px] bg-layoutBg"
          >
            <input
              type="checkbox"
              name="check"
              id="check"
              className="border-borderBox m-0 p-[6px] rounded-[3px] border-[1px] border-solid !bg-layoutBg cursor-pointer"
            />
          </label>
        </div>
        <div className="grow max-w-full border-b-sideBar border-b-[1px] border-b-solid rounded">
          <div className="items-center flex text-left p-[10px] rounded-[5px] justify-between">
            <div className="flex w-[60%] mr-[10px] grow-0 shrink-0 ">
              <div className="flex justify-center items-center text-[12px] text-songItemAction font-bold !m-0 ">
                <MdDragIndicator className="cursor-move mr-[5px] text-[18px] text-white opacity-[0.3] leading-[66%] inline-block group-hover:opacity-[0]" />
              </div>
              <div className="mr-[10px] grow-0 shrink-0 block relative overflow-hidden rounded cursor-pointer">
                <figure className="w-[40px] h-[40px] rounded overflow-hidden bg-borderPrimary">
                  <img
                    src={track.thumbnail}
                    className="inline-block align-top h-auto w-full"
                    alt=""
                  />
                </figure>
                <div className="invisible w-full h-full absolute top-0 left-0 bg-songItemAction group-hover:visible"></div>
                {songs[songIndex]?._id === track._id ? (
                  <div className="absolute top-0 left-0 bottom-0 right-0 ">
                    <div className="visible w-full h-full absolute top-0 left-0 bg-darkAlpha50 "></div>
                    <div className="absolute left-[4px] top-[4px] bottom-auto right-auto z-[98] flex justify-around items-center visible w-[80%] ">
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
                    <div className="absolute left-[4px] top-[4px] bottom-auto right-auto z-[98] flex justify-around items-center invisible w-[80%] group-hover:visible">
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
              <div className="max-w-[155px] min-w-0 grow shrink text-left seft-center w-0 ">
                <div className="max-w-full flex items-center ">
                  <span className="flex items-center grow shrink leading-[1.3] overflow-hidden max-w-full text-ellipsis font-medium align-top text-white ">
                    {track.title}
                  </span>
                </div>
                <h3 className="block text-xs mt-[3px] overflow-hidden max-w-full text-ellipsis font-normal text-songItemAction hover:text-linkTextHover">
                  {track.artistsNames.map((name, index) => (
                    <Link
                      to="/"
                      key={index}
                      className="text-songItemAction inline-block hover:underline hover:!text-linkTextHover"
                    >
                      {name}
                      {index < track.artistsNames.length - 1 ? "," : ""}
                    </Link>
                  ))}
                </h3>
              </div>
            </div>
            <div className="ml-[10px] grow-0 shrink-0">
              <div className="hidden group-hover:block">
                <div className="flex items-center justify-between">
                  <div className="grow mb-0 mr-0 items-center flex justify-center">
                    <button className="leading-[0] p-[6px] my-0 mx-[4px] text-sm rounded-full inline-block font-normal text-center relative w-full h-full hover:bg-alphaBg">
                      <GiMicrophone className="text-white text-base p-[5px] rounded-[50%] leading-[66%] inline-block w-full h-full" />
                    </button>
                  </div>
                  <div className="grow mb-0 mr-0 items-center flex justify-center">
                    {user?.likes?.includes(track._id) ? (
                      <button
                        className="leading-[0] p-[6px] my-0 mx-[4px] text-sm rounded-full inline-block font-normal text-center relative w-full h-full hover:bg-alphaBg"
                        onClick={() => handleDislikeSong(track)}
                      >
                        <BsHeartFill className="text-purplePrimary text-base p-[5px] rounded-[50%] leading-[66%] inline-block w-full h-full" />
                      </button>
                    ) : (
                      <button
                        className="leading-[0] p-[6px] my-0 mx-[4px] text-sm rounded-full inline-block font-normal text-center relative w-full h-full hover:bg-alphaBg"
                        onClick={() => handleLikeSong(track)}
                      >
                        <AiOutlineHeart className="text-white text-base p-[5px] rounded-[50%] leading-[66%] inline-block w-full h-full" />
                      </button>
                    )}
                  </div>
                  <div className="relative grow mb-0 mr-0 items-center flex justify-center">
                    <button
                      className="leading-[0] p-[6px] my-0 mx-[4px] text-sm rounded-full inline-block font-normal text-center relative w-full h-full hover:bg-alphaBg "
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
                    {user?.likes?.includes(track._id) && (
                      <button className="leading-[0] p-[6px] my-0 mx-[4px] text-sm rounded-full inline-block font-normal text-center relative w-full h-full hover:bg-alphaBg">
                        <BsHeartFill className="text-purplePrimary text-base p-[5px] rounded-[50%] leading-[66%] inline-block w-full h-full" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-xs w-[46px] text-songItemAction grow items-center flex justify-center">
                      {Math.floor(track.duration / 60)}:
                      {track.duration % 60 < 10
                        ? `0${track.duration % 60}`
                        : `${track.duration % 60}`}
                    </div>
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

export default React.memo(TrackPlaylist);
