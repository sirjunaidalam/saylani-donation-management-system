import React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { auth } from "@/config/firebase-config";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Target,
  LogOut,
  Menu,
  HandCoins,
} from "lucide-react";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard size={20} />,
    },
    { name: "Campaigns", path: "/admin/campaigns", icon: <Target size={20} /> },
    {
      name: "Donations",
      path: "/admin/donations",
      icon: <HandCoins size={20} />,
    },
    { name: "Donors", path: "/admin/donors", icon: <Users size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-6 text-xl font-bold border-b border-slate-800">
          <div className="p-4 flex items-center gap-2 text-blue-600 font-bold text-xl">
            <img src="/logo.svg" alt="Logo" width={100} height={100} />
            <span>
              <h1 className="text-sm">
                SAYLANI DONATION <br />& ZAKAT MANAGMENT SYSTEM
              </h1>
            </span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Button
            variant="destructive"
            className="w-full justify-start gap-3"
            onClick={handleLogout}
          >
            <LogOut size={20} /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Menu className="md:hidden cursor-pointer" />
            <h1 className="font-semibold text-lg text-gray-700">
              Saylani Admin Console
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              A
            </div>
            <span className="text-sm font-medium text-gray-600 hidden sm:inline">
              Administrator
            </span>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
