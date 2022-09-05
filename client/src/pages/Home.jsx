import React from "react";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import { useState } from "react";
import { useEffect } from "react";
import { getZingChart } from "../api";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";
import SongPage from "../components/SongPage";

const Home = ({ myRef }) => {
  const [isLoading, setIsLoading] = useState(true);

  const [{ songsWait, songs }, dispatch] = useStateValue();

  useEffect(() => {
    if (!songs) {
      getZingChart().then((data) => {
        dispatch({ type: actionType.SET_ALL_SONGS, payload: data });
      });
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    dispatch({ type: actionType.SET_NO_OWNER_PLAYLIST });
    getZingChart().then((data) => {
      dispatch({ type: actionType.SET_SONGS_WAIT, payload: data });
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      <div className="w-screen flex min-w-[768px] h-[calc(100vh-90px)] bg-layoutBg relative">
        <SideBar />
        <Header myRef={myRef} />
        <div className="grow relative w-[calc(100%-570px)] min-h-full block">
          <div className="relative overflow-hidden w-full h-full ">
            <main className="absolute inset-0 overflow-x-hidden overflow-y-scroll mr-[-6px] mb-[0px] px-[59px] mx-auto my-0 py-0 ">
              <div className="grow mx-auto my-0 relative w-full min-h-[calc(100%-158px)] mt-[70px]">
                <div className="relative pb-[30px] grow mx-auto my-0 w-full mt-[-70px]">
                  <div
                    className="bg-top bg-cover bg-no-repeat grayscale-0 absolute inset-0 mx-[-59px] my-0 h-[380px] z-0 block "
                    style={{
                      backgroundImage: `url("https://firebasestorage.googleapis.com/v0/b/zingmp3-e389e.appspot.com/o/images%2Fzingcharts.jpg?alt=media&token=76e21834-25bd-481f-a73f-063c2b6abd8f")`,
                    }}
                  ></div>
                  <div className="absolute inset-0 mx-[-59px] my-0 bg-newsong"></div>
                  <div className="absolute inset-0 mx-[-59px] my-0 bg-newsong01"></div>
                  <div className="relative pb-[30px] mt-[30px] grow mx-auto my-0 w-full">
                    <div className="pt-[80px] grow-1 mx-auto my-0 w-full relative">
                      {!isLoading &&
                        songsWait?.map((songWait, index) => (
                          <SongPage
                            key={songWait._id}
                            index={index + 1}
                            songWait={songWait}
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
    </>
  );
};

export default Home;
