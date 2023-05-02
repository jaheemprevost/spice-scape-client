import { useState, useEffect, createContext } from 'react';

export const AuthContext = createContext({});

export const AuthProvider = (props) => {
  const [user, setUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false); 
  

  useEffect(() => { 
    const token = localStorage.getItem('accessToken');

    if (token) {
      setLoggedIn(true);
    }
  }, [])

  return (
    <AuthContext.Provider value={{user, setUser, loggedIn, setLoggedIn}}>
      {props.children}
    </AuthContext.Provider>
  ); 
};
