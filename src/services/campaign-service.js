import { db } from "@/config/firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc, // <--- ADD THIS IMPORT
  serverTimestamp,
} from "firebase/firestore";

const campaignCol = collection(db, "campaigns");

export const campaignService = {
  // 1. Fetch all campaigns
  getAll: async () => {
    try {
      const q = collection(db, "campaigns");
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      return [];
    }
  },

  // 2. Create a campaign (The missing piece)
  create: async (data) => {
    try {
      return await addDoc(campaignCol, {
        ...data,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error creating campaign:", error);
      throw error;
    }
  },

  // 3. Delete a campaign
  delete: async (id) => {
    try {
      const campaignRef = doc(db, "campaigns", id);
      return await deleteDoc(campaignRef);
    } catch (error) {
      console.error("Error deleting campaign:", error);
      throw error;
    }
  },
};
