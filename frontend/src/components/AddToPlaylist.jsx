// src/components/AddToPlaylist.jsx

import React, { useEffect, useState } from "react";
import { X, Plus, Loader } from "lucide-react";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PlaylistSchema = z.object({
  playlistId: z.string(),
});

const AddToPlaylistModal = ({ isOpen, onClose, problemId }) => {
  const { playlists, getAllPlaylists, addProblemToPlaylist, isLoading } =
    usePlaylistStore();
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const form = useForm({
    resolver: zodResolver(PlaylistSchema),
    defaultValues: {
      playlistId: "",
    },
  });

  useEffect(() => {
    console.log("Modal mounted, isOpen:", isOpen);
    if (isOpen) {
      getAllPlaylists();
    }
  }, [isOpen]);

  const onSubmit = async ({ playlistId }) => {
    if (!playlistId || !problemId) return;

    console.log("playlistId", playlistId);
    await addProblemToPlaylist(playlistId, [problemId]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add to Playlist</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>
            <FormField
              control={form.control}
              name="playlistId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Playlist</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedPlaylist(value);
                      console.log("Selected playlist:", value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a playlist" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {playlists.map(
                        (playlist) => (
                          console.log("playlist", playlist),
                          (
                            <SelectItem key={playlist.id} value={playlist.id}>
                              {playlist.name}
                            </SelectItem>
                          )
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <DialogFooter className="flex justify-end gap-2 mt-6">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        onClick={onClose}
                        className="btn btn-ghost"
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      Add to Playlist
                    </Button>
                  </DialogFooter>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddToPlaylistModal;
