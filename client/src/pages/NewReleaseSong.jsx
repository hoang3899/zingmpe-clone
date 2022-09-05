import React, { useEffect, useState } from "react";
import { BsPlayFill } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { getAllNewTracks } from "../api";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import TrackArtist from "../components/TrackArtist";
import { actionType } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";

const NewReleaseSong = ({ myRef }) => {
  const [{ songsWait, songs }, dispatch] = useStateValue();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    dispatch({ type: actionType.SET_NO_OWNER_PLAYLIST });
    getAllNewTracks().then((data) => {
      dispatch({ type: actionType.SET_SONGS_WAIT, payload: data });
      setIsLoading(false);
    });
  }, []);

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
                    `url("https://firebasestorage.googleapis.com/v0/b/zingmp3-e389e.appspot.com/o/images%2Fnew-release.2856a962.jpg?alt=media&token=8b7cd805-dc64-430f-b0c9-e64b05ee45ad")`,
                }}
              ></div>
              <div className="absolute inset-0 mx-[-59px] my-0 bg-newsong"></div>
              <div className="absolute inset-0 mx-[-59px] my-0 bg-newsong01"></div>
              <div className="mx-auto my-0 pt-[170px] pr-0 pb-[50px] mt-[-120px] grow relative w-full">
                <div className="mb-[25px] p-0">
                  <div className="capitalize text-[40px] font-[800] leading-normal text-textItemHover flex flex-row items-center">
                    <h3 className="capitalize text-[40px] font-[800] leading-normal text-textItemHover flex flex-row items-center">
                      Mới phát hành
                    </h3>
                    <button className="ml-[5px] w-[40px] h-[40px] bg-purplePrimary flex items-center justify-center rounded-full text-[14px] leading-normal border-[0] foont-normal text-center relative">
                      <BsPlayFill className="text-white text-[16px] leading-[66%] inline-block" />
                    </button>
                  </div>
                  <nav className="mt-[40px] mr-0 ml-0 border-b-[1px] border-b-solid border-b-borderPrimary !mb-[30px] ">
                    <div className="flex items-center min-h-[52px]">
                      <ul className="flex items-center flex-wrap text-[14px] font-medium ">
                        <li className="text-white flex items-center justify-center uppercase relative mx-[20px] my-0 leading-normal ">
                          <div className="after:block after:absolute after:w-full after:top-full after:border-b-[2px] after:border-b-solid after:border-b-purplePrimary">
                            <NavLink to="/" className="block px-0 py-[15px] ">
                              Bài hát
                            </NavLink>
                          </div>
                        </li>
                        <li className="text-white flex items-center justify-center uppercase relative mx-[20px] my-0 leading-normal ">
                          <div>
                            <NavLink to="/" className="block px-0 py-[15px] ">
                              ALBUM
                            </NavLink>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </nav>
                </div>
                <div>
                  <div className="border-b-[1px] border-b-solid border-b-sideBar h-[46px] flex items-center text-left p-[10px] rounded-[5px]">
                    <div className="w-[calc(60%-120px)] mr-[10px] grow-0 shrink-0">
                      <div className="flex items-center">
                        <div className="text-[12px] font-medium uppercase text-songItemAction">
                          Bài hát
                        </div>
                      </div>
                    </div>
                    <div className="ml-[-10px] grow shrink text-left self-center w-0">
                      <div className="w-[90px] text-center text-[12px] font-medium uppercase text-songItemAction !ml-[10px]">
                      Lượt Nghe
                      </div>
                    </div>
                    <div className="ml-[10px] grow-0 shrink-0">
                      <div className="text-[12px] font-medium uppercase text-songItemAction">
                        Thời gian
                      </div>
                    </div>
                  </div>
                  <div>
                    {!isLoading &&
                      songsWait?.map((song, index) => (
                        <TrackArtist
                          key={song._id}
                          song={song}
                          index={index}
                          myRef={myRef}
                        />
                      ))}
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

export default NewReleaseSong;
