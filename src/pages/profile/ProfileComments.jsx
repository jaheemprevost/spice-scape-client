import {useState, useEffect, useContext} from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AuthContext }  from '../../context/AuthProvider';
import axiosInstance from '../../services/axios'; 

export default function ProfileComments() {
  const { logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const { profileId } = useParams();
  const [profileComments, setProfileComments] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfileComments = async () => {
      try {
        const response = await axiosInstance.get(`/profile/${profileId}/comments`); 

        const {comments, message} = response.data ?? {};

        if (comments) {
          setProfileComments(comments);
        } else if (message) {
          setMessage(message);
        }

      } catch(err) {
        if (err.response.status === 401) {
          logOut();
          navigate('/login');
        } else if (err.response.status === 500) {
          navigate('/something-wrong');
        }
      }
    }
    
    fetchProfileComments();
  }, []);

  const commentElements = profileComments && profileComments.map(comment => { 
    const {
      text,
      commentId,
      parentPost,
      userInfo: {
        username,
        profileImage, 
      }
    } = comment; 

    return (
      <div key={commentId} className='user-comment'> 
        <Link to={`/recipes/${parentPost}`}>
          <div className='user-info'> 
            <img src={profileImage} className='user-image' alt='' />
            <p className='user-name'>{username}</p>
          </div>

          <p>{text}</p>
        </Link>
      </div>
      ); 
  });

  return (
    <>  
      <div className='user-comments'>
        {profileComments ? commentElements : message}
      </div>
    </>
  )
}
