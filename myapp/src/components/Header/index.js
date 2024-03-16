import React, { useEffect, useRef, useState } from "react";
import { Link,useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import ProfileOptionsItem from "../ProfileOptionsItem";

const Header = () => {
    const [navbarLargeOpen , setNavbarLargeOpen] = useState(false);
    const myData = useSelector(state => state.myData);
    const Menus = ['Profile', 'Settings', 'Help & Support', 'Log out']
    const navigate = useNavigate();
    const defaultImage = "https://zultimate.com/wp-content/uploads/2019/12/default-profile.png"
    const imageSrc = myData?.profile?.image !== undefined && myData?.profile?.image !== "" ? myData.profile.image : defaultImage;
    const menuRef =  useRef();
    const profieRef = useRef();
    window.addEventListener('click',(e) =>{
        if(e.target !== menuRef.current && e.target !== profieRef.current)
        {
            setNavbarLargeOpen(false);
        }
    })

    
    

    const onClickLogout = () => {
        toast.success('Account Logout Successful !');
        Cookies.remove('jwt_token');
        Cookies.remove('login_mail');
        navigate('/login', { replace: true });
      }

    const handleMenuItemClick = (item) =>{
        setNavbarLargeOpen(false);
        if(item === 'Log out')
        {
            onClickLogout()
        }
    }

    const getNavigatePath = (item) =>{
        switch(item){
            case "Profile":
                return "/edit-profile";
            default:
                return null
        }
    }
    
    return (
        <nav className="nav-header">
            <div className="nav-content">
                <Link to="/">
                    <img
                        className="website-logo"
                        src="https://imgs.search.brave.com/jCVskrY9DhrUyR0CX-_mWggPcWFCuQbn577jDQ7AYaY/rs:fit:500:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi9iL2I1L0xv/Z29fQW51cmFnX1Vu/aXZlcnNpdHkuc3Zn/LzUxMnB4LUxvZ29f/QW51cmFnX1VuaXZl/cnNpdHkuc3ZnLnBu/Zw"
                        alt="website logo"
                    />
                    
                </Link>
                <ul className="nav-menu">
                    <Link to="/" className="nav-link">
                        <li>Home</li>
                    </Link>
                    <Link to="/" className="nav-link">
                        <li>Contact Us</li>
                    </Link>
                    <Link to="/" className="nav-link">
                        <li>About Us</li>
                    </Link>
                </ul>
                
                <div className="profile-viewer-container">
                    <img 
                    ref={profieRef}
                    src={imageSrc}
                    className="profile-pic"
                    onClick={()=>setNavbarLargeOpen(!navbarLargeOpen)}
                    alt="profile-pic"/>
                    {
                        navbarLargeOpen &&<div 
                        ref = {menuRef}
                        className="profie-viewer">
                        <ul className="profile-viewer-dropdown">
                            {Menus.map((item) => <ProfileOptionsItem to={getNavigatePath(item)} key={item} label={item} onClick={() => handleMenuItemClick(item)} />)}
                        </ul>
                    </div>}
                </div>
            </div>
        </nav>
    );
};

export default Header;
