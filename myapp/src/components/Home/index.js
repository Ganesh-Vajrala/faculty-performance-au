import React, { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import Header from "../Header";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { baseUrl } from "../../Apis";
import { SpinnerCircularFixed } from 'spinners-react';

const Home = () => {
  const jwtToken = Cookies.get('jwt_token');
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(true);
      const navigate = useNavigate();

      const headers = useMemo(() => ({
        'authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
      }), [jwtToken]);

      useEffect(() => {
        if (jwtToken === undefined) {
          navigate("/login", { replace: true });
        } else {
          const fetchData = async () => {
            setLoading(true);
            try {
              const response = await fetch(`${baseUrl}/profile-details/`, { headers });
              const data = await response.json();
              setApiData(data);
              dispatch({ type: 'SET_DATA', payload: data });

              const profile = data.profile;
              const profileComplete = profile && profile.firstname && profile.lastname && profile.gender && profile.designation && profile.dateOfjoining && profile.doctrate;
              setIsProfileComplete(profileComplete);

            } catch (error) {
              console.error('Error fetching data:', error);
            } finally {
              setLoading(false);
            }
          };

          fetchData();
        }
      }, [jwtToken, navigate, dispatch, headers]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!isProfileComplete) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isProfileComplete]);

  const handleAction = (event) => {
    if (!isProfileComplete) {
      event.preventDefault();
      alert("Please complete your profile before proceeding.");
      navigate("/edit-profile", { replace: true });
    }
  };

  

  return (
    <div className="home-main-container" onClick={handleAction}>
      <Header />
      <marquee className="marquee">website is under development</marquee>
      <div className="container container-wide">
        <div className="row">
          <div className="col-md-8 profile-details-section-container">
            <div className="profile-details-section-inner-container">
              <h1 className="Profile-details-element">Profile Details</h1>
              { apiData&& (
                  <>
                      <p>Name: {apiData.profile?apiData.profile.doctrate !== "No"?`Dr. ${apiData.profile.firstname} ${apiData.profile.lastname}`:`${apiData.profile.firstname} ${apiData.profile.lastname}`:apiData.username}</p>
                      <p>Department: {apiData.department}</p>
                      <p>Desigantion: {apiData.profile.designation}</p>
                  </> 
                            )}
              {!isProfileComplete && (
                <div className="alert alert-warning" role="alert">
                  Please complete your profile to access all features.
                </div>
              )}
              <div className="edit-details-sec-button-in-profile-details">
                <button className="edit-button-in-details-sec" onClick={() => navigate("/edit-profile", {replace:true})}>
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
 