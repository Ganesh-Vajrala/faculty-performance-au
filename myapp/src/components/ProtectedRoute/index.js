// ProtectedRoute.js

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseUrl } from '../../Apis';

const ProtectedRoute = ({children }) => {
  const jwtToken = Cookies.get('jwt_token');
  const [isProfileComplete, setIsProfileComplete] = useState(null);
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      if (!jwtToken) {
        setRedirectPath('/login');
        return;
      }
  
      try {
        const response = await fetch(`${baseUrl}/profile-details/`, {
          headers: {
            authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
  
        const profile = data.profile;
        const profileComplete =
          profile &&
          profile.firstname &&
          profile.lastname &&
          profile.gender &&
          profile.designation &&
          profile.dateOfjoining &&
          profile.doctrate;
  
        if (!profileComplete) {
          setRedirectPath('/edit-profile');
          toast.error('Complete Profile First');
        } else {
          setIsProfileComplete(true);
        }
      } catch (error) {
        console.error('Error fetching profile details:', error);
        setRedirectPath('/edit-profile');
      } 
    };
  
    fetchProfileDetails();
  }, [jwtToken]);

  if (redirectPath) {
    return <Navigate to={redirectPath} />;
  }

  if (isProfileComplete) {
    return children;
  }

  return null;
};

export default ProtectedRoute;