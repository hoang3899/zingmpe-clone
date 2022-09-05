import React, { useState } from "react";
import { useEffect } from "react";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import {
  getInfoArtist,
  getPopularTrackOfArtist,
} from "../api";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import TrackArtist from "../components/TrackArtist";
import { actionType } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";
import { motion } from "framer-motion"

const Artist = ({ myRef }) => {
  const [
    { nameArtist, songsWait, songs, songIndex, isSongPlaying, user },
    dispatch,
  ] = useStateValue();

  

  const [isLoading, setIsLoading] = useState(true);
  const [infoArtist, setInfoArtist] = useState(null);
  const [ isPlaying, setIsPlaying ] = useState(false);

  
  const handlerSetPlay = () => {
    if(isPlaying){
      myRef.current.audio.current.play();
    } else {
      setIsPlaying(true);
      dispatch({type:actionType.SET_ALL_SONGS, payload: songsWait});
      dispatch({type:actionType.SET_SONG, payload: 0 });
      dispatch({type: actionType.SET_SONG_PLAYING, payload: true});
      myRef.current.audio.current.play();
    }
  }

  const handlerSetPause = () => {
      dispatch({type: actionType.SET_SONG_PLAYING, payload: false});
      myRef.current.audio.current.pause();
  }

  useEffect(() => {
    setIsLoading(true);
    dispatch({ type: actionType.SET_NO_OWNER_PLAYLIST})
    getInfoArtist(nameArtist).then((data) => {
      setInfoArtist(data);
      getPopularTrackOfArtist(nameArtist).then((result) => {
        dispatch({ type: actionType.SET_SONGS_WAIT, payload: result });
        setIsPlaying(songs.length === result.length && isSongPlaying && songs.every((song) => result.some((track) => track._id === song._id)))
        setIsLoading(false);
      });
    });
  }, [nameArtist]);

  return (
    <div 
    className="w-screen flex min-w-[768px] h-[calc(100vh-90px)] bg-layoutBg relative"
    >
      <SideBar />
      <Header />
      <div className="grow relative w-[calc(100%-570px)] min-h-full block">
        <div className="relative overflow-hidden w-full h-full">
          <main className="absolute inset-0 overflow-x-hidden overflow-y-scroll mr-[-6px] mb-[0px] px-[59px]">
            {!isLoading && (
              <motion.div 
              className="min-h-[calc(100%-158px)] mt-[70px] !mb-[30px] grow mx-auto my-0 relative w-full"
              layout
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: 'linear' }}
              >
                <div className="relative min-h-[410px] mt-[-70px] mr-0 mb-[30px] ml-0 ">
                  <div className="absolute inset-0 mx-[-59px] my-0 overflow-hidden">
                    <div
                      style={{
                        backgroundImage: `url("${infoArtist.thumbnailM}")`,
                      }}
                      className="h-full bg-no-repeat bg-cover blur-[50px] absolute inset-0 "
                    ></div>
                    <div className="h-full z-[1] absolute inset-0 bg-artistLayoutBg"></div>
                  </div>
                  <div className="relative z-[2] pt-[110px] pr-0 pb-[40px] pl-0 w-full h-full min-w-[720px] grow mx-auto my-0 ">
                    <div className="flex flex-wrap relative mx-[-15px] my-0 ">
                      <div className="flex flex-col justify-between w-[58.3333%] relative min-h-[1px] pl-[14px] pr-[14px] float-left shrink-0 !mb-0 px-[15px] py-0">
                        <div>
                          <h3 className="text-[40px] font-bold leading-normal mb-[5px] text-white block">
                            {infoArtist.name}
                          </h3>
                          <div>
                            <div className="max-h-[70px] overflow-y-auto text-[14px] leading-[1.64] mb-[10px] text-white">
                              {infoArtist.biography}
                            </div>
                          </div>
                        </div>
                        <div className="max-h-[128px] flex flex-col justify-between grow shrink">
                          <div className="flex items-center text-[12px] ">
                            {!isSongPlaying ? (
                              <button className="m-0 bg-purplePrimary border-purplePrimary text-white text-[14px] px-[24px] py-[9px] flex justify-center items-center font-normal border-[1px] border-solid border-borderPrimary uppercase !mr-[10px] rounded-full text-center relative"
                              onClick={handlerSetPlay}
                              >
                                <BsPlayFill className="text-[16px] mr-[5px] leading-[66%] inline-block" />
                                <span>Phát nhạc</span>
                              </button>
                            ) : !isPlaying ? (
                              <button className="m-0 bg-purplePrimary border-purplePrimary text-white text-[14px] px-[24px] py-[9px] flex justify-center items-center font-normal border-[1px] border-solid border-borderPrimary uppercase !mr-[10px] rounded-full text-center relative"
                              onClick={handlerSetPlay}
                              >
                                <BsPlayFill className="text-[16px] mr-[5px] leading-[66%] inline-block" />
                                <span>Phát nhạc</span>
                              </button>
                            ) : isSongPlaying ? (
                              <button className="m-0 bg-purplePrimary border-purplePrimary text-white text-[14px] px-[24px] py-[9px] flex justify-center items-center font-normal border-[1px] border-solid border-borderPrimary uppercase !mr-[10px] rounded-full text-center relative"
                              onClick={handlerSetPause}
                              >
                                <BsPauseFill className="text-[16px] mr-[5px] leading-[66%] inline-block" />
                                <span>Tạm dừng</span>
                              </button>
                            ) : (
                              <button className="m-0 bg-purplePrimary border-purplePrimary text-white text-[14px] px-[24px] py-[9px] flex justify-center items-center font-normal border-[1px] border-solid border-borderPrimary uppercase !mr-[10px] rounded-full text-center relative"
                              onClick={handlerSetPlay}
                              >
                                <BsPlayFill className="text-[16px] mr-[5px] leading-[66%] inline-block" />
                                <span>Phát nhạc</span>
                              </button>
                            )}
                            <button className="m-0 bg-purplePrimary border-purplePrimary text-white text-[14px] px-[24px] py-[9px] flex justify-center items-center font-normal border-[1px] border-solid border-borderPrimary uppercase !mr-[10px] rounded-full text-center relative">
                              <span>Quan tâm</span>
                            </button>
                          </div>
                          <div className="p-0 flex items-center text-left rounded-[5px] mt-[20px]">
                            <div className="mr-[10px] shrink-0 block relative overflow-hidden rounded cursor-pointer">
                              <div className="block relative overflow-hidden rounded">
                                <figure className="w-[60px] h-[60px] bg-borderPrimary">
                                  <img src={songsWait[0]?.thumbnail} alt="" />
                                </figure>
                                <div className="invisible w-full h-full absolute top-0 left-0 bg-darkAlpha50 "></div>
                                {songs[songIndex]?._id === songsWait[0]?._id ? (
                                  <div className="absolute top-0 left-0 bottom-0 right-0 ">
                                    <div className="visible w-full h-full absolute top-0 left-0 bg-darkAlpha50 "></div>
                                    <div className="absolute left-[50%] top-[50%] bottom-auto right-auto z-[98] flex justify-around items-center visible w-[80%] translate-x-[-50%] translate-y-[-50%]">
                                      {isSongPlaying ? (
                                        <button className="text-[18px] leading-[0] h-[24px] rounded-full border-[0] inline-block text-center cursor-pointer relative font-normal p-[0]">
                                          <BsPauseFill className="text-white text-4xl p-[5px] rounded-[50%] leading-[66%] inline-block" />
                                        </button>
                                      ) : (
                                        <button className="text-[18px] leading-[0] h-[24px] rounded-full border-[0] inline-block text-center cursor-pointer relative font-normal p-[0]">
                                          <BsPlayFill className="text-white text-4xl p-[5px] rounded-[50%] leading-[66%] inline-block" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="absolute top-0 left-0 bottom-0 right-0 ">
                                    <div className="invisible group-hover:visible w-full h-full absolute top-0 left-0 bg-darkAlpha50 "></div>
                                    <div className="absolute left-[50%] top-[50%] bottom-auto right-auto z-[98] flex justify-around items-center invisible w-[80%] translate-x-[-50%] translate-y-[-50%] group-hover:visible">
                                      <button className="text-[18px] leading-[0] h-[24px] rounded-full border-[0] inline-block text-center cursor-pointer relative font-normal p-[0]">
                                        <BsPlayFill className="text-white text-4xl p-[5px] rounded-[50%] leading-[66%] inline-block" />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="overflow-hidden flex flex-col grow shrink text-left self-center w-0 text-white">
                              <span>MỚI NHẤT</span>
                              <h4 className="text-[14px] font-medium leading-[1.57] whitespace-nowrap text-ellipsis overflow-hidden max-w-full inline-block align-top">
                                {songsWait[0]?.title}
                              </h4>
                              <h3 className="block text-[12px] mt-[3px] whitespace-nowrap text-ellipsis overflow-hidden max-w-full leading-normal text-songItemAction font-normal">
                                {songsWait[0]?.releaseDate}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </div>
                      <motion.div className="flex justify-end w-[41.66667%] relative min-h-[1px] pl-[14px] pr-[14px] float-left shrink-0 !mb-0 px-[15px] py-0"
                      initial={{ opacity: 0.5, scale: 0.5 , x: "80%"}}
                      animate={{ opacity: 1, scale: 1 , x: "0%"}}
                      transition={{ duration: 0.8 , ease: "easeInOut"}}
                      >
                        <figure className="w-[260px] h-[260px] rounded-[50%] overflow-hidden leading-[0] bg-loadingBg">
                          <img
                            src={infoArtist.thumbnailM}
                            alt=""
                            className="h-auto w-full"
                          />
                        </figure>
                      </motion.div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <nav className="border-b-none pl-0 my-0 mx-[-59px] !mb-[30px]">
                    <div className="flex items-center min-h-[52px]">
                      <ul className="flex-nowrap font-normal mx-auto my-0 bg-alphaBg p-[3px] rounded-[15px] flex items-center text-[14px]">
                        <li className="text-textItemHover rounded-[15px] shadow bg-tabActiveBg p-0 text-[12px] leading-[1] min-w-[120px] m-0 w-max flex items-center justify-center uppercase relative ">
                          <div>
                            <Link to="/" className="block px-[25px] py-[7px]">
                              TỔNG QUAN
                            </Link>
                          </div>
                        </li>
                        <li className="text-navigationText rounded-[15px] p-0 text-[12px] leading-[1] min-w-[120px] m-0 w-max flex items-center justify-center uppercase relative ">
                          <div>
                            <Link to="/" className="block px-[25px] py-[7px]">
                              BÀI HÁT
                            </Link>
                          </div>
                        </li>
                        <li className="text-navigationText rounded-[15px] p-0 text-[12px] leading-[1] min-w-[120px] m-0 w-max flex items-center justify-center uppercase relative ">
                          <div>
                            <Link to="/" className="block px-[25px] py-[7px]">
                              ALBUM
                            </Link>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </nav>
                </div>
                <div className="!mt-[30px]">
                  <h3 className="mb-[16px] flex justify-between items-center text-[20px] text-white font-bold capitalize">
                    Bài hát nổi bật
                  </h3>
                  <div className="flex mb-[25px]">
                    <ul className="relative pt-[10px] w-[270px] h-[230px] flex items-center">
                      <li className="absolute cursor-pointer rounded overflow-hidden z-[1] left-0 w-[162px] h-[162px]">
                        <figure className="w-full h-full bg-loadingBg">
                          <img
                            src={infoArtist.thumbnailM}
                            alt=""
                            className="w-full h-full"
                          />
                        </figure>
                      </li>
                    </ul>
                    <div className="h-[244px] w-[calc(100%-270px)]">
                      <div className="relative overflow-hidden w-full h-full">
                        <div className="absolute inset-0 overflow-hidden mr-[-6px] mb-0">
                          <div className="!pl-[20px]">
                            <div>
                              {songsWait?.map((song, index) => (
                                <TrackArtist song={song} index={index} myRef={myRef} key={song._id}/>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Artist;
