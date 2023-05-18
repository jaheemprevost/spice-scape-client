import { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";

export default function SomethingWrong() {
  const { loggedIn, setLoggedIn, logOut } = useContext(AuthContext);
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
    <div className="error-page">
      <h2>Error</h2>

      <p className="error-code">404</p>

      <p>Something went wrong. Please return home and try again.</p>

      <Link className="return-btn" to="/">
        Return Home
      </Link>
    </div>
  );
}
