// src/pages/Home.jsx
import React from 'react';
import '../styles/Home.css';
import deliveryCar from '../images/home.png';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-text">
        <h1>Welcome to Smart Shipment</h1>
        <p>
          Simplify your delivery management using intelligent AI-based tracking and fast logistics.
          Manage shipments, track orders, and stay updated — all from a single dashboard.
        </p>
        <button onClick={() => window.location.href = '/new-shipment'}>
          Get Started
        </button>
      </div>
      <div className="home-image-wrapper">
        <img src={deliveryCar} alt="Delivery Vehicle" className="home-image" />
      </div>
    </div>
  );
};

export default Home;
