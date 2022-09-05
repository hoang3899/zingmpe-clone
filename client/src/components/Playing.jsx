import React, { useRef, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { actionType } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";
import {
  getAllPlaylist,
  getTrackbyId,
  putDislikeSong,
  updatePlayCount,
} from "../api";
import { useEffect } from "react";
import { Link } from "react-router-dom";

import { AiOutlineHeart } from "react-icons/ai";
import { BiDotsHorizontalRounded, BiCameraMovie } from "react-icons/bi";
import { GiMicrophone } from "react-icons/gi";
import { BsHeartFill, BsMusicNoteList } from "react-icons/bs";
import { TbScreenShare } from "react-icons/tb";
import ListSongsPlay from "./ListSongsPlay";
import { putLikeSong } from "./../api/index";
import { memo } from "react";
import { toast } from "react-toastify";

const Playing = ({ myRef }) => {
  const [
    { songIndex, songs, user, isOpenInfoTrack, songInfo, allPlaylist },
    dispatch,
  ] = useStateValue();

  const [isOpen, setIsOpen] = useState(false);

  const btn = useRef();

  const nextTrack = () => {
    if (songIndex >= songs.length - 1) {
      dispatch({
        type: actionType.SET_SONG,
        payload: 0,
      });
    } else {
      dispatch({
        type: actionType.SET_SONG,
        payload: songIndex + 1,
      });
    }
  };

  const previousTrack = () => {
    if (songIndex === 0) {
      dispatch({
        type: actionType.SET_SONG,
        payload: 0,
      });
    } else {
      dispatch({
        type: actionType.SET_SONG,
        payload: songIndex - 1,
      });
    }
  };

  const handleNextSong = () => {
    if (songIndex >= songs.length - 1) {
      dispatch({
        type: actionType.SET_SONG,
        payload: 0,
      });
      if (songs[songIndex]?._id === songs[songIndex + 1]?._id) {
        myRef.current.audio.current.currentTime = 0;
        myRef.current.audio.current.play();
      }
    } else {
      dispatch({
        type: actionType.SET_SONG,
        payload: songIndex + 1,
      });
      if (songs[songIndex]?._id === songs[songIndex + 1]?._id) {
        myRef.current.audio.current.currentTime = 0;
        myRef.current.audio.current.play();
      }
    }
  };
  const handleListen = (e) => {
    getTrackbyId(songs[songIndex]?._id).then((data) => {
      updatePlayCount(data._id, data.plays_count).then((result) => {
        console.log(result.plays_count);
      });
    });
  };

  const handlePause = () => {
    dispatch({ type: actionType.SET_SONG_PLAYING, payload: false });
  };

  const handlePlay = () => {
    dispatch({ type: actionType.SET_SONG_PLAYING, payload: true });
  };

  const likeSong = () => {
    if (user) {
      dispatch({ type: actionType.ADD_SONG_LIKE, payload: songs[songIndex] });
      putLikeSong({ idUser: user._id, idTrack: songs[songIndex]?._id }).then(
        (data) => {}
      );
    } else {
      toast.warning("Sorry, you did not login");
    }
  };

  const dislikeSong = () => {
    dispatch({
      type: actionType.REMOVE_SONG_DISLIKE,
      payload: songs[songIndex]?._id,
    });
    putDislikeSong({ idUser: user._id, idTrack: songs[songIndex]?._id }).then(
      (data) => {}
    );
  };

  const infoTrack = () => {
    if (!isOpenInfoTrack) {
      const top = btn?.current.getBoundingClientRect().top;
      const left = btn?.current.getBoundingClientRect().left;
      dispatch({
        type: actionType.INFO_TRACK,
        payload: [left + 300 , top - 80, songs[songIndex]],
      });
    } else {
      if (songs[songIndex]._id !== songInfo._id) {
        const top = btn?.current.getBoundingClientRect().top;
        const left = btn?.current.getBoundingClientRect().left;
        dispatch({
          type: actionType.INFO_TRACK,
          payload: [left + 300, top - 80, songs[songIndex]],
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

  return (
    <div className="fixed bottom-0 w-full bg-layoutBg z-[999] cursor-pointer">
      <div className="h-[90px] min-w-[768px] py-0 px-[20px] bg-playerBg border-t-[1px] border-t-solid border-t-borderPrimary flex items-center justify-between ">
        <div className="relative w-[30%] z-[999] items-center justify-start grow-0 shrink-0">
          <div className="items-center flex grow-0 shrink-0 justify-center">
            <div className="p-0 w-full items-center flex text-left rounded-md">
              <div className="mr-[10px] grow-0 shrink-0">
                <Link to="/">
                  <div className="relative rounded overflow-hidden">
                    <div className="relative overflow-hidden ">
                      <figure className="w-[64px] h-[64px] rounded overflow-hidden bg-borderPrimary">
                        <img
                          src={songs[songIndex]?.thumbnail}
                          className="inline-block align-top h-auto w-full"
                          alt=""
                        />
                      </figure>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="max-w-[155px] min-w-0 grow shrink text-left seft-center w-0 ">
                <div className="max-w-full flex items-center ">
                  <span className="flex items-center grow shrink leading-[1.3] overflow-hidden max-w-full text-ellipsis font-medium align-top text-white ">
                    {songs[songIndex]?.title}
                  </span>
                </div>
                <h3 className="block text-xs mt-[3px] overflow-hidden max-w-full text-ellipsis font-normal text-songItemAction hover:text-linkTextHover">
                  {songs[songIndex]?.artistsNames.map((name, index) => (
                    <Link
                      to="/"
                      key={index}
                      className="text-songItemAction inline-block hover:underline hover:!text-linkTextHover"
                    >
                      {name}
                      {index < songs[songIndex]?.artistsNames.length - 1
                        ? ","
                        : ""}
                    </Link>
                  ))}
                </h3>
              </div>
              <div className="ml-0 grow-0 shrink-0 ">
                <div className="flex items-center justify-between">
                  <div className="grow mb-0 mr-0 items-center flex shrink-0 justify-center">
                    {user?.likes?.includes(songs[songIndex]?._id) ? (
                      <button
                        className="leading-[0] p-[6px] my-0 mx-[4px] text-sm rounded-full inline-block font-normal text-center relative w-full h-full hover:bg-alphaBg"
                        onClick={dislikeSong}
                      >
                        <BsHeartFill className="text-purplePrimary text-base p-[5px] rounded-[50%] leading-[66%] inline-block w-full h-full" />
                      </button>
                    ) : (
                      <button
                        className="leading-[0] p-[6px] my-0 mx-[4px] text-sm rounded-full inline-block font-normal text-center relative w-full h-full hover:bg-alphaBg"
                        onClick={likeSong}
                      >
                        <AiOutlineHeart className="text-white text-base p-[5px] rounded-[50%] leading-[66%] inline-block w-full h-full" />
                      </button>
                    )}
                  </div>
                  <div className="grow mb-0 mr-0 items-center flex shrink-0 justify-center ">
                    <button
                      className="leading-[0] p-[6px] my-0 mx-[4px] text-sm rounded-full inline-block font-normal text-center relative w-full h-full hover:bg-alphaBg"
                      ref={btn}
                      onClick={infoTrack}
                    >
                      <BiDotsHorizontalRounded className="text-white text-base p-[5px] rounded-[50%] leading-[66%] inline-block w-[30px] h-full" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grow max-w-[40vw] bg-layoutBg ">
          <AudioPlayer
            className="!bg-playerBg "
            src={songs[songIndex]?.link}
            layout="stacked-reverse"
            ref={myRef}
            volume={0.3}
            autoPlay={false}
            onEnded={handleNextSong}
            onPlay={handlePlay}
            onPause={handlePause}
            listenInterval={50000}
            onListen={handleListen}
            showSkipControls={true}
            showJumpControls={true}
            onClickNext={nextTrack}
            onClickPrevious={previousTrack}
          />
        </div>
        <div className="flex w-[30%] items-center justify-end grow-0 shrink-0 ">
          <div className="mb-0 mr-0 items-center flex grow-0 shrink-0 justify-center ">
            <button className="p-[3px] mx-[2px] my-0 border-none text-white text-sm rounded-full inline-block text-center relative hover:bg-borderPrimary">
              <BiCameraMovie className="text-[30px] p-[5px] rounded-[50%] leading-[66%] inline-block text-white" />
            </button>
          </div>
          <div className="mb-0 mr-0 items-center flex grow-0 shrink-0 justify-center ">
            <button className="p-[3px] mx-[2px] my-0 border-none text-white text-sm rounded-full inline-block text-center relative hover:bg-borderPrimary">
              <GiMicrophone className="text-[30px] p-[5px] rounded-[50%] leading-[66%] inline-block text-white" />
            </button>
          </div>
          <div className="mb-0 mr-0 items-center flex grow-0 shrink-0 justify-center ">
            <button className="p-[3px] mx-[2px] my-0 border-none text-white text-sm rounded-full inline-block text-center relative hover:bg-borderPrimary">
              <TbScreenShare className="text-[30px] p-[5px] rounded-[50%] leading-[66%] inline-block text-white" />
            </button>
          </div>
          <div className="mb-0 mr-0 items-center flex grow-0 shrink-0 justify-center ">
            <span className="block h-[33px] w-[1px] bg-borderPrimary mx-[20px] my-0"></span>
          </div>
          <div className="items-center flex grow-0 shrink-0 justify-center">
            <button
              className={`${
                isOpen ? "bg-purplePrimary" : "bg-borderPrimary"
              } relative  rounded h-[30px] py-0 px-[5px] border-[1px] border-solid border-transparent font-medium text-white text-xs `}
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="text-sm rounded-full border-0 inline-block text-center cursor-pointer relative">
                <BsMusicNoteList className="top-[2px] text-base relative leading-[66%]" />
              </div>
            </button>
          </div>
        </div>
      </div>
      {isOpen && <ListSongsPlay myRef={myRef} />}
    </div>
  );
};

export default memo(Playing);
