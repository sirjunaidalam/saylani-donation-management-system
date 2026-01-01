import { useEffect, useState } from "react";
import { donationService } from "@/services/donation-service";
import { useAuth } from "@/hooks/use-auth";
import { UserDonationTable } from "@/features/donations/user-donation-table";

const MyDonations = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (user) donationService.getByUser(user.uid).then(setData);
  }, [user]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Donation History</h1>
      <UserDonationTable donations={data} variant="user" />
    </div>
  );
};
export default MyDonations;
