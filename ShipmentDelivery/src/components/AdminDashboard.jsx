// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { getFirestore, collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getFirestore();
    const shipmentsRef = collection(db, "shipments");

    const unsubscribe = onSnapshot(shipmentsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setShipments(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    const db = getFirestore();
    if(window.confirm("Are you sure you want to delete this shipment?")) {
      await deleteDoc(doc(db, "shipments", id));
      alert("Shipment deleted");
    }
  };

  if (loading) return <p>Loading shipments...</p>;
  if (!shipments.length) return <p>No shipments available.</p>;

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard - All Shipments</h2>
      <table className="shipment-table">
        <thead>
          <tr>
            <th>Tracking #</th>
            <th>Sender</th>
            <th>Receiver</th>
            <th>Address</th>
            <th>Status</th>
            <th>Payment Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((shipment) => (
            <tr key={shipment.id}>
              <td>{shipment.trackingNumber || "N/A"}</td>
              <td>{shipment.sender}</td>
              <td>{shipment.receiver}</td>
              <td>{shipment.address}</td>
              <td>{shipment.status}</td>
              <td>{shipment.paymentStatus || "N/A"}</td>
              <td>
                <button onClick={() => handleDelete(shipment.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
