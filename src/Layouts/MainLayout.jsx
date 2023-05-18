import { Outlet, NavLink, useNavigate } from "react-router-dom";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthProvider";
import { ThemeContext } from "../context/ThemeProvider";

export default function MainLayout() {
  const { user, loggedIn, setLoggedIn, logOut } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      setLoggedIn(true);
    } else {
      logOut();
      navigate("/login");
    }
  }, [localStorage.getItem("accessToken")]);

  return (
    <>
      {loggedIn && (
        <>
          <header className={`home-header-${theme}`}>
            <p className="logo-text">SpiceScape</p>
          </header>

          <Outlet />

          <nav className={`main-menu-${theme}`}>
            <NavLink to="/">
              <i className="fa-solid fa-house menu-icon"></i>
            </NavLink>
            <NavLink to="/create-recipe">
              <i className="fa-solid fa-pen menu-icon"></i>
            </NavLink>
            <NavLink to={`/profile/${user.userId}`}>
              <i className="fa-solid fa-user menu-icon"></i>
            </NavLink>
            <NavLink to={"/settings"}>
              <i className="fa-solid fa-gear menu-icon"></i>
            </NavLink>
          </nav>
        </>
      )}
    </>
  );
}
