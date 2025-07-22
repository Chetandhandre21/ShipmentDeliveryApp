import React, { useEffect, useState } from "react";
import '../styles/AdminDashboard.css'
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    const db = getFirestore();
    const shipmentsRef = collection(db, "shipments");

    const unsubscribe = onSnapshot(
      shipmentsRef,
      (snapshot) => {
        const shipmentsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setShipments(shipmentsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching shipments: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const startEditing = (shipment) => {
    setEditingId(shipment.id);
    setEditFormData({
      sender: shipment.sender || "",
      receiver: shipment.receiver || "",
      address: shipment.address || "",
      status: shipment.status || "pending",
      paymentStatus: shipment.paymentStatus || "pending",
      trackingNumber: shipment.trackingNumber || "",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const saveEdit = async (id) => {
    const db = getFirestore();
    const shipmentRef = doc(db, "shipments", id);

    try {
      await updateDoc(shipmentRef, editFormData);
      setEditingId(null);
      setEditFormData({});
      alert("Shipment updated successfully.");
    } catch (error) {
      alert("Failed to update shipment: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    const db = getFirestore();
    if (window.confirm("Are you sure you want to delete this shipment?")) {
      try {
        await deleteDoc(doc(db, "shipments", id));
        alert("Shipment deleted successfully.");
      } catch (error) {
        alert("Failed to delete shipment: " + error.message);
      }
    }
  };

  if (loading) return <p>Loading shipments...</p>;

  if (!shipments.length) return <p>No shipments available.</p>;

  return (
    <div className="admin-dashboard-container">
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
              {editingId === shipment.id ? (
                <>
                  <td>
                    <input
                      name="trackingNumber"
                      value={editFormData.trackingNumber}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      name="sender"
                      value={editFormData.sender}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      name="receiver"
                      value={editFormData.receiver}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <input
                      name="address"
                      value={editFormData.address}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    <select
                      name="status"
                      value={editFormData.status}
                      onChange={handleChange}
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <select
                      name="paymentStatus"
                      value={editFormData.paymentStatus}
                      onChange={handleChange}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => saveEdit(shipment.id)}>Save</button>
                    <button onClick={cancelEditing}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{shipment.trackingNumber || "N/A"}</td>
                  <td>{shipment.sender}</td>
                  <td>{shipment.receiver}</td>
                  <td>{shipment.address}</td>
                  <td>{shipment.status}</td>
                  <td>{shipment.paymentStatus || "N/A"}</td>
                  <td>
                    <button onClick={() => startEditing(shipment)}>Edit</button>
                    <button onClick={() => handleDelete(shipment.id)}>
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
