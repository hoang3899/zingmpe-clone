import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { getAllPlaylist } from '../api'
import Header from '../components/Header'
import OnePlayList from '../components/OnePlayList'
import SideBar from '../components/SideBar'

const AbumTop100 = ({myRef}) => {

  const [ allTop100 , setAllTop100 ] = useState(null)

  useEffect(() => {
    getAllPlaylist("62f124fb5004cf2c6e5a5748").then((data) => {
      setAllTop100(data);
    })
  },[])
  return (
    <div className="w-screen flex min-w-[768px] h-[calc(100vh-90px)] bg-layoutBg relative">
      <SideBar />
      <Header myRef={myRef} />
      <div className="grow relative w-[calc(100%-570px)] min-h-full block">
        <div className="relative overflow-hidden w-full h-full ">
          <main className="absolute inset-0 overflow-x-hidden overflow-y-scroll mr-[-6px] mb-[0px] px-[59px] mx-auto my-0 py-0 ">
            <div className="grow mx-auto my-0 relative w-full min-h-[calc(100%-158px)] mt-[70px]">
              <div
                className="bg-top bg-cover bg-no-repeat grayscale-0 absolute inset-0 mx-[-59px] my-0 h-[380px] z-0 block "
                style={{
                  backgroundImage:
                    `url("https://firebasestorage.googleapis.com/v0/b/zingmp3-e389e.appspot.com/o/images%2Ftop100.png?alt=media&token=b9649c32-1785-41d3-bbe8-0e10c9be57ce")`,
                }}
              ></div>
              <div className="absolute inset-0 mx-[-59px] my-0 bg-newsong"></div>
              <div className="absolute inset-0 mx-[-59px] my-0 bg-newsong01"></div>
              <div className="mx-auto my-0 pt-[350px] pr-0 pb-[50px] mt-[-120px] grow relative w-full">
                <div className="grow mx-auto my-0 relative w-full">
                  <h3 className="mb-[16px] flex justify-between items-center text-[20px] text-white font-bold capitalize">Nổi bật</h3>
                  <div className="flex mx-[-15px] my-0 flex-wrap relative">
                    {allTop100?.map((playlist) => (
                      <OnePlayList key={playlist._id} playlist={playlist} myRef={myRef}/>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default AbumTop100