import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeProvider";
import { AuthContext } from "../../context/AuthProvider";
import axios from "axios"; 

export default function Settings() {
  const { setUser, setLoggedIn } = useContext(AuthContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const toggleTheme = () => {

  };

  const logoutUser = async () => {
    try {
      const response = await axios.post('https://spice-scape-server.onrender.com/api/v1/auth/logout', {},
      {
        headers: { 
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
          'Content-Type': 'application/json',
          withCredentials: true
        }  
      }); 
      if (response.status === 200) {
        setLoggedIn(false);
        setUser({});
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        navigate('/login');
      } 
      console.log(response.status)
    } catch(err) {  
      console.log('Something went wrong.');
      console.log(err.response.data);
    } 
  };

  return (
    <main className="settings">
      <h1>Settings</h1>

      <div className="theme-setting">
        <p>Dark Mode</p>
        <p>{theme === 'dark' ? 'Enabled': 'Disabled'}</p>

      </div>
      <button className='logout-btn' onClick={logoutUser}>Log Out</button>
    </main>
  )
}
