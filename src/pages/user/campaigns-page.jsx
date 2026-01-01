import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { campaignService } from "@/services/campaign-service";
import { CampaignCard } from "@/features/campaigns/campaign-card";
import { Loader2, LayoutGrid } from "lucide-react";

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      const data = await campaignService.getAll();
      setCampaigns(data);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const handleDonateRedirect = (title) => {
    // Redirects to Dashboard where the form is, and pre-selects the campaign
    navigate("/dashboard", { state: { selectedCampaign: title } });
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-blue-600"></div>
        <h1 className="text-3xl font-bold text-slate-900">Active Campaigns</h1>
        <p className="text-slate-500 max-w-2xl">
          Browse through our current initiatives and contribute to the causes
          that matter most to you.
        </p>
      </div>

      {campaigns.length === 0 ? (
        <div className="p-20 text-center border-2 border-dashed rounded-2xl bg-slate-50">
          <p className="text-slate-400">
            No campaigns found. Check back later!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((camp) => (
            <CampaignCard
              key={camp.id}
              campaign={camp}
              onDonate={handleDonateRedirect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignsPage;
