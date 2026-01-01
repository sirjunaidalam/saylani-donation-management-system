import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { DonationTable } from "@/features/donations/donation-table";
import { CampaignForm } from "@/features/campaigns/campaign-form";
import ManageDonors from "./donors-page";
import ManageDonations from "./manage-donations-page";
import AdminCampaignsPage from "./campaigns-page";
import { donationService } from "@/services/donation-service";

const AdminDashboardPage = () => {
  const location = useLocation();

  // 1. STATE MUST BE AT THE TOP
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. FETCH FUNCTION
  const loadQuickData = async () => {
    try {
      const data = await donationService.getAll();
      // Only show the 5 most recent for the "Quick Verify" section
      setDonations(data.slice(0, 5));
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuickData();
  }, []);

  // 3. HANDLER FOR VERIFY
  const handleVerify = async (id) => {
    await donationService.verifyStatus(id);
    loadQuickData(); // Refresh the local list
  };

  // --- CONDITIONAL RENDERING ---

  if (location.pathname === "/admin/donations") {
    return <ManageDonations />;
  }

  if (location.pathname === "/admin/donors") {
    return <ManageDonors />;
  }

  if (location.pathname === "/admin/campaigns") {
    return <AdminCampaignsPage />;
  }

  // --- DEFAULT OVERVIEW ---
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h2 className="text-xl font-bold mb-4">Quick Verify (Recent)</h2>

        {/* 4. PASS PROPS TO THE TABLE */}
        <DonationTable
          donations={donations}
          variant="admin"
          onVerify={handleVerify}
        />

        {donations.length === 0 && !loading && (
          <p className="mt-4 text-slate-500 italic text-sm">
            No recent donations to verify.
          </p>
        )}
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold mb-4">Create Campaign</h2>
        <CampaignForm
          onSuccess={() => {
            /* Optional: redirect or refresh */
          }}
        />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
