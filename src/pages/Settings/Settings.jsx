import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeProvider";
import { AuthContext } from "../../context/AuthProvider"; 
import axiosInstance from '../../services/axios';

export default function Settings() {
  const { loggedIn, logOut } = useContext(AuthContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  if (!loggedIn) {
    logOut();
    navigate('/login');
  }

  const toggleTheme = () => { 
    if (theme === 'light') {
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
    } else if (theme === 'dark') {
      setTheme('light');
      localStorage.setItem('theme', 'light');
    }
  };

  const deleteProfile = async () => {
    try {

      const response = await axiosInstance.delete(`profile/${user.userId}`); 
      
      logOut();
    } catch(err) {
       if (err.response.status === 401) { 
        logOut();
        navigate('/login');
       } else if (err.response.status === 403) {
        navigate('/not-authorized');
       } else if (err.response.status === 500) {
        navigate('/something-wrong');
      } 
    }
  } 

  return (
    <main className="settings">
      <h1>Settings</h1>

      <div className="theme-setting">
        <p>Dark Mode</p>
        
        {theme === 'dark' ? <p className='enabled' onClick={toggleTheme}>Enabled</p> 
        : <p className='disabled' onClick={toggleTheme}>Disabled</p>}

      </div>
      <button className='delete-profile' onClick={deleteProfile}>Delete Profile</button>
      <button className={`logout-${theme}-btn`} onClick={logOut}>Log Out</button>
    </main>
  )
}
