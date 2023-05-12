import { Outlet, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { ThemeContext } from "../context/ThemeProvider";

export default function MainLayout() {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <header className={`home-header-${theme}`}>
          <h1 className="logo-text">SpiceScape</h1>
      </header>
      
      <Outlet />

      <nav className={`main-menu-${theme}`}>
        <NavLink to='/'><i className="fa-solid fa-house menu-icon"></i></NavLink>
        <NavLink to='/create-recipe'><i className="fa-solid fa-pen menu-icon"></i></NavLink>
        <NavLink to={`/profile/${user.userId}`}><i className="fa-solid fa-user menu-icon"></i></NavLink>
        <NavLink to={'/settings'}><i className="fa-solid fa-gear menu-icon"></i></NavLink>
      </nav>
    </>
  )
}
