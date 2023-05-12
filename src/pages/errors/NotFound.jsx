import { useEffect,useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { AuthContext } from '../../context/AuthProvider';

export default function NotFound() {
  const { loggedIn, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => { 
    if (!loggedIn) {
      logOut();
      navigate('/login');
    }
  }, [loggedIn]);
   
  return (
    <div className='error-page'>
      <h2>Error</h2>

      <p className='error-code'>404</p>

      <p>The resource you are looking for or trying to perform an action on doesn't seem to exist. Please return home</p>

      <Link className='return-btn' to='/'>Return Home</Link>
    </div>
  )
}
