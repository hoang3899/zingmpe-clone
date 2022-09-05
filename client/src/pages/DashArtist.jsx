import React, { useState } from 'react'
import { useEffect } from 'react'
import { getAllArtist } from '../api'
import HeaderDash from '../components/HeaderDash'
import SideBar from '../components/SideBar'
import { actionType } from '../context/reducer'
import { useStateValue } from '../context/StateProvider'

import ArtistCard from '../components/ArtistCard'

import { AiOutlineUserAdd } from 'react-icons/ai'
import AddArtist from '../components/AddArtist'

const DashArtist = () => {

    const [isOpenAdd, setIsOpenAdd] = useState(false);

    const [{ artists }, dispatch] =  useStateValue();
    useEffect(()=>{
        if (!artists) {
            getAllArtist().then((data) => {
              dispatch({
                type: actionType.SET_ARTISTS,
                artists: data,
              });
        })};
    }, [])
  return (
    <div className="w-screen flex min-w-768 h-[calc(100vh-90px)] bg-layoutBg">
        <SideBar />
        <div className="grow-1 relative min-h-full w-[calc(100%-71px)]">
            <div className="relative overflow-hidden w-full h-full">
                <main className="absolute overflow-y-scroll mr-[-6px] mb-0 px-[59px] py-0 inset-0">
                    <HeaderDash />
                    <div className="flex text-textItemHover bg-sideBar w-40 h-40 items-center justify-center rounded-full absolute right-[50px]">
                        <button onClick={() => setIsOpenAdd(true)}>
                            <AiOutlineUserAdd />  
                        </button>
                    </div>
                    <div className="ml-[10px] mt-[80px]">
                        <div>
                            <div className="border-b-[1px] border-solid border-sideBar items-center h-[46px] flex text-left ">
                                <div className="w-1/2 text-songItemAction text-sm ml-[10px]">TÊN</div>
                                <div className="grow text-songItemAction text-sm">QUỐC GIA</div>
                                <div className="grow-0 text-songItemAction text-sm">THEO DÕI</div>
                            </div>
                            <div>
                                {artists?.map((artist)=>(
                                    <ArtistCard artist={artist} key={artist._id}/>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        {isOpenAdd && <AddArtist setIsOpenAdd={setIsOpenAdd}/>}
        </div>
    </div>
  )
}

export default DashArtist