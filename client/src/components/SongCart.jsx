import React from 'react'
import { AiOutlineHeart } from 'react-icons/ai';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { BsHeartFill, BsPauseFill, BsPlayFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { actionType } from '../context/reducer';
import { useStateValue } from '../context/StateProvider';
import { putDislikeSong, putLikeSong } from './../api/index';

const SongCart = ({ song ,  index , myRef}) => {
    const [{ songs ,songIndex ,isSongPlaying , user }, dispatch] =  useStateValue();
    const handerSetPlay = () => {
        dispatch({type:actionType.SET_SONG, payload:index});
        dispatch({type: actionType.SET_SONG_PLAYING, payload: true});
        myRef.current.audio.current.play();
    }

    const handerSetPause = () => {
        dispatch({type: actionType.SET_SONG_PLAYING, payload: false});
        myRef.current.audio.current.pause();
    }

    const like = () => {
        if(user){
            putLikeSong({idUser: user._id, idTrack: song._id }).then((data) => {
                dispatch({type: actionType.ADD_SONG_LIKE, payload: song});
            })
        } else {
            window.alert('Sorry, you did not login')
        }
      }
  
      const dislike = () => {
        putDislikeSong({idUser: user._id, idTrack: song._id }).then((data) => {
          dispatch({type: actionType.REMOVE_SONG_DISLIKE, payload: song._id});
        })
      }
  return (
    <div className={`z-[1065] group hover:bg-alphaBg ${songs[songIndex]?._id === song._id ? "bg-purplePrimary" : ""}`}>
        <div className="rounded">
            <div className="p-[8px] items-center flex text-left rounded-[5px]">
                <div className="grow shrink flex w-[50%] mr-[10px]">
                    <div className="mr-[10px] block relative overflow-hidden rounded shrink-0">
                        <figure className="w-[40px] h-[40px] bg-alphaBg p-[0] ">
                            <img src={song.thumbnail} className="h-auto w-full " alt="" />
                        </figure>
                        <div className="invisible group-hover:visible w-full h-full absolute top-0 left-0 bg-darkAlpha50 "></div>
                        {songs[songIndex]?._id === song._id ? (
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
                                    <button className="text-lg leading-[0] h-[24px] rounded-full border-[0] inline-block text-center cursor-pointer relative font-normal p-[0]" onClick={handerSetPlay}>
                                        <BsPlayFill className="text-white text-4xl p-[5px] rounded-[50%] leading-[66%] inline-block"/>
                                    </button>
                                )}
                                
                            </div>
                        </div>
                        ) : (
                        <div className="absolute top-0 left-0 bottom-0 right-0 ">
                            <div className="invisible group-hover:visible w-full h-full absolute top-0 left-0 bg-darkAlpha50 "></div>
                            <div className="absolute left-[4px] top-[4px] bottom-auto right-auto z-[98] flex justify-around items-center invisible w-[80%] group-hover:visible">
                                <button className="text-lg leading-[0] h-[24px] rounded-full border-[0] inline-block text-center cursor-pointer relative font-normal p-[0]" onClick={handerSetPlay}>
                                    <BsPlayFill className="text-white text-4xl p-[5px] rounded-[50%] leading-[66%] inline-block"/>
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
                        {song.artistsNames.map((name,index) => (
                            <Link to="/" key={index} className="text-songItemAction inline-block hover:underline hover:!text-linkTextHover">{name}
                                {index < song.artistsNames.length - 1 ? "," : ""}
                            </Link>
                        ))}
                        </h3>
                    </div>
                </div>
                <div className="ml-[10px] grow-0 shrink-0 "> 
                    <div className="hidden items-center justify-between group-hover:flex">
                        <div className="grow mb-0 mr-0 items-center flex shrink-0 justify-center">
                            {user?.likes?.includes(song._id) ? (
                                <button className="leading-[0] p-[6px] my-0 mx-[4px] text-sm rounded-full inline-block font-normal text-center relative w-full h-full" onClick={dislike}>
                                    <BsHeartFill className="text-purplePrimary text-base p-[5px] rounded-[50%] leading-[66%] inline-block w-full h-full"/>
                                </button>
                            ) : (
                                <button className="leading-[0] p-[6px] my-0 mx-[4px] text-sm rounded-full inline-block font-normal text-center relative w-full h-full" onClick={like}>
                                    <AiOutlineHeart className="text-white text-base p-[5px] rounded-[50%] leading-[66%] inline-block w-full h-full"/>
                                </button>
                            )}
                        </div>
                        <div className="grow mb-0 mr-0 items-center flex shrink-0 justify-center ">
                            <button className="leading-[0] my-0 mx-[4px] text-sm rounded-full inline-block font-normal text-center relative w-full h-full">
                                <BiDotsHorizontalRounded className="text-white text-base p-[5px] rounded-[50%] leading-[66%] inline-block w-[30px] h-full"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SongCart