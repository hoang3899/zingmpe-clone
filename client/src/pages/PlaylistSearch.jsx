import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAllPlaylistResults } from "../api";
import Header from "../components/Header";
import HeaderSearch from "../components/HeaderSearch";
import OnePlayList from "../components/OnePlayList";
import SideBar from "../components/SideBar";
import { actionType } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";

const PlaylistSearch = ({myRef}) => {
  const [{ songsWait, textSearch }, dispatch] = useStateValue();

  const [ allResults , setAllResults ] = useState(null);

  const location = useLocation();

  const [firstAlpha, setFirstAlpha] = useState(location.pathname.split("/")[2]);
  useEffect(() => {
    dispatch({ type: actionType.SET_NO_OWNER_PLAYLIST });
    getAllPlaylistResults(textSearch).then((data) => {
        setAllResults(data)
    });
  }, [textSearch]);
  return (
    <div className="w-screen flex min-w-[768px] h-[calc(100vh-90px)] bg-layoutBg relative">
      <SideBar />
      <Header myRef={myRef} />
      <div className="grow relative w-[calc(100%-570px)] min-h-full block">
        <div className="relative overflow-hidden w-full h-full">
          <main className="absolute inset-0 overflow-x-hidden overflow-y-scroll mr-[-6px] mb-[0px] px-[59px] mx-auto my-0 py-0 ">
            <div className="grow mx-auto my-0 relative w-full min-h-[calc(100%-158px)] mt-[70px]">
              <HeaderSearch firstAlpha={firstAlpha} />
              <div className="grow mx-auto my-0 relative w-full">
                <h3 className="text-[20px] text-white mb-[10px] font-bold capitalize block">Playlist/Album</h3>
                <div className="flex flex-wrap relative mx-[-15px] my-0">
                    {allResults && allResults?.map((playlist) => (
                        <OnePlayList playlist={playlist} key={playlist._id} myRef={myRef}/>
                    ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PlaylistSearch;
