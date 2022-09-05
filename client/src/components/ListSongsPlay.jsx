import React, { useState } from 'react'
import { BiDotsHorizontalRounded } from 'react-icons/bi'
import { GiAlarmClock } from 'react-icons/gi'
import { useStateValue } from '../context/StateProvider';
import SongCart from './SongCart';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { actionType } from '../context/reducer';

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { putDislikeSong, putLikeSong } from '../api';
import { BsHeartFill, BsPauseFill, BsPlayFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { AiOutlineHeart } from 'react-icons/ai';

const ListSongsPlay = ({myRef}) => {
    const [{ user , songs , songIndex , isSongPlaying}, dispatch] =  useStateValue();

    const [itemList, setItemList] = useState(songs);
    
    const handleDrop = (droppedItem) => {
        // Ignore drop outside droppable container
        if (!droppedItem.destination) return;
        var updatedList = [...itemList]
        ;
        // Remove dragged item
        const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
        // Add dropped item
        updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
        // Update State
        setItemList(updatedList);
        const newIndex = updatedList.map((item, index) =>{
            if(item.randomId === songs[songIndex].randomId){
                return index;
            } else {
                return -1;
            }
        }).filter(index => index !== -1)[0]
        dispatch({type:actionType.SET_SONG_FRAME , payload: [updatedList , newIndex]});
      };

      const handerSetPlay = (index , randomId) => {
        if(songs[songIndex].randomId !== randomId ){
            dispatch({type:actionType.SET_SONG, payload:index});
            dispatch({type: actionType.SET_SONG_PLAYING, payload: true});
            myRef.current.audio.current.currentTime = 0 ;
        } else {
            dispatch({type:actionType.SET_SONG, payload:index});
            dispatch({type: actionType.SET_SONG_PLAYING, payload: true});
        }
    }

    const handerSetPause = () => {
        dispatch({type: actionType.SET_SONG_PLAYING, payload: false});
        myRef.current.audio.current.pause();
    }

    const like = (song) => {
        if(user){
            putLikeSong({idUser: user._id, idTrack: song._id }).then((data) => {
                dispatch({type: actionType.ADD_SONG_LIKE, payload: song});
            })
        } else {
            window.alert('Sorry, you did not login')
        }
      }
  
      const dislike = (song) => {
        putDislikeSong({idUser: user._id, idTrack: song._id }).then((data) => {
          dispatch({type: actionType.REMOVE_SONG_DISLIKE, payload: song._id});
        })
      }
  return (
    <motion.div
    name="ListSongsPlay"
    initial={{ x: "100%" }}
    animate={{ x: "0%"}}
    exit={{ x: "100%" }}
    transition={{ duration: 0.8 }}
    className="absolute !z-[999] border-none shadow-xl bottom-[90px] bg-[#120822] right-0 w-[330px] cursor-default">
        <div className="h-[calc(100vh-90px)] max-h-[calc(100vh-90px)] relative bottom-0 right-0 flex flex-col ">
            <div className="px-0 py-[14px]">
                <div className="px-[8px] py-0 flex items-center justify-between">
                    <div className="grow shrink rounded-full bg-alphaBg p-[3px] flex items-center justify-start max-w-[240px]">
                        <div className="grow mb-0 mr-0 items-center flex shrink-0 basic-[0%] justify-center rounded-full px-0 py-[5px] cursor-pointer bg-tabActiveBg text-textItemHover basis-auto ">
                            <h6 className="font-medium text-[12px] p-0">
                            Danh sách phát
                            </h6>
                        </div>
                        <div className="grow mb-0 mr-0 items-center flex shrink-0 justify-center rounded-full px-0 py-[5px] cursor-pointer text-navigationText ">
                            <h6 className="font-normal text-xs">
                            Nghe gần đây
                            </h6>
                        </div>
                    </div>
                    <div className="mt-0 flex items-center justify-end grow-0 shrink-0 basic-auto min-w-[74px]">
                        <div className="flex items-center justify-between w-full">
                            <div className="mb-0 mr-0 items-center flex grow-0 shrink-0 justify-center ">
                                <button className="p-[2px] mx-[2px] my-0 border-none text-white text-sm rounded-full inline-block text-center relative bg-borderPrimary">
                                    <GiAlarmClock className="text-[30px] p-[4px] rounded-[50%] leading-[66%] inline-block text-white"/>
                                </button>
                            </div>
                            <div className="mb-0 mr-0 items-center flex grow-0 shrink-0 justify-center ">
                                <button className="p-[2px] mx-[2px] my-0 border-none text-white text-sm rounded-full inline-block text-center relative bg-borderPrimary">
                                    <BiDotsHorizontalRounded className="text-[30px] p-[4px] rounded-[50%] leading-[66%] inline-block text-white"/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grow shrink basic-[0%]">
                <div className="relative overflow-hidden w-full h-full ">
                    <div className="absolute inset-0 overflow-x-hidden overflow-y-scroll mr-[-6px] mb-0">
                        <div className="absolute top-0 h-full w-full">
                            <div>
    <DragDropContext onDragEnd={handleDrop}>
    <Droppable droppableId="list-container">
    {(provided) => (
            <div
              className="list-container"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {itemList.map((item, index ) => {
                return (
                <Draggable key={item.randomId} draggableId={item.randomId} index={index}>
                  {(provided) => (
                    <div
                      className={`z-[1065] !cursor-default group hover:bg-alphaBg ${(songs[songIndex]?.randomId === item.randomId) ? "bg-purplePrimary" : ""}`}
                      ref={provided.innerRef}
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                    >
          <div className="rounded">
            <div className="p-[8px] flex items-center  text-left rounded-[5px]">
              <div className="grow shrink flex w-[50%] mr-[10px]">
                <div className="mr-[10px] block relative overflow-hidden rounded shrink-0 w-[40px] h-[40px]">
                    <figure className="w-[40px] h-[40px] bg-alphaBg p-[0] ">
                        <img src={item.thumbnail} className="h-auto w-full " alt="" />
                    </figure>
                    <div className="invisible group-hover:visible w-full h-full absolute top-0 left-0 bg-darkAlpha50 "></div>
                    {(songs[songIndex]?.randomId === item.randomId) ? (
                    <div className="absolute top-0 left-0 bottom-0 right-0 ">
                        <div className="visible w-full h-full absolute top-0 left-0 bg-darkAlpha50 "></div>
                        <div className="absolute left-[4px] top-[4px] bottom-auto right-auto z-[101] flex justify-around items-center visible w-[80%] ">
                            {isSongPlaying ? (
                                <button className="text-lg leading-[0] h-[24px] rounded-full border-[0] inline-block text-center cursor-pointer relative font-normal p-[0]"
                                onClick={handerSetPause}
                                >
                                    <BsPauseFill className="text-white text-4xl p-[5px] rounded-[50%] leading-[66%] inline-block"/>
                                </button>
                            ) : (
                                <button className="text-lg leading-[0] h-[24px] rounded-full border-[0] inline-block text-center cursor-pointer relative font-normal p-[0]" onClick={() => handerSetPlay(index)}>
                                    <BsPlayFill className="text-white text-4xl p-[5px] rounded-[50%] leading-[66%] inline-block"/>
                                </button>
                            )}
                            
                        </div>
                    </div>
                    ) : (
                    <div className="absolute top-0 left-0 bottom-0 right-0 ">
                        <div className="invisible group-hover:visible w-full h-full absolute top-0 left-0 bg-darkAlpha50 "></div>
                        <div className="absolute left-[4px] top-[4px] bottom-auto right-auto z-[101] flex justify-around items-center invisible w-[80%] group-hover:visible">
                            <button className="text-lg leading-[0] h-[24px] rounded-full border-[0] inline-block text-center cursor-pointer relative font-normal p-[0]" onClick={() => handerSetPlay(index , item.randomId)}>
                                <BsPlayFill className="text-white text-4xl p-[5px] rounded-[50%] leading-[66%] inline-block"/>
                            </button>
                        </div>
                    </div>
                    )}
                </div>
                <div className="overflow-hidden flex flex-col w-full ">
                    <div className="max-w-full flex items-center ">
                        <span className="flex items-center grow shrink basis-[0%] leading-[1.3] overflow-hidden max-w-full text-ellipsis font-medium align-top text-white whitespace-nowrap">
                            {item.title}
                        </span>
                    </div>
                    <h3 className="block text-xs mt-[3px] overflow-hidden max-w-full text-ellipsis font-normal text-songItemAction hover:text-linkTextHover">
                    {item.artistsNames.map((name,index) => (
                        <Link to="/" key={index} className="text-songItemAction inline-block hover:underline hover:!text-linkTextHover">{name}
                            {index < item.artistsNames.length - 1 ? "," : ""}
                        </Link>
                    ))}
                    </h3>
                </div>
              </div>
              <div className="ml-[10px] grow-0 shrink-0 "> 
                <div className="hidden items-center justify-between group-hover:flex">
                  <div className="grow mb-0 mr-0 items-center flex shrink-0 justify-center">
                    {user?.likes?.includes(item._id) ? (
                        <button className="leading-[0] p-[6px] my-0 mx-[4px] text-sm rounded-full inline-block font-normal text-center relative w-full h-full" onClick={() => dislike(item)}>
                            <BsHeartFill className="text-purplePrimary text-base p-[5px] rounded-[50%] leading-[66%] inline-block w-full h-full"/>
                        </button>
                    ) : (
                        <button className="leading-[0] p-[6px] my-0 mx-[4px] text-sm rounded-full inline-block font-normal text-center relative w-full h-full" onClick={() => like(item)}>
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
                  )}
                </Draggable>
                )
                })}
              {provided.placeholder}
            </div>
          )}

    </Droppable>
    </DragDropContext>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
  )
}

export default React.memo(ListSongsPlay)