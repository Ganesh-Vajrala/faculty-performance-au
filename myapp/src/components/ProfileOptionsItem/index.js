import React from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import './index.css'
import { Link } from "react-router-dom";

const ProfileOptionsItem = ({label, to, onClick}) =>{
 const content = (
    <>
    {label}
    {label !== "Log out" && <MdKeyboardArrowRight className="profile-viewer-dropdown-list-arrow" size="20px"/>}
    </>
 )
 return to ? (
    <Link to = {to} onClick={onClick}  className={label === "Log out"?"logout-option":"profile-viewer-dropdown-Link"}>
        {content}
    </Link>
 ):(
<li  onClick={onClick} className={label === "Log out"?"logout-option":""}>
    {content}
</li>
 );
}

export default ProfileOptionsItem