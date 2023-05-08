import {useState, useEffect, useContext} from 'react';
import { useParams, Link, NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
import axios from 'axios';
import useRefreshToken from '../../hooks/useRefreshToken';

export default function Profile() { 
  const navigate = useNavigate();
  const {user} = useContext(AuthContext);
  const [profile, setProfile] = useState({
    profileImage: '',
    username: '',
    followerCount: 0,
    followingCount: 0,
    biography: ''
  });
  const [recipes, setRecipes] = useState([]);
  const [comments, setComments] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const { profileId } = useParams();

  const isCurrentUser = user.userId === profileId;
  // useRefreshToken();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`https://spice-scape-server.onrender.com/api/v1/profile/${profileId}`,
        {
          headers: { 
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
            withCredentials: true
          } 
        }); 

        setProfile(response.data.user);
        setIsFollowing(response.data.isFollowing);
        setRecipes(response.data.recipes);
        setComments(response.data.comments);
      } catch(err) {
          if (err.response.status === 404) {
            navigate('/not-found');
          }
      }
    };

    fetchProfile();
  }, [profileId, isFollowing]);

  const followProfile = async () => {
    try {
      const response = await axios.post(`https://spice-scape-server.onrender.com/api/v1/profile/${profileId}/follow`, {},
    {
    headers: { 
      'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
      withCredentials: true
    } 
    }); 
    
    if (response.data.message) {
      setIsFollowing(true); 
    }

    } catch(err) {
      if (err.response.status === 500) { 
        navigate('/something-wrong');
      } 
    }
  };

  const unfollowProfile = async () => {
    try {
      const response = await axios.delete(`https://spice-scape-server.onrender.com/api/v1/profile/${profileId}/follow`,
    {
    headers: { 
      'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
      withCredentials: true
    } 
    }); 
    
    if (response.data.message) {
      setIsFollowing(false);
    }

    } catch(err) {
      if (err.response.status === 500) { 
        navigate('/something-wrong');
      } 
    }
  };

  const followButton = isFollowing ? 
  <button onClick={unfollowProfile} className='unfollow-btn'>Unfollow</button> :
  <button onClick={followProfile} className='follow-btn'>Follow</button>;

 
  return ( 
    <section className='profile'>
      <div className='user-info'> 
       <img className='profile-pic' src={profile.profileImage}/>
       <p className='profile-name'>{profile.username}</p>
      </div> 

      <div className='profile-statistics'>
        <div className='followers'>
          <p>Followers</p>
          <p className='follower-count'>{profile.followerCount}</p>
        </div>
        
        <div className='following'>
          <p>Following</p>
          <p className='following-count'>{profile.followingCount}</p>
        </div>
      </div>

      <div className='profile-options'>
        {isCurrentUser ? <Link to={`/profile/${profileId}/edit`}className='edit-btn'>Edit Profile</Link>: followButton}
      </div>

      <p className='biography'>{profile.biography}</p>
    </section>
  )
}
