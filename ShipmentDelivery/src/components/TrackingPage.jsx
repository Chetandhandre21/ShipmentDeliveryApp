import React, { useState } from 'react';
import { db } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import '../styles/TrackingPage.css';

const TrackingPage = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipment, setShipment] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = async () => {
    try {
      const q = query(
        collection(db, 'shipments'),
        where('trackingNumber', '==', trackingNumber)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setShipment(null);
        setError('No shipment found with this tracking number.');
      } else {
        querySnapshot.forEach((doc) => {
          setShipment(doc.data());
        });
        setError('');
      }
    } catch (err) {
      console.error('Error tracking shipment:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="tracking-page">
      <h2>Track Your Shipment</h2>
      <div className="tracking-input">
        <input
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="Enter Tracking Number"
        />
        <button onClick={handleTrack}>Track</button>
      </div>

      {error && <p className="error">{error}</p>}

      {shipment && (
        <div className="shipment-details">
          <h3>Shipment Details</h3>
          <p><strong>Tracking Number:</strong> {trackingNumber}</p>
          <p><strong>Sender:</strong> {shipment.sender}</p>
          <p><strong>Receiver:</strong> {shipment.receiver}</p>
          <p><strong>Delivery Address:</strong> {shipment.address}</p>
          <p><strong>Shipment Type:</strong> {shipment.shipmentType}</p>
          <p><strong>Package Size:</strong> {shipment.packageSize}</p>
          <p><strong>Delivery Speed:</strong> {shipment.deliverySpeed}</p>
          <p><strong>Insurance:</strong> {shipment.insurance ? 'Yes' : 'No'}</p>
          <p><strong>Status:</strong> {shipment.status}</p>
          <p><strong>Payment Status:</strong> {shipment.paymentStatus}</p>
          <p><strong>Estimated Cost:</strong> ₹{shipment.estimatedCost}</p>
        </div>
      )}
    </div>
  );
};

export default TrackingPage;
