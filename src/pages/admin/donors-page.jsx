import { useEffect, useState } from "react";
import { db } from "@/config/firebase-config";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, UserCircle } from "lucide-react";

const ManageDonors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonorsAndLastDonations = async () => {
      try {
        // 1. Fetch only users where role is 'user'
        const userQuery = query(
          collection(db, "users"),
          where("role", "==", "user")
        );
        const userSnap = await getDocs(userQuery);
        const usersList = userSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // 2. Fetch all donations to find the latest for each user
        // (Alternatively, you could fetch these per user, but one big fetch is faster for small/medium lists)
        const donationSnap = await getDocs(
          query(collection(db, "donations"), orderBy("createdAt", "desc"))
        );
        const allDonations = donationSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // 3. Merge data
        const mergedData = usersList.map((user) => {
          const lastDonation = allDonations.find((d) => d.donorId === user.id);
          return {
            ...user,
            lastDonationAmount: lastDonation
              ? lastDonation.amount
              : "No donations yet",
            lastDonationDate: lastDonation ? lastDonation.createdAt : null,
          };
        });

        setDonors(mergedData);
      } catch (error) {
        console.error("Error fetching donors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonorsAndLastDonations();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Donor Management</h1>
        <p className="text-slate-500 text-sm">
          Review registered donors and their latest activity.
        </p>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Donor ID</TableHead>
              <TableHead>Name / Email</TableHead>
              <TableHead>Last Donation</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donors.map((donor) => (
              <TableRow key={donor.id}>
                <TableCell className="font-mono text-[10px] text-slate-400">
                  {donor.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <UserCircle className="text-slate-300" size={32} />
                    <div>
                      <div className="font-medium">{donor.name}</div>
                      <div className="text-xs text-slate-500">
                        {donor.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {donor.lastDonationAmount !== "No donations yet" ? (
                    <div>
                      <div className="font-bold text-blue-600">
                        Rs. {donor.lastDonationAmount.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {donor.lastDonationDate?.toDate().toLocaleDateString()}
                      </div>
                    </div>
                  ) : (
                    <span className="text-slate-400 text-xs italic">
                      No activity yet
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 border-blue-100"
                  >
                    Active Donor
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ManageDonors;
