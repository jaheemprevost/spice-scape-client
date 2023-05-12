import {useState, useEffect, useContext} from 'react';
import { useParams, Link, NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
import { ThemeContext } from '../../context/ThemeProvider';
import axiosInstance from '../../services/axios'; 

export default function Profile() { 
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get(`profile/${profileId}`); 

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
      const response = await axiosInstance.post(`profile/${profileId}/follow`, {}); 
    
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
      const response = await axiosInstance.delete(`profile/${profileId}/follow`); 
    
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
  <button onClick={unfollowProfile} className='option-btn red-accent'>Unfollow</button> :
  <button onClick={followProfile} className='option-btn green-accent'>Follow</button>;

 
  return ( 
    <section className='profile'>
      <div className='profile-info'> 
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
        {isCurrentUser ? <Link to={`/profile/${profileId}/edit`}className={`secondary-${theme}-btn`}>Edit Profile</Link>: followButton}
      </div>

      <p className='biography'>{profile.biography}</p>
    </section>
  )
}
