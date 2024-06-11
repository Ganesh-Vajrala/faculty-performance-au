import React, { useEffect, useState,useMemo } from "react";
import Cookies from "js-cookie";
import Header from "../Header";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { baseUrl } from "../../Apis";
import { SpinnerCircularFixed } from 'spinners-react';

const Home = () =>{
    const jwtToken = Cookies.get('jwt_token');
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
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
          setLoading(true)
          try {
            const response = await fetch(`${baseUrl}/profile-details/`, {
              headers,
            });
            const data = await response.json();
            setApiData(data);
            console.log(data);
            dispatch({ type: 'SET_DATA', payload: data });
          } catch (error) {
            console.error('Error fetching data:', error);
          }finally {
            setLoading(false); 
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
                         { apiData&& (
                                <>
                                    <p>Name: {apiData.profile?apiData.profile.doctrate !== "No"?`Dr. ${apiData.profile.firstname} ${apiData.profile.lastname}`:`${apiData.profile.firstname} ${apiData.profile.lastname}`:apiData.username}</p>
                                    <p>Department: {apiData.department}</p>
                                    <p>Desigantion: {apiData.profile.designation}</p>
                                    {/* Render other details if available */}
                                </>
                            )}
                            <div className="edit-details-sec-button-in-profile-details">
                              <button className="edit-button-in-details-sec" onClick={()=>navigate("/edit-profile")}>
                                Edit
                              </button>
                            </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
    )
}
export default Home

