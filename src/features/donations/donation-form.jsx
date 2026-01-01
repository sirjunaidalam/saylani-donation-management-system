import { useState, useEffect } from "react";
import { db } from "@/config/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { donationService } from "@/services/donation-service";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { printReceipt } from "@/utils/generate-receipt";

export const DonationForm = ({ defaultCampaign = "" }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  // Form States
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("General"); // Zakat, Sadqah, etc.
  const [category, setCategory] = useState("Food"); // Food, Education, etc.
  const [payment, setPayment] = useState("Online"); // Cash, Bank, Online
  const [selectedCampaign, setSelectedCampaign] = useState(
    defaultCampaign || "General Donation"
  );

  useEffect(() => {
    const fetchCampaigns = async () => {
      const snap = await getDocs(collection(db, "campaigns"));
      const list = snap.docs.map((doc) => doc.data().title);
      setCampaigns(list);
    };
    fetchCampaigns();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation
    if (!user?.uid)
      return toast.error("User session not found. Please re-login.");
    if (!amount || amount <= 0)
      return toast.error("Please enter a valid amount");
    if (!selectedCampaign) return toast.error("Please select a campaign");

    setLoading(true);

    try {
      // STEP A: Prepare the data object FIRST
      const donationData = {
        donorId: user.uid,
        donorName: user?.displayName || user?.name || "Anonymous Donor",
        amount: Number(amount),
        type: type || "General",
        category: category || "Food",
        payment: payment || "Online",
        campaign: selectedCampaign,
        status: "Pending",
      };

      // STEP B: Save to Firebase and get the REAL ID (docRef)
      const docRef = await donationService.create(donationData);

      // STEP C: Print the receipt using the data AND the real ID
      printReceipt({
        ...donationData,
        id: docRef.id, // The real ID from Firestore
        createdAt: new Date(), // Local date for the PDF
      });

      toast.success("Contribution Submitted Successfully!");
      setAmount("");
    } catch (error) {
      console.error("Submission Error Details:", error);
      toast.error("Failed to submit donation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-xl border shadow-sm"
    >
      {/* 1. Select Campaign */}
      <div className="space-y-1">
        <label className="text-xs font-bold uppercase text-gray-500">
          Relief Campaign
        </label>
        <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
          <SelectTrigger>
            <SelectValue placeholder="Select Campaign" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="General Donation">General Donation</SelectItem>
            {campaigns.map((camp, i) => (
              <SelectItem key={i} value={camp}>
                {camp}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* 2. Select Type */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-gray-500">
            Fund Type
          </label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Zakat">Zakat</SelectItem>
              <SelectItem value="Sadqah">Sadqah</SelectItem>
              <SelectItem value="Fitra">Fitra</SelectItem>
              <SelectItem value="General">General</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 3. Select Category */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-gray-500">
            Category
          </label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Food">Food</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Medical">Medical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* 4. Payment Method */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-gray-500">
            Payment
          </label>
          <Select value={payment} onValueChange={setPayment}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Online">Online</SelectItem>
              <SelectItem value="Bank">Bank Transfer</SelectItem>
              <SelectItem value="Cash">Cash</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 5. Amount */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-gray-500">
            Amount (Rs.)
          </label>
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Donate Now"}
      </Button>
    </form>
  );
};
