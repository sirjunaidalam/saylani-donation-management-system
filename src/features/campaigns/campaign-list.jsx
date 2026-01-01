import { useEffect, useState } from "react";
import { campaignService } from "@/services/campaign-service";
import { CampaignCard } from "./campaign-card"; // The card we made earlier
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const CampaignList = ({ onAction, limit = null }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setLoading(true);
        let data = await campaignService.getAll();

        // If a limit is passed (e.g., for dashboard "Latest 3")
        if (limit) {
          data = data.slice(0, limit);
        }

        setCampaigns(data);
      } catch (err) {
        setError("Could not load campaigns. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();
  }, [limit]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm text-slate-500">Loading active causes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center p-12 border-2 border-dashed rounded-xl">
        <p className="text-slate-500 text-sm">
          No active campaigns found at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((camp) => (
        <CampaignCard key={camp.id} campaign={camp} onDonate={onAction} />
      ))}
    </div>
  );
};
