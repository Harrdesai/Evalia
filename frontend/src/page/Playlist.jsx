// src/page/Playlist.jsx

import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
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
import { Edit, TrashIcon } from "lucide-react";
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
import { Link, useParams } from "react-router-dom";
import ProblemsInPlaylist from "../components/ProblemsInPlaylist";
import UpdatePlaylistDetailModal from "../components/UpdatePlaylistDetailModal";

const Playlist = () => {
  const { playlistId } = useParams();
  const { getPlaylistDetails, currentPlaylist, isLoading, } = usePlaylistStore();
  const [isUpdatePlaylistDetailModalOpen, setIsUpdatePlaylistDetailModalOpen] =
    useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);

  useEffect(() => {
    if (playlistId) {
      getPlaylistDetails(playlistId);
    }
  }, [playlistId, getPlaylistDetails]);

  if (isLoading) {
    return <Skeleton />;
  }

  if (!currentPlaylist) {
    return <div>No playlist found</div>;
  }

  const { name, description, problems } = currentPlaylist;

  const handleUpdatePlaylistDetail = (playlistId) => {
    setSelectedPlaylistId(playlistId);
    setIsUpdatePlaylistDetailModalOpen(true);
  };


  return (
    <div className="w-6xl py-10 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between space-y-2">
            <CardTitle>{name}</CardTitle>
            <div className="flex items-center space-x-2">
              {/* <Button onClick={() => handleUpdatePlaylistDetail(playlistId)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button> */}
            </div>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {JSON.stringify(problems)}
          {problems.length > 0 ? (
            <ProblemsInPlaylist problems={problems} />
          ) : (
            <p className="mt-10 text-center text-lg font-semibold text-neutral-600 z-10 px-4 py-2 rounded-full">
              No problems found in this playlist.
            </p>
          )}
        </CardContent>
      </Card>
      {/* Modals */}
      {/* <UpdatePlaylistDetailModal
        isOpen={isUpdatePlaylistDetailModalOpen}
        onClose={() => setIsUpdatePlaylistDetailModalOpen(false)}
        playlistId={selectedPlaylistId}
      /> */}
    </div>
  );
};

export default Playlist;