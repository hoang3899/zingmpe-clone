import React, { useEffect, useState } from "react";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { GoSearch } from "react-icons/go";
import { RiTShirt2Fill, RiVipDiamondLine, RiVipLine } from "react-icons/ri";
import { BiSearch, BiTrendingUp } from "react-icons/bi";
import { MdLogout } from "react-icons/md";

import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase.config";
import { useStateValue } from "../context/StateProvider";
import { searchAll, searchTextAll, validateUser } from "../api";
import { actionType } from "../context/reducer";
import { Link, useNavigate } from "react-router-dom";
import { BsPauseFill, BsPlayFill, BsX } from "react-icons/bs";
import { useRef } from "react";

import { motion } from "framer-motion";

const Header = ({myRef }) => {
  const provider = new GoogleAuthProvider();
  const firebaseAuth = getAuth(app);
  const navigate = useNavigate();

  const [{ user, songs, songIndex, isSongPlaying }, dispatch] = useStateValue();

  const [isOpen, setIsOpen] = useState();
  const [isFocusInput, setIsFocusInput] = useState(false);

  const [ search, setSearch ] = useState("");
  const [ result, setResult ] = useState([]);
  const [ suggestions, setSuggestions] = useState([]);

  const tag = useRef();

  const loginWithGoogle = async () => {
    await signInWithPopup(firebaseAuth, provider).then((userCred) => {
      if (userCred) {
        firebaseAuth.onAuthStateChanged((userCred) => {
          if (userCred) {
            userCred.getIdToken().then((token) => {
              console.log(token);
              window.localStorage.setItem("auth", "true");
              validateUser(token).then((data) => {
                dispatch({
                  type: actionType.SET_USER,
                  user: data,
                });
              });
            });
            navigate("/", { replace: true });
          } else {
            window.localStorage.setItem("auth", "false");
            dispatch({
              type: actionType.SET_USER,
              user: null,
            });
            navigate("/");
          }
        });
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({type:actionType.SET_TEXT_SEARCH, payload:search });
    setSearch(search)
    navigate("/tim-kiem/tat-ca");
  }

  const handleSearch = (suggestion) => {
    dispatch({type:actionType.SET_TEXT_SEARCH, payload:suggestion });
    setSearch(suggestion)
    navigate("/tim-kiem/tat-ca");
  }

  const logoutHander = () => {
    setIsOpen(false);
    dispatch({
      type: actionType.SET_USER,
      user: null,
    });
  };

  const handleClickOutside = e => {
    if (!tag.current.contains(e.target)) {
      setIsFocusInput(false);
      setSearch("");
      setResult([])
    }
};

const handleClickInside = () => setIsFocusInput(true);

useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
});

const linkToArtist = (artist) => {
  setSearch("");
  setResult([])
  setIsFocusInput(false);
  dispatch({ type: actionType.GET_NAME_ARTIST, payload: artist });
  //navigate("/");
  navigate(`/nghe-si/${artist}`);
};

const handerSetPlay = (track) => {
  const array = [];
  array.push(track);
  dispatch({ type: actionType.SET_ALL_SONGS, payload: array });
  dispatch({ type: actionType.SET_SONG, payload: 0 });
  dispatch({ type: actionType.SET_SONG_PLAYING, payload: true });
  myRef?.current.audio.current.play();
};

const handerSetPause = () => {
  dispatch({ type: actionType.SET_SONG_PLAYING, payload: false });
  myRef?.current.audio.current.pause();
};


useEffect(() => {
  if (search.length >= 1) {
    searchAll(search).then((data) => {
      setResult(data);
    });
    searchTextAll(search).then((data) => {
      setSuggestions(data);
    })
  }
}, [search]);

  return (
    <header className={`!z-[99] flex items-center fixed left-[240px] top-0 right-0 h-70 py-0 px-[59px] min-w-[660px]`}>
      <div className="w-full flex items-center justify-between break-words">
        <div className="grow mr-[10px] flex items-center justify-start">
          <button className="flex items-center text-sm font-normal text-center relative">
            <AiOutlineArrowLeft className="text-2xl mr-[20px] inline-block fill-white" />
          </button>
          <button className="flex items-center text-sm font-normal text-center relative">
            <AiOutlineArrowRight className="text-2xl mr-[20px] inline-block fill-white" />
          </button>
          <form className="relative w-full max-w-[540px]"
          onClick={handleClickInside}
          ref={tag} 
          onSubmit={handleSubmit}
          >
            <div
              className={`relative  h-40  ${
                isFocusInput
                  ? "shadow rounded-t-[20px] rounded-b-[0px] border-[1px] border-solid border-transparent bg-primaryBg"
                  : "rounded-[20px] bg-alphaBg"
              }`}
            >
              <button className="flex items-center text-[14px] font-normal relative">
                <GoSearch className="absolute cursor-pointer text-xl top-[10px] left-[10px] inline-block fill-white" />
              </button>
              <div className="absolute top-0 left-[38px] right-[10px] bottom-0">
                <input
                  type="text"
                  className="m-0 inline-block w-[95%] text-[14px] text-searchText border-none border-[0] relative top-[2px] h-[34px] py-[5px] px-0 leading-[34px] bg-transparent bg-clip-padding focus: outline-0"
                  placeholder="Tìm kiếm bài hát, nghệ sĩ, lời bài hát..."
                  onFocus={() => setIsFocusInput(true)}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {search?.length > 0 && (
                <BsX className="absolute right-[15px] left-auto text-[25px] top-[8px] cursor-pointer text-navigationText leading-[66%] inline-block" 
                onClick={() => setSearch("")}
                />
              )}
            </div>
            {isFocusInput && (
              <ul className="absolute overflow-hidden w-full h-auto min-h-0 bg-primaryBg z-[8] block rounded-b-[20px] shadow-md px-[10px] py-[13px] text-white">
                <div className="max-h-[calc(100vh-180px)] overflow-y-auto">
                  {search?.length === 0 ? (
                    <>
                    <div className="text-[14px] font-bold pt-0 pr-[10px] pb-[8px] flex justify-between">
                    Đề xuất cho bạn
                    </div>
                    <li className="flex items-baseline rounded px-[10px] py-[8px] relative overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer hover:bg-alphaBg">
                      <BiTrendingUp className="text-[16px] text-songItemAction relative top-[3px] mr-[10px] leading-[66%] inline-block" />
                      <div className="overflow-hidden text-ellipsis">
                        pink venom
                      </div>
                    </li>
                    <li className="flex items-baseline rounded px-[10px] py-[8px] relative overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer hover:bg-alphaBg">
                      <BiTrendingUp className="text-[16px] text-songItemAction relative top-[3px] mr-[10px] leading-[66%] inline-block" />
                      <div className="overflow-hidden text-ellipsis">mặt mộc</div>
                    </li>
                    </>
                  ) : suggestions?.length > 0 ? (
                    <>
                    <div className="text-[14px] font-bold pt-0 pr-[10px] pb-[8px] flex justify-between">
                      Từ khóa liên quan
                    </div>
                    {suggestions?.map((suggestion,index) => (
                    <li
                    className="flex items-baseline rounded px-[10px] py-[8px] relative overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer hover:bg-alphaBg"
                    key={index}
                    onClick={() => handleSearch(suggestion)}
                    >
                      <BiTrendingUp className="text-[16px] text-songItemAction relative top-[3px] mr-[10px] leading-[66%] inline-block" />
                      <div className="overflow-hidden text-ellipsis">
                        {suggestion}
                      </div>
                    </li>
                    ))}
                    <li
                    className="flex items-baseline rounded px-[10px] py-[8px] relative overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer hover:bg-alphaBg"
                    onClick={() => handleSearch(search)}
                    >
                      <BiSearch className="text-[16px] text-songItemAction relative top-[3px] mr-[10px] leading-[66%] inline-block" />
                      Tìm kiếm
                      <span className="text-white font-bold">
                        "{search}"
                      </span>
                    </li>  
                    </>
                  ) : (
                    <>
                    <div className="text-[14px] font-bold pt-0 pr-[10px] pb-[8px] flex justify-between">
                      Từ khóa liên quan
                    </div>
                    <li
                    className="flex items-baseline rounded px-[10px] py-[8px] relative overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer hover:bg-alphaBg"
                    >
                      <BiSearch className="text-[16px] text-songItemAction relative top-[3px] mr-[10px] leading-[66%] inline-block" />
                      <span className="text-white font-bold">
                        "{search}"
                      </span>
                    </li> 
                    <li
                    className="flex items-baseline rounded px-[10px] py-[8px] relative overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer hover:bg-alphaBg"
                    >
                      <BiSearch className="text-[16px] text-songItemAction relative top-[3px] mr-[10px] leading-[66%] inline-block" />
                      Tìm kiếm
                      <span className="text-white font-bold">
                        "{search}"
                      </span>
                    </li> 
                    </>
                  )}
                  {(search?.length > 0 && result.length > 0 && result[0].items?.length > 0 && result[1].items?.length > 0) && (
                    <motion.div className="border-t-[1px] border-t-solid border-t-borderPrimary mt-[10px] pt-[10px]"
                    initial={{ opacity: 0 , height:0}}
                    animate={{ opacity: 1 , height: "auto"}}
                    transition={{ duration : 0.5}}
                    >
                      <div className="text-[14px] font-bold pt-0 pr-[10px] pb-[8px] flex justify-between">
                        Gợi ý kết quả
                      </div>
                      {result[0].items?.map((track) => (
                        <motion.li className="cursor-auto p-0 flex items-baseline rounded relative overflow-hidden text-ellipsis whitespace-nowrap group hover:bg-alphaBg"
                        key={track._id}
                        initial={{ opacity: 0.5}}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5}}
                        >
                          <div className="px-[10px] py-[8px] grow shrink flex items-center text-left rounded-[5px] ">
                            <div className="relative overflow-hidden rounded mr-[10px] grow-0 shrink-0 ">
                              <div>
                                <figure className="rounded overflow-hidden h-[52px] w-[52px] bg-loadingBg">
                                  <img
                                    src={track.thumbnail}
                                    alt=""
                                    className="inline-block align-top height-auto w-full"
                                  />
                                </figure>
                                <div className="hidden invisble w-full h-full absolute top-0 left-0 bg-darkAlpha50  group-hover:block"></div>
                                {songs[songIndex]?._id === track._id ? (
                                  <>
                                  {isSongPlaying ? (
                                    <button className="flex absolute top-0 left-0 right-0 bottom-0 w-full items-center justify-center text-[14px] rounded-full leading-normal border-[0] font-normal text-center "
                                    onClick={handerSetPause}
                                    >
                                      <BsPauseFill className="text-white m-0 block relative top-0 text-[20px] leading-[66%]" />
                                    </button>
                                  ) : (
                                    <button className="flex absolute top-0 left-0 right-0 bottom-0 w-full items-center justify-center text-[14px] rounded-full leading-normal border-[0] font-normal text-center"
                                    onClick={() => handerSetPlay(track)}
                                    >
                                      <BsPlayFill className="text-white m-0 block relative top-0 text-[20px] leading-[66%]" />
                                    </button>
                                  )}
                                  </>
                                  
                                ) : (
                                  <button className="hidden absolute top-0 left-0 right-0 bottom-0 w-full items-center justify-center text-[14px] rounded-full leading-normal border-[0] font-normal text-center group-hover:flex"
                                  onClick={() => handerSetPlay(track)}
                                  >
                                    <BsPlayFill className="text-white m-0 hidden relative top-0 text-[20px] leading-[66%] group-hover:block" />
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="grow shrink text-left self-center w-0 ">
                              <h3 className="flex items-center text-[14px] m-0 whitespace-nowrap text-ellipsis overflow-hidden max-w-full leading-normal font-medium align-top text-white capitalize">
                                <Link
                                  to="/"
                                  className="max-w-[90%] whitespace-nowrap text-ellipsis overflow-hidden leading-normal inline-block"
                                >
                                  {track.title}
                                </Link>
                              </h3>
                              <h3 className="flex text-xs m-0 text-[12px] mt-[3px] overflow-hidden max-w-full text-ellipsis font-normal text-songItemAction">
                                {track.artistsNames.map((name, index) => (
                                  <span key={index}>
                                    {name}
                                    {index < track.artistsNames.length - 1
                                      ? ","
                                      : ""}
                                  </span>
                                ))}
                              </h3>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                      {result[1].items?.map((item, index) => (
                        <motion.button
                          key={item._id}
                          className="w-full hover:bg-alphaBg rounded"
                          initial={{ opacity: 0.5}}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5}}
                          onClick={() => linkToArtist(item.name)}
                        >
                          <li className="px-[10px] py-[8px] flex items-baseline rounded relative overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer ">
                            <div className="p-0 grow shrink flex items-center text-left rounded-[5px]">
                              <div className="mr-[10px] grow-0 shrink-0">
                                <figure className="overflow-hidden h-[52px] w-[52px] !rounded-full bg-loadingBg">
                                  <img
                                    src={item.thumbnail}
                                    alt=""
                                    className="inline-block align-top h-auto w-full"
                                  />
                                </figure>
                              </div>
                              <div className="grow shrink text-left self-center w-0">
                                <h3 className="text-[14px] m-0 whitespace-nowrap text-ellipsis overflow-hidden max-w-full leading-normal inline-block font-medium align-top text-white">
                                  {item.name}
                                </h3>
                                <h3 className="m-0 block text-[12px] whitespace-nowrap text-ellipsis overflow-hidden max-w-full leading-normal text-songItemAction font-normal">
                                  Nghệ sĩ * {item.totalFollow} quan tâm
                                </h3>
                              </div>
                            </div>
                          </li>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </ul>
            )}
          </form>
        </div>
        <div className="mt-0 flex items-center justify-end grow-0">
          <div className="relative mr-[10px]">
            <button className="w-40 h-40 flex justify-center items-center bg-alphaBg text-sm font-normal text-center rounded-full">
              <RiTShirt2Fill className="fill-white p-[5px] rounded-full text-3xl inline-block" />
            </button>
          </div>
          <div className="relative mr-[10px]">
            <button className="w-40 h-40 flex justify-center items-center bg-alphaBg text-sm font-normal text-center rounded-full">
              <RiTShirt2Fill className="fill-white p-[5px] rounded-full text-3xl inline-block" />
            </button>
          </div>
          <div className="relative mr-[10px]">
            <button className="w-40 h-40 flex justify-center items-center bg-alphaBg text-sm font-normal text-center rounded-full">
              <RiTShirt2Fill className="fill-white p-[5px] rounded-full text-3xl inline-block" />
            </button>
          </div>
          <div className="relative ">
            <div className="relative rounded-full flex items-center justify-center">
              {!user ? (
                <button
                  className="relative text-sm rounded-full inline-block text-center font-normal"
                  onClick={loginWithGoogle}
                >
                  <figure className="overflow-hidden rounded-full w-38 h-38 bg-loadingBg">
                    <img
                      src="https://s120-ava-talk-zmp3.zmdcdn.me/default"
                      alt=""
                      className="inline-block align-top w-full"
                    />
                  </figure>
                </button>
              ) : (
                <button
                  className="relative text-sm rounded-full inline-block text-center font-normal"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <figure className="overflow-hidden rounded-full w-38 h-38 bg-loadingBg">
                    <img
                      src={user.avatar_url}
                      alt=""
                      className="inline-block align-top w-full"
                    />
                  </figure>
                </button>
              )}
            </div>
            {isOpen && (
              <div className="absolute shadow-xl w-240 z-[5] rounded-lg bg-primaryBg pt-0 top-[50px] right-0 ">
                <ul className="py-[10px] px-0">
                  <li className="relative hover:bg-sideBar">
                    <Link to="/">
                      <button className="py-[12px] pr-[20px] pl-[17px] flex w-full text-sm text-navigationText">
                        <RiVipDiamondLine className="inline-block mr-[10px] text-xl" />
                        <span>Nâng cấp VIP</span>
                      </button>
                    </Link>
                  </li>
                  <li className="relative hover:bg-sideBar">
                    <Link to="/">
                      <button className="py-[12px] pr-[20px] pl-[17px] flex w-full text-sm text-navigationText">
                        <RiVipLine className="inline-block mr-[10px] text-xl" />
                        <span>Mua code VIP</span>
                      </button>
                    </Link>
                  </li>
                  <li className="relative mt-[20px] after:content-[''] after:absolute after:top-[-10px] after:w-full after:h-1 after:bg-navigationText hover:bg-sideBar">
                    <Link to="/">
                      <button
                        className="py-[12px] pr-[20px] pl-[17px] flex w-full text-sm text-navigationText"
                        onClick={logoutHander}
                      >
                        <MdLogout className="inline-block mr-[10px] text-xl" />
                        <span>Đăng xuất</span>
                      </button>
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
