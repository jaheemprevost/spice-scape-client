import {useState, useEffect, useContext} from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
import { ThemeContext } from '../../context/ThemeProvider';
import axiosInstance from '../../services/axios'; 
import User from './User';

export default function FollowerList() {
  const { logOut } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [followedCooks, setFollowedCooks] = useState(null);
  const [message, setMessage] = useState('');
  const { profileId } = useParams(); 

  useEffect(() => {
    const fetchFollowedCooks = async () => {
      try {
        const response = await axiosInstance.get(`profile/${profileId}/following`); 
      
        const { followedCooks, message } = response.data ?? {};
  
        if (followedCooks) {
          setFollowedCooks(followedCooks); 
        } else if (message) {
          setMessage(message);
        }

      } catch(err) {
        if (err.response.status === 500) {
          navigate('/something-wrong');
        } else if (err.response.status === 404) {
          navigate('/not-found')
        } else if (err.response.status === 401) {
          logOut();
          navigate('/login');
        }  
      }
    }
    
    fetchFollowedCooks();
  }, [profileId]);
 
  const followedCooksElements = followedCooks && followedCooks.map(cook => {     
    return <User key={cook.id} {...cook}/> 
  });

  return (
    <div className='users'>
      <Link className={`secondary-${theme}-btn`} to={`/profile/${profileId}`}>Back</Link>

      <h1>Following</h1>

      <div className='users-list'>
        {followedCooks ? followedCooksElements : message}
      </div>
    </div>

  )
}
