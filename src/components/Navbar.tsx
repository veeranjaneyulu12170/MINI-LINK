import React from "react";
import { Link } from "../types";
import {
  LinkIcon,
  BarChart3,
  Settings,
  LogOut,
  Layout,
  Users,
  Star,
  Palette,
} from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  links: Link[];
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, links, onLogout }) => {
  return (
    <div className="fixed left-0 top-0  h-screen w-64 bg-indigo-700 text-white flex flex-col p-4 overflow-y-auto shadow-lg">
      {/* Logo */}
      <div className="flex items-center mb-8 mt-10">
        <LinkIcon className="h-6 w-6 mr-2" />
        <h1 className="text-xl font-bold">MiniLink</h1>
      </div>

      {/* Dashboard Section */}
      <div className="mb-4">
        <p className="text-indigo-200 text-sm mb-2">DASHBOARD</p>
        <button
          onClick={() => setActiveTab("links")}
          className={`w-full text-left py-2 px-3 rounded flex items-center ${
            activeTab === "links" ? "bg-indigo-800" : "hover:bg-indigo-600"
          }`}
        >
          <LinkIcon className="h-4 w-4 mr-2" />
          <span>Links</span>
          <span className="ml-auto bg-indigo-500 text-xs px-2 py-1 rounded-full">{links.length}</span>
        </button>

        <button
          onClick={() => setActiveTab("appearance")}
          className={`w-full text-left py-2 px-3 rounded flex items-center ${
            activeTab === "appearance" ? "bg-indigo-800" : "hover:bg-indigo-600"
          }`}
        >
          <Layout className="h-4 w-4 mr-2" />
          <span>Appearance</span>
        </button>

        <button
          onClick={() => setActiveTab("theme")}
          className={`w-full text-left py-2 px-3 rounded flex items-center ${
            activeTab === "theme" ? "bg-indigo-800" : "hover:bg-indigo-600"
          }`}
        >
          <Palette className="h-4 w-4 mr-2" />
          <span>Theme</span>
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`w-full text-left py-2 px-3 rounded flex items-center ${
            activeTab === "analytics" ? "bg-indigo-800" : "hover:bg-indigo-600"
          }`}
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          <span>Analytics</span>
        </button>
      </div>

      {/* Account Section */}
      <div className="mb-4">
        <p className="text-indigo-200 text-sm mb-2">ACCOUNT</p>
        <button
          onClick={() => setActiveTab("profile")}
          className={`w-full text-left py-2 px-3 rounded flex items-center ${
            activeTab === "profile" ? "bg-indigo-800" : "hover:bg-indigo-600"
          }`}
        >
          <Users className="h-4 w-4 mr-2" />
          <span>Profile</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`w-full text-left py-2 px-3 rounded flex items-center ${
            activeTab === "settings" ? "bg-indigo-800" : "hover:bg-indigo-600"
          }`}
        >
          <Settings className="h-4 w-4 mr-2" />
          <span>Settings</span>
        </button>

        <button
          onClick={() => setActiveTab("pro")}
          className={`w-full text-left py-2 px-3 rounded flex items-center ${
            activeTab === "pro" ? "bg-indigo-800" : "hover:bg-indigo-600"
          }`}
        >
          <Star className="h-4 w-4 mr-2" />
          <span>Upgrade to Pro</span>
        </button>
      </div>

      {/* Logout Button - Stays at the Bottom */}
      <div className="mt-auto">
        <button
          onClick={onLogout}
          className="w-full text-left py-2 px-3 rounded flex items-center hover:bg-indigo-600"
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
