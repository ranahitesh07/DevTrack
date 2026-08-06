import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const { logout } = useAuth();

  const navItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Projects",
      icon: FolderKanban,
      path: "/projects",
    },
    {
      name: "Tasks",
      icon: CheckSquare,
      path: "/tasks",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col bg-slate-950 text-white shadow-lg">
      {/* Logo */}
      <div className="border-b border-slate-800 px-6 py-6">
        <h1 className="text-3xl font-bold tracking-wide">
          DevTrack
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Developer Productivity Platform
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <Icon size={20} />
                <span className="font-medium">
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="border-t border-slate-800 p-4">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition-all duration-200 hover:bg-red-600 hover:text-white"
        >
          <LogOut size={20} />
          <span className="font-medium">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}