import React from 'react'
import { NavLink } from 'react-router-dom'
import { isActiveStyles1, isNotActiveStyles1 } from '../styles'

const HeaderDash = () => {
  return (
    <div>
        <nav className="ml-0 mr-0 p-0 border-b-[1px] border-solid border-borderPrimary mb-[30px] mt-[30px] ">
            <div className="flex items-center min-h-[52px]">
                <div className="flex items-center text-sm font-medium h-[52px]">
                    <NavLink to="/dashboard/home" className={({isActive}) => isActive ? isActiveStyles1 : isNotActiveStyles1}>BÀI HÁT</NavLink>
                    <NavLink to="/dashboard/artists" className={({isActive}) => isActive ? isActiveStyles1 : isNotActiveStyles1}>NGHỆ SĨ</NavLink>
                    <NavLink to="/dashboard/abum" className={({isActive}) => isActive ? isActiveStyles1 : isNotActiveStyles1}>ABUM</NavLink>
                </div>
            </div>
        </nav>
    </div>
  )
}

export default HeaderDash