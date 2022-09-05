import React, { useState } from 'react'
import { useEffect } from 'react'
import { IoMusicalNotesOutline } from 'react-icons/io5'
import { getAllSong } from '../api'
import AddSongs from '../components/AddSongs'
import HeaderDash from '../components/HeaderDash'
import SideBar from '../components/SideBar'
import SongCard from '../components/SongCard'
import { actionType } from '../context/reducer'
import { useStateValue } from '../context/StateProvider'

const DashBoard = () => {

  const [isOpen , setIsOpen ] = useState();
  const [{ allSongAd }, dispatch] =  useStateValue();

  useEffect(() => {
    getAllSong().then((data) => {
      dispatch({type:actionType.GET_ALL_SONG_AD , payload: data});
    })
  },[])

  return (
    <div className="w-screen flex min-w-768 h-[calc(100vh-90px)] bg-layoutBg">
      <SideBar />
      <div className="grow-1 relative min-h-full w-[calc(100%-71px)]">
        <div className="relative overflow-hidden w-full h-full">
          <main className="absolute overflow-y-scroll mr-[-6px] mb-0 px-[59px] py-0 inset-0">
            <HeaderDash />
            <div className="flex text-textItemHover bg-sideBar w-40 h-40 items-center justify-center rounded-full absolute right-[50px]">
                <button onClick={() => setIsOpen(true)}>
                    <IoMusicalNotesOutline />  
                </button>
            </div>
            <div className="ml-[10px] mt-[80px]">
                <div>
                    <div className="border-b-[1px] border-solid border-sideBar items-center h-[46px] flex text-left ">
                        <div className="w-1/2 text-songItemAction text-sm ml-[10px]">TÊN</div>
                        <div className="grow text-songItemAction text-sm">NGÀY ĐĂNG</div>
                        <div className="grow-0 text-songItemAction text-sm">LƯỢT NGHE</div>
                    </div>
                    <div>
                        {
                          allSongAd?.map((song)=>(
                              <SongCard song={song} key={song._id}/>
                          ))
                        }
                    </div>
                </div>
            </div>
            {isOpen && <AddSongs setIsOpen={setIsOpen}/>}
          </main>
        </div>
      </div>
    </div>
  )
}

export default DashBoard