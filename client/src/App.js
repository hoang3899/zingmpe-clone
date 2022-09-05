import React, { createRef, useEffect, useState } from 'react'
import { Route , Routes, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Playing from './components/Playing'
import { useStateValue } from './context/StateProvider'
import DashArtist from './pages/DashArtist'
import DashBoard from './pages/DashBoard'
import Home from './pages/Home'

import MyPlayList from './pages/MyPlayList';
import MyMusic from './pages/MyMusic'
import PlayList from './pages/PlayList';
import { addTrackPlaylist, deleteTrackFromPlaylist, getZingChart } from './api/index';
import { actionType } from './context/reducer';
import OwnerPlaylist from './pages/OwnerPlaylist';
import Discover from './pages/Discover';
import Artist from './pages/Artist';
import { AiOutlineHeart, AiOutlinePlusCircle, AiOutlinePlusSquare , AiOutlineDelete } from 'react-icons/ai';
import { FiDownload, FiHeadphones } from 'react-icons/fi';
import { GiMusicalNotes } from 'react-icons/gi';
import { BiBlock } from 'react-icons/bi';
import { RiPlayListAddFill } from 'react-icons/ri';
import { TbArrowBigRightLine } from 'react-icons/tb';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { BsMusicNoteList, BsX } from 'react-icons/bs';
import axios from 'axios';
import AllSearch from './pages/AllSearch';
import TrackSearch from './pages/TrackSearch';
import PlaylistSearch from './pages/PlaylistSearch';
import ArtistSearch from './pages/ArtistSearch';
import AbumTop100 from './pages/AbumTop100';
import NewReleaseSong from './pages/NewReleaseSong';


const App = () => {

  const [{ songs , isOpenInfoTrack , songInfo , positionX , positionY , user , allPlaylist , songWaitPlaylist , isOwnerPlaylist , idPlaylistCurrent} , dispatch] = useStateValue();

  const navigate = useNavigate();

  const [ isOpenAdd, setIsOpenAdd ] = useState(false);
  const [ isAddPlaylist, setIsAddPlaylist ] = useState(false);
  const [ title, setTitle ] = useState("");

  const addToPlaylist = () => {
    dispatch({type: actionType.ADD_TO_PLAYLIST});
    dispatch({type: actionType.SET_OPEN_SUB_INFO_TRACK});
  }

  const addToNextUp = () => {
    dispatch({type: actionType.ADD_TRACK_TO_NEXT_UP , payload: songInfo});
    dispatch({type: actionType.SET_OPEN_SUB_INFO_TRACK});
  }

  const removeTrackPlaylist = () => {
    dispatch({type: actionType.SET_OPEN_SUB_INFO_TRACK});
    dispatch({
      type: actionType.REMOVE_TRACK_CURRENT_PLAYLIST,
      payload: [idPlaylistCurrent, songInfo._id],
    });
    deleteTrackFromPlaylist(idPlaylistCurrent, songInfo._id).then((data) => {
      toast.success("You removed the track from playlist success!");
    });
  };

  const handleAddTrack = (playlist, track) => {
    if(!playlist.tracks.some((song) => song._id === track._id)){
      addTrackPlaylist(playlist._id,track).then((data) => {
        toast.success("Add track to playlist success!")
      });
      dispatch({type: actionType.UPDATE_PLAYLIST, payload: [playlist, track]});
      console.log(allPlaylist.filter((playlist1) => playlist1._id === playlist._id));
      dispatch({type: actionType.SET_OPEN_SUB_INFO_TRACK});
    } else {
      toast.warning("This playlist already has song!");
    }
  } 

  const handleCreatePlaylist = async() => {
    try {
      const res = await axios.post("http://localhost:5000/api/abum/create",{
        title: title,
        userId: user._id,
        userName: user.name,
        thumbnail: songWaitPlaylist?.thumbnail,
        tracks: [songWaitPlaylist] || [],
      });
      if(res){
        dispatch({ type: actionType.CREATE_PLAYLIST, payload: res.data });
        console.log(res.data)
        setIsAddPlaylist(false);
        dispatch({type: actionType.SET_OPEN_SUB_INFO_TRACK});
        navigate(`/playlist/${res.data.title}/${res.data._id}`)
      } else {
        setIsAddPlaylist(false);
      }
    } catch (error) {
      window.alert("Dont create playlist");
      setIsAddPlaylist(false);
    }
  }

  const createPlaylist = () => {
    dispatch({type: actionType.SET_SONGWAIT_PLAYLIST, payload: songInfo });
    setIsAddPlaylist(true);
  }

  useEffect(() => {
    if(!songs){
      getZingChart().then((data) => {
        dispatch({type: actionType.SET_ALL_SONGS, payload: data});
    })
    } 
  },[]);

  const myRef = createRef();

  return (
    <div>
      <ToastContainer position='top-right' limit={3} />
      <Routes>
        <Route path="/" element={<Home myRef={myRef}/>}/>
        <Route path="/khampha" element={<Discover myRef={myRef}/>}/>
        <Route path="/tim-kiem/tat-ca" element={<AllSearch myRef={myRef}/>}/>
        <Route path="/tim-kiem/bai-hat" element={<TrackSearch myRef={myRef}/>}/>
        <Route path="/top100" element={<AbumTop100 myRef={myRef}/>}/>
        <Route path="/new-release/song" element={<NewReleaseSong myRef={myRef}/>}/>
        <Route path="/tim-kiem/playlist" element={<PlaylistSearch myRef={myRef}/>}/>
        <Route path="/tim-kiem/nghe-si" element={<ArtistSearch myRef={myRef}/>}/>
        <Route path="/nghe-si/:slug" element={<Artist myRef={myRef}/>}/>
        <Route path="/playlist/:title/:id" element={<PlayList myRef={myRef}/>}/>
        <Route path="/dashboard/home" element={<DashBoard />}/>
        <Route path="/dashboard/artists" element={<DashArtist />}/>
        <Route path="/mymusic/playlist" element={<MyPlayList />}/>
        <Route path="/mymusic/home" element={<MyMusic myRef={myRef}/>}/>
        <Route path="/mymusic/library/playlist" element={<OwnerPlaylist myRef={myRef}/>}/>
      </Routes>
      {songs && <Playing myRef={myRef}/>}
      {(isOpenInfoTrack && songInfo) && (
        <div 
        className="absolute z-[1070] w-[280px] bg-primaryBg rounded-lg shadow-inner" 
        style={{top: `${positionY > 400 ? positionY-200 : positionY-40 }px` , left: `${positionX-280}px`}}
        >
          <div>
            <ul>
              <div className="relative">
                  <div className="pt-[15px] pr-[15px] pb-0 pl-[15px] items-center flex text-left rounded-[5px]">
                      <div className="mr-[10px] block relative ">
                          <figure className="w-40 h-40 ">
                              <img src={songInfo?.thumbnail} alt="" className="w-full rounded-md"/>
                          </figure>
                      </div>
                      <div className="flex text-textItemHover flex-col">
                          <div className="flex items-center width-full ">
                              <span className="flex items-center leading-snug text-ellipsis max-w-full ">
                              {songInfo?.title}
                              </span>
                          </div>
                          <div className="flex items-center text-[12px] text-[#a0a0a0] ">
                              <div className="mr-[10px]">
                                  <AiOutlineHeart className="text-[14px] relative mr-[2px] leading-[66%] inline-block"/>
                                  <span>{songInfo?.likes_count}</span>
                              </div>
                              <div className="mr-[10px]">
                                  <FiHeadphones className="text-[14px] relative mr-[2px] leading-[66%] inline-block"/>
                                  <span>{songInfo?.plays_count}</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
            </ul>
            <ul>
              <div className="mt-[15px] mx-0 mb-[10px] px-[15px] py-0">
                  <div className="flex items-center justify-between bg-alphaBg rounded-lg leading-[1.5]">
                      <button className="flex grow shrink flex-col items-center rounded-lg px-0 py-[8px] text-[10px] max-w-[80px] leading-[14px] border-none text-center relative hover:bg-alphaBg">
                          <FiDownload className="text-[16px] mb-[4px] leading-[66%] inline-block"/>
                          <span>Tải xuống</span>
                      </button>
                      <button className="flex grow shrink flex-col items-center rounded-lg px-0 py-[8px] text-[10px] max-w-[80px] leading-[14px] border-none text-center relative hover:bg-alphaBg">
                          <GiMusicalNotes className="text-[16px] mb-[4px] leading-[66%] inline-block"/>
                          <span>Lời bài hát</span>
                      </button>
                      <button className="flex grow shrink flex-col items-center rounded-lg px-0 py-[8px] text-[10px] max-w-[80px] leading-[14px] border-none text-center relative hover:bg-alphaBg">
                          <BiBlock className="text-[16px] mb-[4px] leading-[66%] inline-block"/>
                          <span>Chặn</span>
                      </button>
                  </div>
              </div>
            </ul>
            <ul>
              <li className="text-navigationText hover:bg-alphaBg">
                  <button className="flex items-center w-full pt-[10px] pr-[20px] pb-[10px] pl-[14px] text-[14px] rounded-full border-none text-center relative"
                  onClick={addToPlaylist}
                  >
                      <RiPlayListAddFill className="mr-[15px] p-0 text-[16px] leading-[66%] inline-block "/>
                      <span>Thêm vào danh sách phát</span>
                  </button>
              </li>
              <li className="text-navigationText hover:bg-alphaBg">
                  <button className="flex items-center w-full pt-[10px] pr-[20px] pb-[10px] pl-[14px] text-[14px] rounded-full border-none text-center relative"
                  onClick={addToNextUp}
                  >
                      <TbArrowBigRightLine className="mr-[15px] p-0 text-[16px] leading-[66%] inline-block "/>
                      <span>Phát tiếp theo</span>
                  </button>
              </li>
              {user && (
              <li className="text-navigationText hover:bg-alphaBg">
                  <div className="relative">
                      <button className="flex items-center w-full pt-[10px] pr-[20px] pb-[10px] pl-[14px] text-[14px] rounded-full border-none text-center relative" 
                      onMouseEnter={() => setIsOpenAdd(true)}
                      onMouseLeave={() => setIsOpenAdd(false)}
                      >
                          <AiOutlinePlusCircle className="mr-[15px] p-0 text-[16px] leading-[66%] inline-block "/>
                          <span>Thêm vào playlist</span>
                          <MdKeyboardArrowRight className="ml-auto p-0 text-[16px] leading-[66%] inline-block"/>
                      </button>
    {(user && isOpenAdd) && (
    <div className={`${positionX < 600 ? "top-[-240px] right-[calc(100%-5px)]" : "top-[-180px] right-[calc(100%-5px)]"} absolute w-[230px] bg-primaryBg shadow rounded-lg z-[102] px-0 py-[10px]`}
    onMouseEnter={() => setIsOpenAdd(true)}
    onMouseLeave={() => setIsOpenAdd(false)}
    >
      <ul className="p-0">
          <li className="px-[15px] py-0 text-navigationText">
              <input type="text" className="h-[35px] text-[14px] border-none bg-alphaBg w-full rounded-full px-[15px] py-0 max-w-full items-center inline-flex justify-start leading-[1.5] align-top relative" placeholder="Tìm playlist" />
          </li> 
          <li className="text-navigationText !mt-[10px] hover:bg-alphaBg">
              <button className="flex items-center w-full pt-[10px] pr-[20px] pb-[10px] pl-[14px] text-[14px] rounded-full border-none text-center relative" onClick={createPlaylist}>
                  <AiOutlinePlusSquare className="mr-[15px] p-0 text-[16px] leading-[66%] inline-block"/>
                  <span>Tạo playlist mới</span>
              </button>
          </li> 
      </ul>
      <div className="relative">
          <div className="absolute top-0 h-[10px] w-full opacity-0"></div>
          <div className="h-[185px] overflow-x-hidden">
              <div className="relative overflow-hidden w-full h-full">
                  <div className="absolute inset-0 overflow-x-hidden overflow-y-scroll mr-[-6px] mb-0">
                      <ul className="p-0">
                          {allPlaylist?.map((playlist) => (
                            <li className="text-navigationText hover:bg-alphaBg" key={playlist._id}>
                                <button className="flex items-center w-full pt-[10px] pr-[20px] pb-[10px] pl-[20px] text-[14px] rounded-full border-none text-center relative"
                                onClick={() => handleAddTrack(playlist,songInfo)}
                                >
                                    <BsMusicNoteList className="mr-[15px] p-0 text-[16px] leading-[66%] inline-block "/>
                                    <span className="text-ellipsis overflow-hidden">{playlist.title}</span>
                                </button>
                            </li>  
                          ))}
                      </ul>
                  </div>
              </div>
          </div>
      </div>
    </div>
    )}
                  </div>
              </li>
              )}
              {(isOwnerPlaylist && idPlaylistCurrent) && (
              <li className="text-navigationText hover:bg-alphaBg">
                  <button className="flex items-center w-full pt-[10px] pr-[20px] pb-[10px] pl-[14px] text-[14px] rounded-full border-none text-center relative"
                  onClick={removeTrackPlaylist}
                  >
                      <AiOutlineDelete className="mr-[15px] p-0 text-[16px] leading-[66%] inline-block "/>
                      <span>Xóa khỏi playlist này</span>
                  </button>
              </li>
              )}
            </ul>
          </div>
        </div>
      )} 
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
    </div>
  )
}

export default App  