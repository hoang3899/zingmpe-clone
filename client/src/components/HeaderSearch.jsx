import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import categories from "../data01";

const HeaderSearch = ({ firstAlpha }) => {
 
  return (
    <nav className="border-b-[1px] border-b-solid border-b-borderPrimary mx-[-59px] my-0 pl-[59px] !mb-[30px]">
      <div className="flex items-center min-h-[52px]">
        <h3 className="shrink-0 text-[24px] m-0 pr-[20px] border-r-[1px] border-r-solid border-r-borderPrimary leading-normal text-white font-bold ">
          Kết Quả Tìm Kiếm
        </h3>
        <ul className="flex items-center flex-wrap text-[14px] font-medium ">
          {categories?.map((category, index) => (
            <li
              className="text-white flex items-center justify-center uppercase relative mx-[20px] my-0 leading-normal "
              key={index}
            >
              <div
                className={`${
                  category[0] === firstAlpha
                    ? "after:block after:absolute after:w-full after:top-full after:border-b-[2px] after:border-b-solid after:border-b-purplePrimary"
                    : ""
                }`}
              >
                <NavLink
                  to={`/tim-kiem/${category[0]}`}
                  className="block px-0 py-[15px] "
                >
                  {category[1]}
                </NavLink>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default HeaderSearch;
