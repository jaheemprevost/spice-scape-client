import {useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import axios from 'axios';

export default function useRefreshToken() {
  const navigate = useNavigate();
  const {setUser, setLoggedIn} = useContext(AuthContext);

  const refreshAccessToken = async () => {
    
    try {
      const response = await axios.post('https://spice-scape-server.onrender.com/api/v1/auth/refresh', {},
      {
        headers: {'Content-Type': 'application/json'},
        withCredentials: true
      }); 
      if (response.status === 200) {
        localStorage.setItem('accessToken', response.data.accessToken);
      } 
    } catch(err) { 
      if (err.response.status === 404 || err.response.status === 401) {
        navigate('/login');
        setUser({});
        setLoggedIn(false);
        localStorage.removeItem('accessToken');
        navigate('/login');
      } 
          
    }
  };

  refreshAccessToken();

}
