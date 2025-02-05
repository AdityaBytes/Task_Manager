import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav style={{ padding: "1rem", background: "#282c34", color: "#fff" }}>
      <Link to="/tasks" style={{ marginRight: "1rem", color: "#fff" }}>
        Tasks
      </Link>
      {isAuthenticated ? (
        <button onClick={handleLogout} style={{ color: "#fff" }}>
          Logout
        </button>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: "1rem", color: "#fff" }}>
            Login
          </Link>
          <Link to="/signup" style={{ color: "#fff" }}>
            Signup
          </Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;