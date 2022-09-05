import React, { useEffect } from "react";
import { useStateValue } from "../context/StateProvider";
import { useNavigate } from "react-router-dom";
import SideBar from "./../components/SideBar";
import { getSongsLike } from "../api";
import { actionType } from "./../context/reducer";
import HeaderMyMusic from "./../components/HeaderMyMusic";
import SongMyMusic from "./../components/SongMyMusic";
import { useState } from "react";
import Header from "../components/Header";

const MyMusic = ({ myRef }) => {
  const [{ user, songsLike }, dispatch] = useStateValue();
  const [isloading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    dispatch({ type: actionType.SET_NO_OWNER_PLAYLIST });
    if (!user) {
      navigate("/");
    } else {
      if (user.likes.length !== songsLike?.length) {
        getSongsLike(user._id).then((data) => {
          dispatch({ type: actionType.SET_SONGS_LIKE, payload: data });
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  return (
    <div className="w-screen flex min-w-[768px] h-[calc(100vh-90px)] bg-layoutBg">
      <SideBar />
      <Header  myRef={myRef}/>
      <div className="grow relative min-h-full w-[calc(100%-570px)]">
        <div className="relative overflow-hidden w-full h-full">
          <main className="absolute overflow-x-hidden overflow-y-scroll mr-[-6px] mb-0 px-[59px] py-0 inset-0 mx-auto">
            <div className="grow mx-auto my-0 relative w-full ">
              <div className="pt-[70px] grow mx-auto my-0 relative w-full ">
                <div className="relative">
                  <div className="min-h-[calc(100%-70px)]">
                    <HeaderMyMusic />
                    <div>
                      <div className="ml-[-10px] mt-[50px]">
                        <div>
                          <div className="border-b-[1px] border-solid border-sideBar items-center h-[46px] flex text-left p-[10px] rounded-[5px] ">
                            <div className="w-1/2 text-songItemAction text-sm ml-[10px] mr-[10px] grow-0 shrink-0">
                              <div className="flex items-center">
                                <div className="text-[12px] font-medium uppercase text-songItemAction">
                                Bài hát
                                </div>
                              </div>
                            </div>
                            <div className="grow text-songItemAction text-sm"></div>
                            <div className="grow-0 text-songItemAction text-sm">
                              THỜI GIAN
                            </div>
                          </div>
                          <div>
                            {!isloading &&
                              songsLike?.map((songLike, index) => (
                                <SongMyMusic
                                  songLike={songLike}
                                  key={songLike._id}
                                  index={index}
                                  myRef={myRef}
                                />
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MyMusic;
