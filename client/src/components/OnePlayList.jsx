import React, { memo, useState } from 'react'
import { Link } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';
import { BiDotsHorizontalRounded, BiPause, BiPlay } from 'react-icons/bi';

import { motion } from 'framer-motion';
import { useStateValue } from '../context/StateProvider';
import { actionType } from '../context/reducer';
import { toast } from 'react-toastify';

const OnePlayList = ({playlist , myRef }) => {

    const [ { user , isSongPlaying , songs } , dispatch ] = useStateValue();
    const [ isPlaying, setIsPlaying ] = useState(songs.length === playlist.tracks.length && isSongPlaying && songs.every((song) => playlist.tracks.some((track) => track._id === song._id)))

    const handerSetPlay = () => {
        if(playlist.tracks.length > 0){
            dispatch({type:actionType.SET_ALL_SONGS, payload:playlist.tracks});
            dispatch({type:actionType.SET_SONG, payload:0});
            dispatch({type: actionType.SET_SONG_PLAYING, payload: true});
            myRef?.current.audio.current.play();
        } else {
            toast.warn("Playlist has not any track!")          
        }
    }

    const handerSetPause = () => {
        dispatch({type: actionType.SET_SONG_PLAYING, payload: false});
        myRef?.current.audio.current.pause();
    }
  return (
    <motion.div className="xl:w-[20%] w-[25%] relative min-h-[1px] pl-[14px] pr-[14px] float-left shrink-0 px-[15px] py-0 flex flex-col "
    initial={{ scale:0.7, opacity: 0 }}
    animate={{  scale:1 , opacity: 1 }}
    transition={{ duration: 0.5 }}
    > 
        <div>
            <div className="w-full max-w-full relative group">
                <Link to={`../../playList/${playlist.title}/${playlist._id}`} >
                    <div className="relative block overflow-hidden rounded shrink-0">
                        <div className="absolute top-0 left-0 bottom-0 right-0">
                            <div className={`${isPlaying ? "visible" : "invisible"} w-full justify-evenly absolute left-[50%] top-[50%] bottom-auto right-auto z-[10] flex items-center translate-x-[-50%] translate-y-[-50%] group-hover:visible`}>
                                <button className="text-[20px] rounded-full border-none inline-block text-center relative hover:bg-alphaBg">
                                    <AiOutlineClose className="text-[30px] text-white p-[5px] rounded-[50%] leading-[66%] inline-block"/>
                                </button>
                                {isPlaying ? (
                                <button className="text-[14px] rounded-full border-none iline-block text-center relative"
                                onClick={handerSetPause}
                                >
                                    <BiPause className="w-[45px] h-[45px] flex items-center justify-center border-[1px] border-solid border-white rounded-[50%] text-[20px] text-white"/>
                                </button>
                                ) : (
                                <button className="text-[14px] rounded-full border-none iline-block text-center relative"
                                onClick={playlist.tracks?.length > 0 ? handerSetPlay : null}
                                >
                                    <BiPlay className="w-[45px] h-[45px] flex items-center justify-center border-[1px] border-solid border-white rounded-[50%] text-[20px] text-white"/>
                                </button>

                                )}
                                <button className="text-[20px] rounded-full border-none iline-block text-center relative">
                                    <BiDotsHorizontalRounded className="text-[35px] text-white p-[5px] rounded-[50%] leading-[66%] inline-block"/>
                                </button>
                            </div>
                        </div>
                        <figure className="leading-0 h-0 pb-[100%] rounded-[5px] overflow-hidden bg-loadingBg transition-all duration-500 group-hover:scale-110 ">
                            <img src={playlist.thumbnail} alt="" className="h-auto w-full "/>
                        </figure>
                        <div className="w-full h-full absolute top-0 left-0 bg-darkAlpha50 invisible group-hover:visible"></div>
                    </div>
                </Link>
            </div>
            <div>
                <h4 className="text-[14px] font-medium leading-[1.36] text-white overflow-hidden text-ellipsis block">
                <Link to={`../../playList/${playlist.title}/${playlist._id}`} className="font-medium text-left mt-[8px] mr-0 mb-[4px] flex hover:text-purplePrimary">
                    <span>{playlist.title}</span>
                </Link>
                </h4>
                <h3 className="text-[12px] font-basic leading-[1.33] text-songItemAction cursor-default">
                    {playlist.userName}
                </h3>
            </div>
        </div>
    </motion.div>
  )
}

export default memo(OnePlayList)