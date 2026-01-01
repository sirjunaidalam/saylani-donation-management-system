import { useEffect, useState } from "react";
import { donationService } from "@/services/donation-service";
import { useAuth } from "@/hooks/use-auth";
import { printReceipt } from "@/utils/generate-receipt";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Printer, Calendar, Wallet, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const UserDonationTable = () => {
  const { user } = useAuth();
  const [list, setList] = useState([]);

  useEffect(() => {
    if (user?.uid) {
      donationService.getByUser(user.uid).then((data) => setList(data || []));
    }
  }, [user]);

  // Helper to format Firebase Timestamp safely
  const formatDate = (ts) => {
    if (!ts) return "Recent";
    const date = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
    return date.toLocaleDateString();
  };

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>Details</TableHead>
            <TableHead>Type & Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Receipt</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-8 text-slate-400"
              >
                No donations found in your history.
              </TableCell>
            </TableRow>
          ) : (
            list.map((d) => (
              <TableRow key={d.id} className="hover:bg-slate-50/50">
                <TableCell>
                  <div className="font-bold text-slate-900">{d.campaign}</div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase">
                    <Calendar size={10} /> {formatDate(d.createdAt)}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 h-4"
                      >
                        {d.type}
                      </Badge>
                      <span className="text-xs text-slate-600 font-medium">
                        {d.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Wallet size={10} /> {d.payment}
                    </div>
                  </div>
                </TableCell>

                <TableCell className="font-bold text-emerald-600">
                  Rs. {Number(d.amount).toLocaleString()}
                </TableCell>

                <TableCell>
                  <Badge
                    variant={d.status === "Verified" ? "success" : "outline"}
                    className={
                      d.status === "Verified"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "text-amber-600 border-amber-200"
                    }
                  >
                    {d.status}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => printReceipt(d)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Printer className="w-4 h-4 mr-2" /> Receipt
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
