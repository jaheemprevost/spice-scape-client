import {useState, useEffect, useContext} from 'react';
import { useParams, Link, NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
import { ThemeContext } from '../../context/ThemeProvider';
import axiosInstance from '../../services/axios'; 

export default function Profile() {
  const { user, logOut } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext); 
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null); 
  const [isFollowing, setIsFollowing] = useState(false);
  const { profileId } = useParams();

  const isCurrentUser = user.userId === profileId; 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get(`profile/${profileId}`); 

        setProfile(response.data.user);
        setIsFollowing(response.data.isFollowing); 
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
      } else if (err.response.status === 404) {
        navigate('/not-found')
      }  else if (err.response.status === 403) {
        navigate('/not-authorized');
      } else if (err.response.status === 401) {
        logOut();
        navigate('/login');
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
      } else if (err.response.status === 404) {
        navigate('/not-found')
      }  else if (err.response.status === 403) {
        navigate('/not-authorized');
      } else if (err.response.status === 401) {
        logOut();
        navigate('/login');
      } 
    }
  };

  const followButton = isFollowing ? 
  <button onClick={unfollowProfile} className='option-btn red-accent'>Unfollow</button> :
  <button onClick={followProfile} className='option-btn green-accent'>Follow</button>;

 
  return ( 
    <>
      {profile && <section className='profile'>
        <div className='profile-info'> 
        <img className='profile-pic' src={profile.profileImage}/>
        <p className='profile-name'>{profile.username}</p>
        </div> 

        <div className='profile-statistics'>
          <div className='followers'>
            <Link to={`/profile/${profileId}/followers`}>Followers</Link>
            <p className='follower-count'>{profile.followerCount}</p>
          </div>
          
          <div className='following'>
            <Link to={`/profile/${profileId}/following`}>Following</Link>
            <p className='following-count'>{profile.followingCount}</p>
          </div>
        </div>

        <div className='profile-options'>
          {isCurrentUser ? <Link to={`/profile/${profileId}/edit`}className={`secondary-${theme}-btn`}>Edit Profile</Link>: followButton}
        </div>

        <p className='biography'>{profile.biography}</p>
      </section>
    }
  </>
  )
}
