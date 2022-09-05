import React from 'react'
import { NavLink } from 'react-router-dom';
import { isActiveStyles1, isNotActiveStyles1 } from './../styles';

const HeaderMyMusic = () => {
  return (
    <div>
        <nav className="ml-0 mr-0 p-0 border-b-[1px] border-solid border-borderPrimary mb-[30px] mt-[30px] ">
            <div className="flex items-center min-h-[52px]">
                <div className="flex items-center text-sm font-medium h-[52px]">
                    <NavLink to="/mymusic/home" className={({isActive}) => isActive ? isActiveStyles1 : isNotActiveStyles1}>BÀI HÁT</NavLink>
                    <NavLink to="/mymusic/playlist" className={({isActive}) => isActive ? isActiveStyles1 : isNotActiveStyles1}>PLAYLIST</NavLink>
                </div>
            </div>
        </nav>
    </div>
  )
}

export default HeaderMyMusic