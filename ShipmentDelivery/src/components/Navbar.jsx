import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import '../styles/Navbar.css'

// Hardcoded admin email for your admin user
const adminEmails = ["chetan333@gmail.com"];

const Navbar = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const isAdmin = user && adminEmails.includes(user.email);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">SmartShipment</Link>
      </div>
      <div className="navbar-right">
        {user ? (
          <>
            <Link to="/shipments">My Shipments</Link>
            <Link to="/new-shipment">New Shipment</Link>
            <Link to="/track">Track Shipment</Link>
            {isAdmin && <Link to="/admin">Admin Dashboard</Link>}
            <button onClick={logout} className="btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
