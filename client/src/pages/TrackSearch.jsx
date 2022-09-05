import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import HeaderSearch from "../components/HeaderSearch";
import SideBar from "../components/SideBar";
import { motion } from "framer-motion";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";
import { getAllTrackResults } from "../api";
import TrackArtist from "../components/TrackArtist";
import { useLocation } from "react-router-dom";

const TrackSearch = ({ myRef }) => {
  const [{ songsWait, textSearch }, dispatch] = useStateValue();

  const location = useLocation();

  const [firstAlpha, setFirstAlpha] = useState(location.pathname.split("/")[2]);

  useEffect(() => {
    dispatch({ type: actionType.SET_NO_OWNER_PLAYLIST });
    getAllTrackResults(textSearch).then((data) => {
      dispatch({ type: actionType.SET_SONGS_WAIT, payload: data });
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
                <h3 className="text-[20px] text-white mb-[10px] font-bold capitalize block">
                  Bài Hát
                </h3>
                <motion.div
                  layout
                  initial={{ x: "10%", opacity: 0.3 }}
                  animate={{ x: "0%", opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  {songsWait?.map((song, index) => (
                    <TrackArtist
                      key={song._id}
                      song={song}
                      index={index}
                      myRef={myRef}
                    />
                  ))}
                </motion.div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TrackSearch;
