import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";

const AdminRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (user) {
      const checkAdmin = async () => {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().role === "admin") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error checking admin role:", error);
          setIsAdmin(false);
        } finally {
          setChecking(false);
        }
      };
      checkAdmin();
    } else {
      setIsAdmin(false);
      setChecking(false);
    }
  }, [user]);

  if (loading || checking) return <p>Loading...</p>;

  if (!user) return <Navigate to="/login" />;

  if (!isAdmin) return <Navigate to="/" />;

  return children;
};

export default AdminRoute;
