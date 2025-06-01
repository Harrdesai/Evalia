// src/components/Navbar.jsx

import React from "react";
import { User, Code, LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { authUser } = useAuthStore();

  console.log("AUTH_USER", authUser);

  return (
    <nav className="sticky top-0 z-50 w-full py-5">
      <div className="flex w-7xl justify-between bg-black/10 shadow-lg shadow-neutral-600/5 backdrop-blur-lg border border-gray-200/10 p-2 pl-8 rounded-full">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer">
          <span className="text-lg md:text-3xl font-bold tracking-tight text-amber-500 hidden md:block">
            Evalia
          </span>
        </Link>

        {/* User Profile and Dropdown */}
        <div className="flex items-center gap-8">
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none" asChild>
              <div className="w-10 rounded-full">
                <img
                  src={
                    authUser?.image ||
                    "https://avatar.iran.liara.run/public/boy"
                  }
                  alt="User Avatar"
                  className="object-cover"
                />
              </div>
              {/* <SelectValue placeholder="Theme" /> */}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="w-42">
                <Link to="/profile" className="flex items-center">
                  <User className="w-6 h-6 mr-2" />
                  {authUser?.name}
                </Link>
              </DropdownMenuItem>
              {authUser?.role === "CLIENT" && (
                <DropdownMenuItem>
                  <Link to="/add-problem" className="flex items-center">
                    <Code className="w-6 h-6 mr-2" />
                    Add Problem
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <LogoutButton>
                  <LogOut className="w-6 h-6 mr-2" />
                  Logout
                </LogoutButton>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
