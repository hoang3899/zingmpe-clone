import React from "react";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BiDotsHorizontalRounded, BiPause, BiPlay } from "react-icons/bi";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Link } from "react-router-dom";
import sublinks from "../data";
import { motion } from "framer-motion";

const Top100 = () => {
  const [allAbums, setAllAbums] = useState(sublinks);

  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <motion.div
      className="!mt-[80px]"
      initial={{  opacity: 0 }}
      animate={{  opacity: 1 }}
      transition={{ duration: 0.5, ease: "linear" , delay: 0.5 }}
    >
      <div className="grow mx-auto my-0 relative w-full">
        <h3 className="mb-[16px] flex justify-between items-center text-[20px] text-white font-bold capitalize">
          Top 100
          <Link
            to="/"
            className="text-[12px] font-medium uppercase flex items-center text-songItemAction hover:text-purplePrimary"
          >
            Tất cả
            <IoIosArrowRoundForward className="text-[18px] relative top-0 ml-[6px] text-inherit leading-[66%] inline-block" />
          </Link>
        </h3>
        <div className="relative">
          <div className="flex mx-[-15px] my-0 overflow-hidden">
            <div className="flex w-full">
              {allAbums?.map((abum) => (
                <div
                  key={abum.id}
                  className="w-[20%]  relative min-h-[1px] pl-[14px] pr-[14px] float-left shrink-0 flex flex-col"
                >
                  <div className="leading-normal">
                    <div className="w-full max-w-full relative">
                      <div>
                        <Link to={abum.link}>
                          <div className="block relative overflow-hidden rounded shrink-0 group">
                            <figure className="leading-[0] h-0 pb-[100%] rounded-[5px] overflow-hidden bg-loadingBg group-hover:scale-[1.1] transition-all duration-[0.5s] ease-in-out">
                              <img
                                src={abum.image}
                                alt=""
                                className="h-auto w-full"
                              />
                            </figure>
                            <div className="w-full h-full absolute top-0 left-0 bg-darkAlpha50 invisible group-hover:visible"></div>
                            <div className="absolute top-0 left-0 bottom-0 right-0">
                              <div
                                className={`${
                                  isPlaying ? "visible" : "invisible"
                                } w-full justify-evenly absolute left-[50%] top-[50%] bottom-auto right-auto flex items-center translate-x-[-50%] translate-y-[-50%] group-hover:visible`}
                              >
                                <button className="text-[20px] rounded-full border-none inline-block text-center relative hover:bg-alphaBg">
                                  <AiOutlineClose className="text-[30px] text-white p-[5px] rounded-[50%] leading-[66%] inline-block" />
                                </button>
                                {isPlaying ? (
                                  <button className="text-[14px] rounded-full border-none iline-block text-center relative">
                                    <BiPause className="w-[45px] h-[45px] flex items-center justify-center border-[1px] border-solid border-white rounded-[50%] text-[20px] text-white" />
                                  </button>
                                ) : (
                                  <button className="text-[14px] rounded-full border-none iline-block text-center relative">
                                    <BiPlay className="w-[45px] h-[45px] flex items-center justify-center border-[1px] border-solid border-white rounded-[50%] text-[20px] text-white" />
                                  </button>
                                )}
                                <button className="text-[20px] rounded-full border-none iline-block text-center relative">
                                  <BiDotsHorizontalRounded className="text-[35px] text-white p-[5px] rounded-[50%] leading-[66%] inline-block" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="mt-[8px]">
                        <h4 className="text-[14px] font-medium leading-[1.36] text-white overflow-hidden text-ellipsis block">
                          <Link
                            to={abum.link}
                            className="text-[14px] font-medium mt-0 whitespace-nowrap overflow-hidden text-ellipsis block text-left mr-0 mb-[4px] ml-0"
                          >
                            <span>{abum.title}</span>
                          </Link>
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Top100;
