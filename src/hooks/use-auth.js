import { useState, useEffect } from "react";
import { auth, db } from "@/config/firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch the role from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        setUser({ ...firebaseUser, ...userDoc.data() });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { user, loading, isAdmin: user?.role === "admin" };
};
