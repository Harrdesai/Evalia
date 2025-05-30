// src/pages/Profile.jsx

import React, { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  Mail,
  PencilIcon,
  TrashIcon,
  UserCircle2,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { usePlaylistStore } from "../store/usePlaylistStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";

const Profile = ({ userData }) => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { deletePlaylist } = usePlaylistStore();

  useEffect(() => {
    checkAuth();
  }, []);

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

  const { name, email, image, createdAt, solvedProblems, playlists } = authUser;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={image || ""} />
            <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">{name}</CardTitle>
            <p className="text-muted-foreground">{email}</p>
            <p className="text-sm text-muted-foreground">
              Joined on {format(new Date(createdAt), "PPP")}
            </p>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Solved Problems</CardTitle>
        </CardHeader>
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
            <TableHeader>
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
                  <TableCell>{playlist.name}</TableCell>
                  <TableCell className="text-end">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost">
                          <TrashIcon className="mr-2 h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you sure?</DialogTitle>
                          <DialogDescription>
                            This will permanently delete the playlist:{" "}
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
                            >
                              Confirm Delete
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
    </div>
  );
};

export default Profile;
