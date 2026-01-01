import { useEffect, useState } from "react";
import { DonationTable } from "@/features/donations/donation-table";
import { donationService } from "@/services/donation-service";
import { toast } from "sonner";

const ManageDonations = () => {
  const [data, setData] = useState([]);

  const loadAll = () => donationService.getAll().then(setData);

  useEffect(() => {
    loadAll();
  }, []);

  // manage-donations-page.jsx
  const handleVerifyAction = async (id) => {
    console.log("ID to be verified:", id); // Verify this is NOT undefined in console
    if (!id) return toast.error("Error: ID is missing");

    try {
      await donationService.verifyStatus(id);
      toast.success("Donation Verified Successfully");
      loadDonations(); // Refresh your list
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Manage All Donations</h1>
      <DonationTable
        donations={data}
        variant="admin"
        onVerify={handleVerifyAction}
      />
    </div>
  );
};
export default ManageDonations;
