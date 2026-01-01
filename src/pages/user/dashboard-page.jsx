import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/config/firebase-config";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { DonationForm } from "@/features/donations/donation-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Wallet, Sparkles } from "lucide-react";

const UserDashboardPage = () => {
  const { user } = useAuth();
  const [totalAmount, setTotalAmount] = useState(0);
  const [latestCampaign, setLatestCampaign] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.uid) return;

      // 1. Fetch Total
      const q = query(
        collection(db, "donations"),
        where("donorId", "==", user.uid)
      );
      const snap = await getDocs(q);
      let sum = 0;
      snap.forEach((doc) => (sum += Number(doc.data().amount || 0)));
      setTotalAmount(sum);

      // 2. Fetch Latest Campaign for the "Quick Donate" context
      const campQ = query(
        collection(db, "campaigns"),
        orderBy("createdAt", "desc"),
        limit(1)
      );
      const campSnap = await getDocs(campQ);
      if (!campSnap.empty) {
        setLatestCampaign(campSnap.docs[0].data().title);
      }
    };
    fetchDashboardData();
  }, [user]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Top Stats Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Assalam-o-Alaikum, {user?.name}
          </h1>
          <p className="text-gray-500">
            Your total contribution:{" "}
            <span className="font-bold text-blue-600 underline">
              Rs. {totalAmount.toLocaleString()}
            </span>
          </p>
        </div>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-3 px-6 flex items-center gap-3">
            <Wallet className="text-blue-600" />
            <div>
              <p className="text-xs text-blue-600 font-bold uppercase">
                Ready to Help
              </p>
              <p className="text-sm text-blue-800">Your impact is growing!</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: The Donation Form (Primary Action) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-yellow-500 fill-yellow-500" size={20} />
            <h2 className="text-xl font-bold">Quick Donation</h2>
          </div>
          <DonationForm defaultCampaign={latestCampaign} />
        </div>

        {/* RIGHT: Visual Content / Instructions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden h-full min-h-[300px] flex flex-col justify-center">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4 italic">
                "The best of people are those that bring most benefit to the
                rest of mankind."
              </h2>
              <p className="text-slate-400 max-w-md">
                Use the form on the left to contribute to active relief funds.
                Your receipt will be generated automatically once verified by
                our team.
              </p>
            </div>
            {/* Decorative Background Element */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
