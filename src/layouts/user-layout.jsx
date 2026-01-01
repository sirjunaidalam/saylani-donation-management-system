import React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { auth } from "@/config/firebase-config";
import { Button } from "@/components/ui/button";
import { Home, LogOut, Menu, Heart, Target } from "lucide-react";

const UserLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
    { name: "Campaigns", path: "/campaigns", icon: <Target size={20} /> },
    { name: "My Donations", path: "/my-donations", icon: <Heart size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* User Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="p-4 flex items-center gap-2 text-blue-600 font-bold text-xl border-b">
          <img src="/logo.svg" alt="Logo" width={100} height={100} />
          <span>
            <h1 className="text-sm">
              SAYLANI DONATION <br />& ZAKAT MANAGMENT SYSTEM
            </h1>
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-md transition-all ${
                location.pathname === item.path
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut size={20} /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 md:hidden">
          <span className="font-bold text-blue-600">Saylani Care</span>
          <Menu size={24} />
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default UserLayout;
