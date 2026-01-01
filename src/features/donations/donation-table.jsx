import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileDown, CheckCircle2, Clock, Info } from "lucide-react";

export const DonationTable = ({
  donations = [],
  variant = "user",
  onVerify,
}) => {
  // Helper to format date safely (fixing the Firebase Object error)
  const formatDate = (date) => {
    if (!date) return "N/A";
    if (date.seconds) return new Date(date.seconds * 1000).toLocaleDateString();
    return String(date);
  };

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="font-bold">Campaign & Date</TableHead>
            <TableHead className="font-bold">Amount</TableHead>
            {/* New "Categories" Column */}
            <TableHead className="font-bold hidden md:table-cell">
              Type & Category
            </TableHead>
            <TableHead className="font-bold">Status</TableHead>
            <TableHead className="text-right font-bold">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donations.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-10 text-slate-400 italic"
              >
                No donations found.
              </TableCell>
            </TableRow>
          ) : (
            donations.map((item) => (
              <TableRow
                key={item.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <TableCell>
                  <div className="font-bold text-slate-900">
                    {variant === "admin" ? item.donorName : item.campaign}
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-tight">
                    {formatDate(item.createdAt)}{" "}
                    {variant === "admin" ? `• ${item.campaign}` : ""}
                  </div>
                </TableCell>

                <TableCell className="font-bold text-emerald-600">
                  Rs. {Number(item.amount).toLocaleString()}
                </TableCell>

                {/* Displaying the categories from the form */}
                <TableCell className="hidden md:table-cell">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-xs">
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1 py-0 font-normal"
                      >
                        {item.type}
                      </Badge>
                      <span className="text-slate-400">for</span>
                      <span className="font-medium text-slate-600">
                        {item.category}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Via: {item.payment}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  {item.status === "Verified" ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">
                      Verified
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-amber-600 bg-amber-50 border-amber-200"
                    >
                      Pending
                    </Badge>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  {variant === "user" ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={item.status !== "Verified"}
                      className="h-8 text-blue-600 hover:text-blue-700"
                    >
                      <FileDown size={16} className="mr-1" /> Receipt
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      disabled={item.status === "Verified"}
                      onClick={() => onVerify(item.id)}
                      className="h-8 bg-blue-600"
                    >
                      Verify
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
