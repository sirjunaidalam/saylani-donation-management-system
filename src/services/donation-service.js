import { db } from "@/config/firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  serverTimestamp,
  getDoc,
  increment, // Import increment for math
} from "firebase/firestore";

const donationCol = collection(db, "donations");

export const donationService = {
  create: async (donationData) => {
    // Ensure you 'return' the result of addDoc
    return await addDoc(donationCol, {
      ...donationData,
      createdAt: serverTimestamp(),
    });
  },

  getByUser: async (userId) => {
    if (!userId) return [];
    const q = query(donationCol, where("donorId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  getAll: async () => {
    const snapshot = await getDocs(donationCol);

    // 1. Fetch the data normally
    const donations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // 2. Sort locally: Latest (Newest) to Oldest
    return donations.sort((a, b) => {
      // Convert Firebase Timestamps or Date objects to milliseconds for comparison
      const dateA = a.createdAt?.seconds
        ? a.createdAt.seconds * 1000
        : new Date(a.createdAt).getTime();
      const dateB = b.createdAt?.seconds
        ? b.createdAt.seconds * 1000
        : new Date(b.createdAt).getTime();

      return dateB - dateA; // Sort descending (Newest first)
    });
  },

  // FIXED: Update status AND update campaign total
  verifyStatus: async (donationId) => {
    console.log("Attempting to verify donation with ID:", donationId);
    try {
      // 1. Reference and get the donation data
      const donationRef = doc(db, "donations", donationId);
      const donationSnap = await getDoc(donationRef);

      if (!donationSnap.exists()) throw new Error("Donation not found");
      const donationData = donationSnap.data();

      // 2. Mark the donation as Verified
      await updateDoc(donationRef, { status: "Verified" });

      // 3. Update the Campaign's raisedAmount
      // Find the campaign where the title matches the donation's campaign title
      const campaignQuery = query(
        collection(db, "campaigns"),
        where("title", "==", donationData.campaign)
      );

      const campaignSnap = await getDocs(campaignQuery);

      if (!campaignSnap.empty) {
        // Get the first matching campaign document
        const campaignDoc = campaignSnap.docs[0];
        const campaignRef = doc(db, "campaigns", campaignDoc.id);

        // Atomically increase the raisedAmount by the donation amount
        await updateDoc(campaignRef, {
          raisedAmount: increment(Number(donationData.amount)),
        });
      }

      return true;
    } catch (error) {
      console.error("Verification failed:", error);
      throw error;
    }
  },
};
