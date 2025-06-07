// src/pages/Profile.jsx

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, TrashIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from "@/components/ui/dialog";
import UpdatePlaylistDetailModal from "../components/UpdatePlaylistDetailModal";
import { Link } from "react-router-dom";

const Profile = ({ userData }) => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { deletePlaylist, getAllPlaylists, playlists } = usePlaylistStore();

  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
    
  const [isUpdatePlaylistDetailModalOpen, setIsUpdatePlaylistDetailModalOpen] =useState(false);

  const { name, email, image, createdAt, solvedProblems } = authUser;

  useEffect(() => {
    checkAuth();
    getAllPlaylists();
  }, []);

  console.log(`playlists from profile`, playlists);
  const handleUpdatePlaylistDetail = (playlistId) => {
    setSelectedPlaylistId(playlistId);
    setIsUpdatePlaylistDetailModalOpen(true);
  };

  if (isCheckingAuth) {
    return (
      <div className="p-8">
        <Skeleton className="h-12 w-48 mb-4" />
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="text-center mt-10 text-red-500">
        User not authenticated
      </div>
    );
  }

  return (
    <div className="w-6xl py-10 space-y-6">
      <Card>
        <CardHeader className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={image || ""} />
            <AvatarFallback className="text-2xl">
              {name?.split(" ").map((part) => part.charAt(0).toUpperCase()).slice(0, 2).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">{name}</CardTitle>
            <p className="text-muted-foreground">{email}</p>
            <p className="text-sm text-muted-foreground">
              Joined on {format(new Date(createdAt), "PPP")}
            </p>
          </div>
        </CardHeader>
        <CardDescription />
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Solved Problems</CardTitle>
        </CardHeader>
        <CardDescription />
        <CardContent>
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-stone-700 font-semibold">
                    Problem
                  </TableHead>
                  <TableHead className="text-center text-stone-700 font-semibold">
                    Difficulty
                  </TableHead>
                  <TableHead className="text-center text-stone-700 font-semibold">
                    Tags
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {solvedProblems.map(({ problem }) => (
                  <TableRow key={problem.id}>
                    <TableCell className="text-stone-700">
                      {problem.title}
                    </TableCell>
                    <TableCell className="text-center text-stone-700">
                      {problem.difficulty}
                    </TableCell>
                    <TableCell className="text-center text-stone-700">
                      {problem.tags.join(", ")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Playlists</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="text-xl">
              <TableRow>
                <TableHead className="text-stone-700 font-semibold">
                  Title
                </TableHead>
                <TableHead className="text-end text-stone-700 font-semibold">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {playlists.map((playlist) => (
                <TableRow key={playlist.id}>
                  <TableCell>
                    <Link
                      to={`/playlist/${playlist.id}`}
                      className="hover:text-amber-500"
                    >
                      {playlist.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-end">
                    <Button
                      onClick={() => handleUpdatePlaylistDetail(playlist.id)}
                      variant="ghost"
                      size="xs"
                    >
                      <Edit className="text-amber-500" />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" className="text-red-500 ml-4">
                          <TrashIcon className="mr-2 h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you sure?</DialogTitle>
                          <DialogDescription>
                            This will permanently delete the playlist:{" /n"}
                            <strong>{playlist.name}</strong>
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button
                              variant="destructive"
                              onClick={() => deletePlaylist(playlist.id)}
                              className="ml-2"
                            >
                              Delete
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modals */}
      <UpdatePlaylistDetailModal
        isOpen={isUpdatePlaylistDetailModalOpen}
        onClose={() => setIsUpdatePlaylistDetailModalOpen(false)}
        playlistId={selectedPlaylistId}
      />
    </div>
  );
};

export default Profile;