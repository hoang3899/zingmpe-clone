import React, { useState } from "react";
import { actionType } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";

import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { getAllPlaylist } from "../api";

const NewTrack = ({ track, index, index01, myRef }) => {
  const [{ songs, songIndex, isSongPlaying, songsWait , isOpenInfoTrack ,allPlaylist ,user , songInfo}, dispatch] =
    useStateValue();

    const btn = useRef();
  const navigate = useNavigate();
  const [date, setDate] = useState(
    String(new Date().getDate()).padStart(2, "0")
  );
  const [month, setMonth] = useState(
    String(new Date().getMonth() + 1).padStart(2, "0") 
  );

  const [ releaseDate , setReleaseDate ] = useState(parseInt(track.releaseDate.slice(-2)));
  const [ releaseMonth , setReleaseMonth ] = useState(parseInt(track.releaseDate.slice(5,7)));
  
  const linkToArtist = (artist) => {
    dispatch({ type: actionType.GET_NAME_ARTIST, payload: artist });
    navigate(`/nghe-si/${artist.replace(artist.replace(/\s+/g, "-"))}`);
  };

  const handerSetPlay = () => {
    if (songsWait?.length !== songs?.length || !songsWait?.every((track,index) => track._id === songs[index]._id)) {
      dispatch({ type: actionType.SET_ALL_SONGS, payload: songsWait });
    }
    dispatch({ type: actionType.SET_SONG, payload: 3 * index + index01 });
    dispatch({ type: actionType.SET_SONG_PLAYING, payload: true });
    myRef.current.audio.current.play();
  };


  

  const handerSetPause = () => {
    dispatch({ type: actionType.SET_SONG_PLAYING, payload: false });
    myRef.current.audio.current.pause();
  };

  const infoTrack = () => {
    if (!isOpenInfoTrack) {
      const top = btn?.current.getBoundingClientRect().top;
      const left = btn?.current.getBoundingClientRect().left;
      dispatch({ type: actionType.INFO_TRACK, payload: [left, top, track] });
    } else {
      if (track._id !== songInfo._id) {
        const top = btn?.current.getBoundingClientRect().top;
        const left = btn?.current.getBoundingClientRect().left;
        dispatch({
          type: actionType.INFO_TRACK,
          payload: [left, top, track],
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
    <div
      className={`border-b-0 rounded hover:bg-alphaBg group ${
        songs ? (songs[songIndex]?._id === track._id || songInfo?._id === track._id ? "bg-alphaBg" : "") : ""
      }`}
      key={track._id}
    >
      <div className="flex items-center text-left p-[10px] rounded-[5px]">
        <div className="grow shrink flex w-[50%] mr-[10px] basic-auto">
          <div className="mr-[10px] shrink-0 block relative overflow-hidden rounded cursor-pointer">
            <figure className="w-[60px] h-[60px] bg-borderPrimary">
              <img src={track.thumbnail} alt="" />
            </figure>
            <div className="invisible w-full h-full absolute top-0 left-0 bg-darkAlpha50 "></div>
            {songs[songIndex]?._id === track._id ? (
              <div className="absolute top-0 left-0 bottom-0 right-0 ">
                <div className="visible w-full h-full absolute top-0 left-0 bg-darkAlpha50 "></div>
                <div className="absolute left-[50%] top-[50%] bottom-auto right-auto z-[98] flex justify-around items-center visible w-[80%] translate-x-[-50%] translate-y-[-50%]">
                  {isSongPlaying ? (
                    <button
                      className="text-[18px] leading-[0] h-[24px] rounded-full border-[0] inline-block text-center cursor-pointer relative font-normal p-[0]"
                      onClick={handerSetPause}
                    >
                      <BsPauseFill className="text-white text-4xl p-[5px] rounded-[50%] leading-[66%] inline-block" />
                    </button>
                  ) : (
                    <button
                      className="text-[18px] leading-[0] h-[24px] rounded-full border-[0] inline-block text-center cursor-pointer relative font-normal p-[0]"
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
                <div className="absolute left-[50%] top-[50%] bottom-auto right-auto z-[98] flex justify-around items-center invisible w-[80%] translate-x-[-50%] translate-y-[-50%] group-hover:visible">
                  <button
                    className="text-[18px] leading-[0] h-[24px] rounded-full border-[0] inline-block text-center cursor-pointer relative font-normal p-[0]"
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
              <span className="flex items-center grow shrink leading-[1.3] overflow-hidden max-w-full text-ellipsis font-medium align-top text-white whitespace-nowrap">
                {track.title}
              </span>
            </div>
            <h3 className="block text-xs mt-[3px] overflow-hidden max-w-full text-ellipsis font-normal text-songItemAction whitespace-nowrap hover:text-linkTextHover">
              {track.artistsNames.map((name, index02) => (
                <button
                  key={index02}
                  className="text-songItemAction inline-block hover:underline hover:!text-linkTextHover"
                  onClick={() => linkToArtist(name)}
                >
                  {name}
                  {index02 < track.artistsNames.length - 1 ? "," : ""}
                </button>
              ))}
            </h3>
            <div className="flex items-center text-[12px] leading-[18px] font-normal text-songItemAction mt-[3px] whitespace-nowrap">
              <span>
                {parseInt(month) === releaseMonth ? parseInt(date) - releaseDate > 0
                  ? `${
                      parseInt(date) - releaseDate
                    } ngày trước`
                  : "Hôm nay" : `${
                    31 + parseInt(date) - releaseDate
                  } ngày trước`
                  }{" "} 
              </span>
            </div>
          </div>
        </div>
        <div className="ml-[10px] basic-auto grow-0 shrink-0">
          <div className="invisible group-hover:visible">
            <div className="flex items-center justify-between">
              <div className="grow mb-0 mr-0 items-center flex shrink-0 justify-center ">
                <button className="leading-[0] my-0 mx-[4px] text-sm rounded-full inline-block font-normal text-center relative w-full h-full hover:bg-alphaBg"
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
  );
};

export default NewTrack;
