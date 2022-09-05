import React from "react";
import { useStateValue } from "./../context/StateProvider";
import { actionType } from "./../context/reducer";
import { putDislikeSong, putLikeSong } from "./../api/index";
import { BsPauseFill, BsPlayFill, BsHeartFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { GiMicrophone } from "react-icons/gi";
import { AiOutlineHeart } from "react-icons/ai";
import { BiDotsHorizontalRounded } from "react-icons/bi";

import { motion } from "framer-motion";

const SongMyMusic = ({ songLike, index, myRef }) => {
  const [{ user, songs, songIndex, isSongPlaying, songsLike }, dispatch] =
    useStateValue();

  const handerSetPlay = () => {
    if (songs?.length !== songsLike.length || !songsLike?.every((track,index) => track._id === songs[index]._id)) {
      dispatch({ type: actionType.SET_ALL_SONGS, payload: songsLike });
    }
    dispatch({ type: actionType.SET_SONG, payload: index });
    dispatch({ type: actionType.SET_SONG_PLAYING, payload: true });
    myRef.current.audio.current.pause();
  };

  const handerSetPause = () => {
    dispatch({ type: actionType.SET_SONG_PLAYING, payload: false });
    myRef.current.audio.current.pause();
  };

  const handleLikeSong = () => {
    if (user) {
      putLikeSong({ idUser: user._id, idTrack: songLike._id }).then((data) => {
        dispatch({ type: actionType.ADD_SONG_LIKE, payload: songLike });
      });
    } else {
      window.alert("Sorry, you did not login");
    }
  };

  const handleDislikeSong = () => {
    putDislikeSong({ idUser: user._id, idTrack: songLike._id }).then((data) => {
      dispatch({ type: actionType.REMOVE_SONG_DISLIKE, payload: songLike._id });
    });
  };
  return (
    <motion.div
      className="flex relative overflow-hidden rounded group"
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: "0%", opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className={`max-w-full grow border-b-[1px] border-b-solid border-b-sideBar rounded hover:bg-alphaBg ${
          songs[songIndex]?._id === songLike._id ? "bg-alphaBg" : ""
        }`}
      >
        <div className="rounded bg-transparent items-center flex text-left p-[10px] ">
          <div className="flex w-1/2 mr-[10px] grow ">
            <div className="mr-[10px] block relative overflow-hidden rounded cursor-pointer shrink-0">
              <figure className="w-[40px] h-[40px] bg-alphaBg p-[0] ">
                <img
                  src={songLike.thumbnail}
                  className="h-auto w-full "
                  alt=""
                />
              </figure>
              <div className="invisible group-hover:visible w-full h-full absolute top-0 left-0 bg-darkAlpha50 "></div>
              {songs[songIndex]?._id === songLike._id ? (
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
            <div className="overflow-hidden flex flex-col w-full ">
              <div className="max-w-full flex items-center ">
                <span className="flex items-center grow shrink leading-[1.3] overflow-hidden max-w-full text-ellipsis font-medium align-top text-white ">
                  {songLike.title}
                </span>
              </div>
              <h3 className="block text-xs mt-[3px] overflow-hidden max-w-full text-ellipsis font-normal text-songItemAction hover:text-linkTextHover">
                {songLike.artistsNames.map((name, index) => (
                  <Link
                    to="/"
                    key={index}
                    className="text-songItemAction inline-block hover:underline hover:!text-linkTextHover"
                  >
                    {name}
                    {index < songLike.artistsNames.length - 1 ? "," : ""}
                  </Link>
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
                  {user?.likes?.includes(songLike._id) ? (
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
                <div className="grow mb-0 mr-0 items-center flex justify-center">
                  <button className="leading-[0] p-[6px] my-0 mx-[4px] text-sm rounded-full inline-block font-normal text-center relative w-full h-full hover:bg-alphaBg">
                    <BiDotsHorizontalRounded className="text-white text-base p-[5px] rounded-[50%] leading-[66%] inline-block w-full h-full" />
                  </button>
                </div>
              </div>
            </div>
            <div className="group-hover:hidden">
              <div className="flex items-center justify-between">
                <div className="grow mb-0 mr-0 items-center flex justify-center">
                  {user?.likes?.includes(songLike._id) && (
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
                    {Math.floor(songLike.duration / 60)}:
                    {songLike.duration % 60 < 10
                      ? `0${songLike.duration % 60}`
                      : `${songLike.duration % 60}`}
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

export default SongMyMusic;
