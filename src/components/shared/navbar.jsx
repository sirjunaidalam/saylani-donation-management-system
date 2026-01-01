import { auth } from "@/config/firebase-config";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="border-b px-8 py-4 flex justify-between items-center bg-white sticky top-0 z-50">
      <span className="font-bold text-xl text-blue-700">Saylani Donation</span>
      <Button variant="ghost" onClick={handleLogout}>
        Logout
      </Button>
    </nav>
  );
};
