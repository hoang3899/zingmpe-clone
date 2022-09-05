import React from 'react'
import { useState } from 'react'
import { AiOutlineUserDelete } from 'react-icons/ai';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { FaUserEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { motion } from 'framer-motion';

const SongCard = ({song}) => {
    const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div className="flex relative"
    initial={{ y: "50%" , opacity: 0}}
    animate={{ y: "0%" , opacity: 1 }}
    transition={{ duration: 0.5}}
    >
        <div className="min-w-full border-b-[1px] border-solid border-sideBar ">
            <div className="items-center flex align-left p-[10px] rounded-md ">
                <div className="w-1/2 mr-[10px] flex justify-between">
                    <div className="flex">
                        <div className="mr-[10px] block relative ">
                            <figure className="w-40 h-40 ">
                                <img src={song.thumbnail} alt="" className="w-full rounded-md"/>
                            </figure>
                        </div>
                        <div className="flex text-textItemHover flex-col">
                            <div className="flex items-center width-full ">
                                <span className="flex items-center leading-snug text-ellipsis max-w-full ">
                                {song.title}
                                </span>
                            </div>
                            <h3 className="leading-snug block text-xs mt-[3px] text-ellipsis max-w-full">
                                {song.artistsNames.map((name,index) => (
                                    <Link key={index} to="/" className="text-songItemAction inline-block hover:underline">
                                        {name}
                                    </Link>
                                ))}
                            </h3>
                        </div>
                    </div>
                    <div className="flex items-center text-textItemHover text-2xl relative">
                        <button onClick={() => setIsOpen(!isOpen)}>
                            <BiDotsHorizontalRounded />
                        </button>
                        {isOpen && (
                            <div className="absolute shadow-xl w-225 z-50 rounded-lg bg-primaryBg pt-0 top-[30px] right-0">
                            <ul className="py-[10px] px-0">
                                <li className="relative hover:bg-sideBar">
                                    <button className="py-[12px] pr-[20px] pl-[17px] flex w-full text-sm text-navigationText">
                                        <AiOutlineUserDelete className="inline-block mr-[10px] text-xl"/> 
                                        <span>Xóa bài hát</span>
                                    </button>
                                </li>
                                <li className="relative hover:bg-sideBar">
                                    <button className="py-[12px] pr-[20px] pl-[17px] flex w-full text-sm text-navigationText">
                                        <FaUserEdit className="inline-block mr-[10px] text-xl"/> 
                                        <span>Sửa thông tin</span>
                                    </button>
                                </li>
                            </ul>
                            </div>
                        )}
                    </div>
                </div>
                <div className="grow text-songItemAction text-sm">
                {song.releaseDate}
                </div>  
                <div className="grow-0 text-songItemAction text-sm">
                {song.plays_count}
                </div>
            </div>
        </div>
    </motion.div>
  )
}

export default SongCard