import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, ArrowRight } from "lucide-react";

export const CampaignCard = ({ campaign, onDonate }) => {
  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-300 border-slate-200">
      {/* Campaign Image */}
      <div className="relative h-48 w-full bg-slate-100">
        <img
          src={
            campaign.imageUrl ||
            "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1000"
          }
          alt={campaign.title}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-3 right-3 bg-blue-600">Active</Badge>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-slate-800 line-clamp-1">
          {campaign.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
          {campaign.description ||
            "Support this noble cause to help those in need across our community."}
        </p>
      </CardContent>

      <CardFooter className="border-t bg-slate-50/50 p-4">
        <Button
          onClick={() => onDonate(campaign.title)}
          className="w-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2 group"
        >
          <Target size={18} />
          Donate Now
          <ArrowRight
            size={16}
            className="ml-auto group-hover:translate-x-1 transition-transform"
          />
        </Button>
      </CardFooter>
    </Card>
  );
};
