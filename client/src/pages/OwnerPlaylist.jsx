import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import SideBar from '../components/SideBar'
import { IoIosAddCircleOutline } from 'react-icons/io'
import { useStateValue } from '../context/StateProvider'
import OnePlayList from '../components/OnePlayList'
import axios from 'axios'
import { toast } from 'react-toastify'
import { actionType } from '../context/reducer'
import { BsX } from 'react-icons/bs'

const OwnerPlaylist = ({myRef}) => {

    const [{ user , allPlaylist }, dispatch] = useStateValue();

    const navigate = useNavigate();

    const [ isAddPlaylist , setIsAddPlaylist ] = useState(false);
    const [ title, setTitle ] = useState("");

    const handleCreatePlaylist = async() => {
        try {
          const res = await axios.post("http://localhost:5000/api/abum/create",{
            title: title,
            userId: user._id,
            userName: user.name,
            thumbnail: "https://firebasestorage.googleapis.com/v0/b/zingmp3-e389e.appspot.com/o/images%2Falbum_default.png?alt=media&token=ef9b8dbc-b81f-4135-8fec-2d3971681e1f",
          });
          if(res){
            toast.success("You created success a new playlist!")
            dispatch({ type: actionType.CREATE_PLAYLIST, payload: res.data });
            setIsAddPlaylist(false);
            navigate(`/playlist/${res.data.title}/${res.data._id}`)
          } else {
            setIsAddPlaylist(false);
          }
        } catch (error) {
          window.alert("Dont create playlist");
          setIsAddPlaylist(false);
        }
      }
  return (
    <>
    <div className="w-screen flex min-w-[768px] h-[calc(100vh-90px)] bg-layoutBg relative">
        <SideBar />
        <Header />
        <div className="grow-1 relative min-h-full w-[calc(100%-71px)]">
            <div className="relative overflow-hidden w-full h-full">
                <main className="absolute overflow-y-scroll mr-[-6px] mb-0 px-[59px] py-0 inset-0">
                    <div className="min-h-[calc(100%-158px)] !mt-[70px] grow mx-auto my-0 relative w-full">
                        <nav className="border-b-[1px] border-b-solid border-b-borderPrimary my-0 mx-[-59px] pl-[59px] !mb-[30px]">
                            <div className="flex items-center min-h-[52px]">
                                <h3 className="shrink-0 text-[24px] m-0 pr-[20px] border-r-[1px] border-r-solid border-r-borderPrimary text-white font-bold block  ">Playlist</h3>
                                <ul className="flex items-center flex-wrap text-[14px] font-medium h-[52px]">
                                    <NavLink to="/" className="text-white flex items-center justify-center uppercase relative mx-[20px] my-0 border-solid border-b-[2px] border-purplePrimary h-full">
                                    Tất cả
                                    </NavLink>
                                    <NavLink to="/" className="text-white flex items-center justify-center uppercase relative mx-[20px] my-0 h-full">
                                    Của tôi
                                    </NavLink>
                                </ul>
                            </div>
                        </nav>
                        <div className="grow mx-auto my-0 w-full ">
                            <div className="flex flex-wrap relative mx-[-15px] my-0 ">
                                <div className="xl:w-[20%] w-[25%] relative min-h-[1px] pl-[14px] pr-[14px] float-left shrink-0 !mb-[30px] group"
                                onClick={() => setIsAddPlaylist(true)}
                                >
                                    <div className="w-full text-white cursor-pointer pb-[calc(100%+45px)] rounded border-[1px] border-solid border-borderPrimary text-[15px] relative group-hover:text-linkTextHover1">
                                        <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col items-center justify-center w-full">
                                            <IoIosAddCircleOutline className="text-[47px] mb-[15px] leading-[66%] inline-block "/>
                                            <span>Tạo playlist mới</span>
                                        </div>
                                    </div>
                                </div>
                                {allPlaylist?.map((playlist) => (
                                    <OnePlayList key={playlist._id} playlist={playlist} myRef={myRef}/>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </div>
    {isAddPlaylist && (
    <div className="fixed top-0 left-0 w-screen h-screen bg-darkAlpha80 flex items-center justify-center z-[999]">
      <div className="bg-primaryBg rounded-lg max-h-full flex items-center flex-col justify-center fixed z-[40]">
        <div>
          <div>
            <div className="w-[290px] text-center m-[20px] ">
              <button className="absolute right-[10px] top-[10px] text-[14px] rounded-full border-none inline-block text-center" 
                onClick={() => setIsAddPlaylist(false)}
                >
                    <BsX className="text-white text-[30px] p-[5px] rounded-[50%] leading-[66%] inline-block"/>
              </button>
              <h3 className="text-center mb-[10px] text-white font-bold block">Tạo playlist mới</h3>
              <input type="text" className="h-[40px] w-full rounded-full border-[1px] border-solid border-loadingBg bg-alphaBg px-[15px] py-0 text-[14px] max-w-full inline-flex justify-start align-top items-center text-white focus:outline-none" placeholder="Nhập tên playlist" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              />
              <button className="bg-purplePrimary text-white py-[8px] px-0 flex justify-center items-center border-[1px] border-solid border-loadingBg mx-auto my-0 w-full uppercase !mt-[20px] rounded-full text-center relative hover:bg-[#4e0271]" type="submit" onClick={handleCreatePlaylist}>
                  <span>Tạo mới</span>
              </button>  
            </div>
          </div>
        </div>
      </div>
   </div>
    )}
    </>
  )
}

export default OwnerPlaylist