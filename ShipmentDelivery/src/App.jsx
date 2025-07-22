import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ShipmentForm from "./components/ShipmentForm";
import ShipmentList from "./components/ShipmentList";
import TrackingPage from "./components/TrackingPage";
import AdminDashboard from "./components/AdminDashboard";

import { auth } from "./services/firebase";

// Simple PrivateRoute for logged in users
const PrivateRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  if (loading) return <p>Loading...</p>;
  return user ? children : <Navigate to="/login" />;
};

// AdminRoute checks user is admin by email
const AdminRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const adminEmails = ["chetan333@gmail.com"]; // <-- Your admin email here
  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;
  if (!adminEmails.includes(user.email)) return <Navigate to="/" />;
  return children;
};

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/new-shipment"
        element={
          <PrivateRoute>
            <ShipmentForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/shipments"
        element={
          <PrivateRoute>
            <ShipmentList />
          </PrivateRoute>
        }
      />
      <Route
        path="/track"
        element={
          <PrivateRoute>
            <TrackingPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
    </Routes>
  </Router>
);

export default App;
