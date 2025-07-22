import React, { useEffect, useState } from "react";
import { getFirestore, collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { auth } from "../services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "../styles/ShipmentList.css";

const ShipmentList = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user) return;

    const db = getFirestore();
    const shipmentsRef = collection(db, "shipments");

    const q = query(shipmentsRef, where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const shipmentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setShipments(shipmentsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const startEditing = (shipment) => {
    setEditingId(shipment.id);
    setEditFormData({
      sender: shipment.sender,
      receiver: shipment.receiver,
      address: shipment.address,
      status: shipment.status,
      paymentStatus: shipment.paymentStatus,
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

  if (loading) return <p>Loading shipments...</p>;

  if (!shipments.length) return <p>No shipments found.</p>;

  return (
    <div className="shipment-list-container">
      <h2>My Shipments</h2>
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

              {editingId === shipment.id ? (
                <>
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
                  <td>{shipment.sender}</td>
                  <td>{shipment.receiver}</td>
                  <td>{shipment.address}</td>
                  <td>{shipment.status}</td>
                  <td>{shipment.paymentStatus || "N/A"}</td>
                  <td>
                    <button onClick={() => startEditing(shipment)}>Edit</button>
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

export default ShipmentList;
