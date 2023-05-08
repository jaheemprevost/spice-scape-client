import { useState, useEffect, createContext } from 'react';

export const AuthContext = createContext({});

export const AuthProvider = (props) => {
  const [user, setUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false); 
  

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
    <AuthContext.Provider value={{user, setUser, loggedIn, setLoggedIn}}>
      {props.children}
    </AuthContext.Provider>
  ); 
};
