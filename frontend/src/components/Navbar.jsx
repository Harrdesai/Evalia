// src/components/Navbar.jsx

import { useEffect, useState } from "react";
import { User, Code, LogOut, User2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Button } from "./ui/button";
import { usePlaylistStore } from "../store/usePlaylistStore";
const Navbar = () => {
  const { authUser } = useAuthStore();
  const { playlists, getAllPlaylists, isLoading } = usePlaylistStore();
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [playlistsLoaded, setPlaylistsLoaded] = useState(false);

  useEffect(() => {
    if (dropdownOpen && !playlistsLoaded && !isLoading) {
      getAllPlaylists();
      setPlaylistsLoaded(true);
    }
  }, [dropdownOpen, playlistsLoaded, isLoading, getAllPlaylists]);

  const handleDropdownToggle = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <nav className="sticky top-0 z-50 w-full py-5">
      <div className="flex w-7xl justify-between bg-black/10 shadow-lg shadow-neutral-600/5 backdrop-blur-lg border border-gray-200/10 p-2 pl-8 rounded-full">
        {/* Logo Section */}
        <div>
          <Link to="/" className="flex items-center gap-3 cursor-pointer">
            <span className="text-lg md:text-3xl font-bold tracking-tight text-amber-500 hidden md:block">
              Evalia
            </span>
          </Link>
        </div>

        {authUser ? (
          <div className="flex items-center gap-3 cursor-pointer">
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger className="outline-none" asChild>
                <Button
                  variant="ghost"
                  className="text-amber-500"
                  onClick={handleDropdownToggle} // Toggle dropdown open/close
                >
                  Playlists
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {playlists.map((playlist) => (
                  <DropdownMenuItem
                    key={playlist.id}
                    onClick={() => setSelectedPlaylist(playlist)}
                  >
                    {/* bullet point */}
                    <Link to={`/playlist/${playlist.id}`}> {playlist.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : null}
        {/* User Profile and Dropdown */}
        <div className="flex items-center gap-8">
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none" asChild>
              <Avatar className="h-10 w-10">
                <AvatarImage src={authUser?.image || ""} />
                <AvatarFallback className="text-xl">
                  <User2 className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {authUser ? (
                <>
                  <DropdownMenuLabel className="w-42">
                    <Link to="/profile" className="flex items-center">
                      <User className="w-6 h-6 mr-2" />
                      {authUser.name}
                    </Link>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {authUser.role === "CLIENT" && (
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
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/login" className="flex items-center w-full">
                      <User2 className="w-6 h-6 mr-2" />
                      Login
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/register" className="flex items-center w-full">
                      <User2 className="w-6 h-6 mr-2" />
                      Register
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
