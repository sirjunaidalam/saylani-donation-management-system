import { useEffect, useState } from "react";
import { campaignService } from "@/services/campaign-service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar, Target, TrendingUp } from "lucide-react";

const ManageCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);

  const loadCampaigns = async () => {
    const data = await campaignService.getAll();
    setCampaigns(data);
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Active Campaigns</h1>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[180px]">Campaign</TableHead>
              <TableHead>Goal</TableHead>
              {/* <TableHead>Received</TableHead>
              <TableHead>Progress</TableHead> */}
              <TableHead>Deadline</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-slate-400 italic"
                >
                  No campaigns launched yet.
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map((c) => {
                // Calculate percentage for the progress bar
                const goal = Number(c.goalAmount) || 0;
                const raised = Number(c.raisedAmount) || 0;
                const percentage =
                  goal > 0
                    ? Math.min(Math.round((raised / goal) * 100), 100)
                    : 0;

                return (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="font-bold text-slate-900">{c.title}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[150px]">
                        {c.description}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-blue-600">
                        <Target size={14} />
                        Rs. {goal.toLocaleString()}
                      </div>
                    </TableCell>

                    {/* <TableCell>
                      <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                        <TrendingUp size={14} />
                        Rs. {raised.toLocaleString()}
                      </div>
                    </TableCell>

                    <TableCell className="w-[160px]">
                      <div className="flex flex-col gap-1">
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-medium text-slate-500">
                          {percentage}% Reached
                        </span>
                      </div>
                    </TableCell> */}

                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <Calendar size={14} />
                        {c.deadline instanceof Object && c.deadline.seconds
                          ? new Date(
                              c.deadline.seconds * 1000
                            ).toLocaleDateString()
                          : String(c.deadline)}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          campaignService.delete(c.id).then(loadCampaigns)
                        }
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ManageCampaigns;
