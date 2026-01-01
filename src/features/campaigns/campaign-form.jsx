import { db } from "@/config/firebase-config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; // Added serverTimestamp
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Ensure you have this shadcn component
import { toast } from "sonner";

export const CampaignForm = ({ onSuccess }) => {
  const handleCreateCampaign = async (e) => {
    e.preventDefault();

    // Extracting description along with other fields
    const { title, goal, deadline, description } = Object.fromEntries(
      new FormData(e.target)
    );

    try {
      await addDoc(collection(db, "campaigns"), {
        title,
        description, // Added to database object
        goalAmount: Number(goal),
        deadline: new Date(deadline),
        raisedAmount: 0,
        createdAt: serverTimestamp(), // Best practice for sorting lists
      });

      toast.success("Campaign Created!");
      e.target.reset();

      // If you pass a refresh function from the parent, call it here
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create campaign");
    }
  };

  return (
    <form
      onSubmit={handleCreateCampaign}
      className="space-y-4 p-6 bg-white border rounded-xl shadow-sm"
    >
      <h3 className="text-lg font-bold">Create New Campaign</h3>

      <div className="space-y-1">
        <Label htmlFor="title">Campaign Title</Label>
        <Input
          name="title"
          id="title"
          placeholder="e.g. Ramadan Relief"
          required
        />
      </div>

      {/* Added Description Field */}
      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Textarea
          name="description"
          id="description"
          placeholder="Describe the purpose of this campaign..."
          className="min-h-[100px]"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="goal">Goal Amount (Rs.)</Label>
          <Input
            name="goal"
            id="goal"
            type="number"
            placeholder="50000"
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="deadline">Deadline</Label>
          <Input name="deadline" id="deadline" type="date" required />
        </div>
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
        Launch Campaign
      </Button>
    </form>
  );
};
