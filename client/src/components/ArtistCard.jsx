import React, { useState } from 'react'

import { BiDotsHorizontalRounded } from 'react-icons/bi'
import { AiOutlineUserDelete } from 'react-icons/ai'
import { FaUserEdit } from 'react-icons/fa'
import { storage } from '../firebase.config'
import { removeArtist } from '../api'
import { useStateValue } from '../context/StateProvider'
import { actionType } from '../context/reducer'
import { deleteObject, ref , refFromURL } from 'firebase/storage'

const ArtistCard = ({artist}) => {

    const [  { artists } , dispatch ] = useStateValue();

    const [isOpen, setIsOpen] = useState(false);

    const handlerRemoveArtist = async() => {
        const array = [artist.thumbnail, artist.thumbnailM];
        array.forEach((item) => {
            let desertRef = ref(storage, item);
            deleteObject(desertRef).then(() => {
                console.log("Success")
              }).catch((error) => {
                console.log(error)
              });
        });
        try{
            await removeArtist(artist._id);
            dispatch({type: actionType.REMOVE_ARTISTS, payload: artist})
        } catch(error) {
            console.log(error);
        }

    }

  return (
    <div className="flex relative">
        <div className="min-w-full border-b-[1px] border-solid border-sideBar ">
            <div className="items-center flex align-left p-[10px] rounded-md ">
                <div className="w-1/2 mr-[10px] flex justify-between">
                    <div className="flex">
                        <div className="mr-[10px] block relative ">
                            <figure className="w-40 h-40 ">
                                <img src={artist.thumbnail} alt="" className="w-full rounded-full"/>
                            </figure>
                        </div>
                        <div className="flex items-center text-textItemHover ">
                            {artist.name}
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
                                    <button className="py-[12px] pr-[20px] pl-[17px] flex w-full text-sm text-navigationText" onClick={handlerRemoveArtist}>
                                        <AiOutlineUserDelete className="inline-block mr-[10px] text-xl"/> 
                                        <span>Xóa nghệ sĩ</span>
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
                {artist.national}
                </div>
                <div className="grow-0 text-songItemAction text-sm">
                {artist.totalFollow}
                </div>
            </div>
        </div>
    </div>
  )
}

export default ArtistCard