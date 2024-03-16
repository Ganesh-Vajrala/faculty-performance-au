import React, { useEffect, useState,useMemo } from "react";
import Cookies from "js-cookie";
import Header from "../Header";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

const Home = () =>{
    const jwtToken = Cookies.get('jwt_token');
    const dispatch = useDispatch();
    const [apiData, setApiData] = useState(null);
    const navigate = useNavigate();
    const headers = useMemo(() => ({
      'authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json'
    }), [jwtToken]);
    useEffect(() => {
        if (jwtToken === undefined) {
          navigate("/login", { replace: true });
        }
        const fetchData = async () => {
          try {
            const response = await fetch('http://localhost:3100/profile-details/', {
              headers,
            });
            const data = await response.json();
            setApiData(data);
            console.log(data);
            dispatch({ type: 'SET_DATA', payload: data });
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };    

        fetchData();
      }, [jwtToken, navigate, dispatch]);
    return(
        <div className="home-main-container">
                <Header/>
                <div className="container  container-wide">
                  <div className="row">
                    <div className="col-md-8 profile-details-section-container">
                      <div className="profile-details-section-inner-container">
                         <h1 className="Profile-details-element">Profile Details</h1>
                         <div className="Profile-elements-wrapper">
                         </div>
                      </div>
                    </div>
                    <div className="col-md-4 other-details-entry-section-container">
                    
                    </div>
                  </div>
                </div>
            </div>
    )
}
export default Home

