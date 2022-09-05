import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStateValue } from "../context/StateProvider";
import { AiOutlineHeart } from "react-icons/ai";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BsHeartFill, BsPauseFill, BsPlayFill } from "react-icons/bs";
import { GiMicrophone } from "react-icons/gi";
import { toast } from "react-toastify";
import { getAllPlaylist, putDislikeSong, putLikeSong } from "../api";
import { actionType } from "../context/reducer";

const TrackArtist = ({ song, index, myRef }) => {
  const [
    { songsWait, songs, songIndex, isSongPlaying, user , isOpenInfoTrack , songInfo , allPlaylist},
    dispatch,
  ] = useStateValue();

  const btn = useRef();
  const navigate = useNavigate();


  const handerSetPlay = (index) => {
    if (songs?.length !== songsWait.length || !songsWait?.every((track,index) => track._id === songs[index]._id)) {
      dispatch({ type: actionType.SET_ALL_SONGS, payload: songsWait });
    }
    dispatch({ type: actionType.SET_SONG, payload: index });
    dispatch({ type: actionType.SET_SONG_PLAYING, payload: true });
    myRef.current.audio.current.play();
  };

  const handerSetPause = () => {
    dispatch({ type: actionType.SET_SONG_PLAYING, payload: false });
    myRef.current.audio.current.pause();
  };

  const linkToArtist = (artist) => {
    dispatch({ type: actionType.GET_NAME_ARTIST, payload: artist });
    navigate(`/nghe-si/${artist.replace(artist.replace(/\s+/g, "-"))}`);
  };

  const handleLikeSong = (id) => {
    if (user) {
      dispatch({ type: actionType.ADD_SONG_LIKE, payload: id });
      putLikeSong({ idUser: user._id, idTrack: id }).then((data) => {
        toast.success("You liked the song!");
      });
    } else {
      window.alert("Sorry, you did not login");
    }
  };

  const handleDislikeSong = (id) => {
    dispatch({ type: actionType.REMOVE_SONG_DISLIKE, payload: id });
    putDislikeSong({ idUser: user._id, idTrack: id }).then((data) => {
      toast.success("You disliked the song!");
    });
  };

  const infoTrack = () => {
    if (!isOpenInfoTrack) {
      const top = btn?.current.getBoundingClientRect().top;
      const left = btn?.current.getBoundingClientRect().left;
      dispatch({ type: actionType.INFO_TRACK, payload: [left, top, song] });
    } else {
      if (song._id !== songInfo._id) {
        const top = btn?.current.getBoundingClientRect().top;
        const left = btn?.current.getBoundingClientRect().left;
        dispatch({
          type: actionType.INFO_TRACK,
          payload: [left, top, song],
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
      key={song._id}
      className={`${songs[songIndex]?._id === song._id ? "bg-alphaBg" : ""} border-b-solid border-b-[1px] border-b-sideBar rounded group hover:bg-alphaBg`}
    >
      <div className="items-center flex text-left p-[10px] rounded-[5px]">
        <div className="flex w-[50%] mr-[10px] grow-0 shrink-0">
          <div className="mr-[10px] block relative rounded cursor-pointer shrink-0">
            <figure className="w-[40px] h-[40px] bg-alphaBg p-[0] ">
              <img src={song.thumbnail} className="h-auto w-full " alt="" />
            </figure>
            <div className="invisible group-hover:visible w-full h-full absolute top-0 left-0 bg-darkAlpha50 "></div>
            {songs[songIndex]?._id === song._id ? (
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
                      onClick={() => handerSetPlay(index)}
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
                    onClick={() => handerSetPlay(index)}
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
                {song.title}
              </span>
            </div>
            <h3 className="block text-xs mt-[3px] overflow-hidden max-w-full text-ellipsis font-normal text-songItemAction hover:text-linkTextHover">
              {song.artistsNames.map((name, index) => (
                <button
                  key={index}
                  className="text-songItemAction inline-block hover:underline hover:!text-linkTextHover"
                  onClick={() => linkToArtist(name)}
                >
                  {name}
                  {index < song.artistsNames.length - 1 ? "," : ""}
                </button>
              ))}
            </h3>
          </div>
        </div>
        <div className="grow shrink text-left align-center w-0">
          <div className="text-songItemAction text-[12px] whitespace-nowrap overflow-hidden max-w-full">
            <span>{song.plays_count}</span>
          </div>
        </div>
        <div className="grow-0 shrink-0 ml-[10px]">
          <div className="hidden group-hover:block">
            <div className="flex items-center justify-between">
              <div className="grow mb-0 mr-0 items-center flex justify-center ">
                <button className="leading-[0] p-[6px] my-0 mx-[4px] text-sm rounded-full inline-block font-normal text-center relative w-full h-full hover:bg-alphaBg">
                  <GiMicrophone className="text-white text-base p-[5px] rounded-[50%] leading-[66%] inline-block w-full h-full" />
                </button>
              </div>
              <div className="grow mb-0 mr-0 items-center flex justify-center">
                {user?.likes?.includes(song._id) ? (
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
                <button className="leading-[0] p-[6px] my-0 mx-[4px] text-sm rounded-full inline-block font-normal text-center relative w-full h-full hover:bg-alphaBg"
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
                {user?.likes?.includes(song._id) && (
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
                  {Math.floor(song.duration / 60)}:
                  {song.duration % 60 < 10
                    ? `0${song.duration % 60}`
                    : `${song.duration % 60}`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackArtist;
