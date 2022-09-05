import React from 'react'
import { useStateValue } from '../context/StateProvider'
import { FiMusic } from 'react-icons/fi'
import { Link } from 'react-router-dom';
import { BsHeartFill, BsPauseFill, BsPlayFill } from 'react-icons/bs';
import { AiOutlineHeart } from 'react-icons/ai';
import { IoAddOutline } from 'react-icons/io5'
import { addTrackPlaylist } from '../api';
import { toast } from 'react-toastify';
import { actionType } from '../context/reducer';

const StreamPlaylist = ({trackStream}) => {
  const [{  songs, songIndex , isSongPlaying , user , currentPlaylist , allPlaylist} , dispatch] = useStateValue();

  const handerSetPause = () => {
    
  }

  const handerSetPlay = () => {

  }

  const handleDislikeSong = () => {

  }

  const handleLikeSong = () => {

  }

  const handleAddTrack = () => {
    if(currentPlaylist?.tracks?.some((song) => song._id === trackStream._id )){
      toast.warn("Track already exists in playlist!");
    } else {
      addTrackPlaylist(currentPlaylist?._id,trackStream).then((data) => {
        toast.success("Add track to playlist success!")
      });
      dispatch({type: actionType.REMOVE_TRACK_RELATE , payload: trackStream})
      dispatch({type: actionType.UPDATE_CURRENT_PLAYLIST, payload: trackStream});
    }
  }
  return (
    <div className="border-b-solid border-b-[1px] border-sideBar group hover:bg-alphaBg">
      <div className="flex items-center text-left p-[10px] rounded-[5px] justify-between">
        <div className="flex w-[60%] mr-[10px] grow-0 shrink-0 ">
          <div className="flex justify-center items-center text-[12px] text-songItemAction font-bold !m-0 ">
            <FiMusic className="cursor-move mr-[5px] text-[18px] text-white opacity-[0.3] leading-[66%] inline-block group-hover:opacity-[0]"/>
          </div>
          <div className="mr-[10px] grow-0 shrink-0 block relative overflow-hidden rounded cursor-pointer">
            <figure className="w-[40px] h-[40px] rounded overflow-hidden bg-borderPrimary">
              <img src={trackStream.thumbnail} className="inline-block align-top h-auto w-full" alt="" />
            </figure>
            <div className="invisible w-full h-full absolute top-0 left-0 bg-songItemAction group-hover:visible"></div>
            {songs[songIndex]?._id === trackStream._id ? (
              <div className="absolute top-0 left-0 bottom-0 right-0 ">
                <div className="visible w-full h-full absolute top-0 left-0 bg-darkAlpha50 "></div>
                <div className="absolute left-[4px] top-[4px] bottom-auto right-auto z-[98] flex justify-around items-center visible w-[80%] ">
                    {isSongPlaying ? (
                        <button className="text-lg leading-[0] h-[24px] rounded-full border-[0] inline-block text-center cursor-pointer relative font-normal p-[0]"
                        onClick={handerSetPause}
                        >
                            <BsPauseFill className="text-white text-4xl p-[5px] rounded-[50%] leading-[66%] inline-block"/>
                        </button>
                    ) : (
                        <button className="text-lg leading-[0] h-[24px] rounded-full border-[0] inline-block text-center cursor-pointer relative font-normal p-[0]" 
                        onClick={handerSetPlay}
                        >
                            <BsPlayFill className="text-white text-4xl p-[5px] rounded-[50%] leading-[66%] inline-block"/>
                        </button>
                    )}
                    
                </div>
              </div>
              ) : (
              <div className="absolute top-0 left-0 bottom-0 right-0 ">
                  <div className="invisible group-hover:visible w-full h-full absolute top-0 left-0 bg-darkAlpha50 "></div>
                  <div className="absolute left-[4px] top-[4px] bottom-auto right-auto z-[98] flex justify-around items-center invisible w-[80%] group-hover:visible">
                      <button className="text-lg leading-[0] h-[24px] rounded-full border-[0] inline-block text-center cursor-pointer relative font-normal p-[0]" 
                      onClick={handerSetPlay}
                      >
                          <BsPlayFill className="text-white text-4xl p-[5px] rounded-[50%] leading-[66%] inline-block"/>
                      </button>
                  </div>
              </div>
              )}
          </div>
          <div className="max-w-[155px] min-w-0 grow shrink text-left seft-center w-0 ">
            <div className="max-w-full flex items-center ">
                <span className="flex items-center grow shrink leading-[1.3] overflow-hidden max-w-full text-ellipsis font-medium align-top text-white ">
                    {trackStream.title}
                </span>
            </div>
            <h3 className="block text-xs mt-[3px] overflow-hidden max-w-full text-ellipsis font-normal text-songItemAction hover:text-linkTextHover">
                {trackStream.artistsNames.map((name,index) => (
                    <Link to="/" key={index} className="text-songItemAction inline-block hover:underline hover:!text-linkTextHover">{name}
                      {index < trackStream.artistsNames.length - 1 ? "," : ""}
                    </Link>
                ))}
            </h3>
          </div>
        </div>
        <div className="ml-[10px] grow-0 shrink-0">
          <div className="hidden group-hover:block">
            <div className="flex items-center justify-between">
              <div className="grow mb-0 mr-0 items-center flex justify-center">
                  {user?.likes?.includes(trackStream._id) ? (
                      <button className="leading-[0] p-[6px] my-0 mx-[4px] text-sm rounded-full inline-block font-normal text-center relative w-full h-full hover:bg-alphaBg" 
                      onClick={() => handleDislikeSong(trackStream)}>
                          <BsHeartFill className="text-purplePrimary text-base p-[5px] rounded-[50%] leading-[66%] inline-block w-full h-full"/>
                      </button>
                  ) : (
                      <button className="leading-[0] p-[6px] my-0 mx-[4px] text-sm rounded-full inline-block font-normal text-center relative w-full h-full hover:bg-alphaBg"
                      onClick={() => handleLikeSong(trackStream)}
                      >
                          <AiOutlineHeart className="text-white text-base p-[5px] rounded-[50%] leading-[66%] inline-block w-full h-full"/>
                      </button>
                  )}
                  
              </div>
              <div className="relative grow mb-0 mr-0 items-center flex justify-center">
                  <button className="leading-[0] p-[6px] my-0 mx-[4px] text-sm rounded-full inline-block font-normal text-center relative w-full h-full hover:bg-alphaBg"
                  onClick={handleAddTrack}
                  >
                      <IoAddOutline className="text-white text-base p-[5px] rounded-[50%] leading-[66%] inline-block w-full h-full"/>
                  </button>
              </div>
            </div>
          </div>
          <div className="group-hover:hidden">
            <div className="flex items-center justify-between">
              <div className="grow mb-0 mr-0 items-center flex justify-center">
                {user?.likes?.includes(trackStream._id) && (
                    <button className="leading-[0] p-[6px] my-0 mx-[4px] text-sm rounded-full inline-block font-normal text-center relative w-full h-full hover:bg-alphaBg" >
                        <BsHeartFill className="text-purplePrimary text-base p-[5px] rounded-[50%] leading-[66%] inline-block w-full h-full"/>
                    </button>
                )}
              </div>
              <div className="flex items-center justify-center">
                <div className="text-xs w-[46px] text-songItemAction grow items-center flex justify-center">{Math.floor(trackStream.duration/60)}:{(trackStream.duration%60 < 10) ? `0${trackStream.duration%60}` : `${trackStream.duration%60}`}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StreamPlaylist