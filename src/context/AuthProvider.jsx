import { useState, useEffect, createContext } from 'react';
export const AuthContext = createContext({});

export const AuthProvider = (props) => {
  const [user, setUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false); 

  const logIn = (data) => {
    setLoggedIn(true);
    setUser(data.user);
    localStorage.setItem('accessToken', data.accessToken); 
    localStorage.setItem('user', JSON.stringify(data.user)); 
    localStorage.setItem('theme', 'light');
  }

  const logOut = () => {
    setLoggedIn(false);
    setUser({});
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('theme');
  };

  useEffect(() => { 
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user'); 

    if (token) {
      setLoggedIn(true);
    }

    if (user) {
      setUser(JSON.parse(user));
    }
  }, [])

  return (
    <AuthContext.Provider value={{user, loggedIn, setLoggedIn, logIn, logOut}}>
      {props.children}
    </AuthContext.Provider>
  ); 
};
