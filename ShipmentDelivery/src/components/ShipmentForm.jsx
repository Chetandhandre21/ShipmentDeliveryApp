import React, { useState, useEffect } from "react";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useNavigate, useParams } from "react-router-dom";
import { loadRazorpay } from "../services/razorpay"; // Your Razorpay loader service

const ShipmentForm = () => {
  const [shipmentData, setShipmentData] = useState({
    sender: "",
    receiver: "",
    address: "",
    packageSize: "",
    shipmentType: "",
    deliverySpeed: "",
    insurance: false,
    estimatedCost: 0,
    status: "pending",
    paymentStatus: "pending",
  });
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode: shipment doc id

  useEffect(() => {
    if (id) {
      // Fetch shipment data for editing
      const fetchShipment = async () => {
        const docRef = doc(db, "shipments", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setShipmentData(docSnap.data());
          setIsEdit(true);
        }
      };
      fetchShipment();
    }
  }, [id]);

  // Calculate estimated cost dynamically (simple example)
  useEffect(() => {
    let cost = 0;
    if (shipmentData.packageSize === "small") cost += 50;
    else if (shipmentData.packageSize === "medium") cost += 100;
    else if (shipmentData.packageSize === "large") cost += 150;

    if (shipmentData.deliverySpeed === "express") cost *= 1.5;

    if (shipmentData.insurance) cost += 30;

    setShipmentData((prev) => ({ ...prev, estimatedCost: cost }));
  }, [shipmentData.packageSize, shipmentData.deliverySpeed, shipmentData.insurance]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShipmentData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePayment = async () => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: shipmentData.estimatedCost * 100, // in paise
      currency: "INR",
      name: "Shipment Delivery",
      description: "Shipment Payment",
      handler: async (response) => {
        alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
        // Save shipment with paymentStatus 'paid'
        await saveShipment("paid");
      },
      prefill: {
        email: "customer@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#f7b731",
      },
    };
    const rzpay = await loadRazorpay();
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const saveShipment = async (paymentStatus = "pending") => {
    try {
      if (isEdit) {
        const docRef = doc(db, "shipments", id);
        await updateDoc(docRef, { ...shipmentData, paymentStatus });
        alert("Shipment updated successfully");
      } else {
        await addDoc(collection(db, "shipments"), { ...shipmentData, paymentStatus });
        alert("Shipment created successfully");
      }
      navigate("/shipments");
    } catch (error) {
      alert("Error saving shipment: " + error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (shipmentData.estimatedCost > 0) {
      handlePayment();
    } else {
      alert("Please select package size and delivery speed.");
    }
  };

  return (
    <div className="shipment-form-container">
      <h2>{isEdit ? "Edit Shipment" : "Create New Shipment"}</h2>
      <form onSubmit={handleSubmit} className="shipment-form">
        <input
          type="text"
          name="sender"
          value={shipmentData.sender}
          onChange={handleChange}
          placeholder="Sender"
          required
        />
        <input
          type="text"
          name="receiver"
          value={shipmentData.receiver}
          onChange={handleChange}
          placeholder="Receiver"
          required
        />
        <input
          type="text"
          name="address"
          value={shipmentData.address}
          onChange={handleChange}
          placeholder="Delivery Address"
          required
        />

        <select name="packageSize" value={shipmentData.packageSize} onChange={handleChange} required>
          <option value="">Select Package Size</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>

        <select name="shipmentType" value={shipmentData.shipmentType} onChange={handleChange} required>
          <option value="">Select Shipment Type</option>
          <option value="documents">Documents</option>
          <option value="parcel">Parcel</option>
          <option value="fragile">Fragile</option>
        </select>

        <select name="deliverySpeed" value={shipmentData.deliverySpeed} onChange={handleChange} required>
          <option value="">Select Delivery Speed</option>
          <option value="standard">Standard</option>
          <option value="express">Express</option>
        </select>

        <label>
          <input
            type="checkbox"
            name="insurance"
            checked={shipmentData.insurance}
            onChange={handleChange}
          />
          Add Insurance (+₹30)
        </label>

        <p>
          <strong>Estimated Cost:</strong> ₹{shipmentData.estimatedCost}
        </p>

        <button type="submit">{isEdit ? "Update & Pay" : "Pay & Create Shipment"}</button>
      </form>
    </div>
  );
};

export default ShipmentForm;
