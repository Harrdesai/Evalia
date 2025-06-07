// src/components/UpdatePlaylistDetailModal.jsx

import { useEffect } from "react";
import { Loader } from "lucide-react";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const PlaylistSchema = z.object({
  name: z.string(),
  description: z.string(),
});

const UpdatePlaylistDetailModal = ({ isOpen, onClose, playlistId}) => {
  const { updatePlaylistDetail, currentPlaylist, getPlaylistDetails, isLoading } = usePlaylistStore();

  
  useEffect(() => {
    if (isOpen) {
      getPlaylistDetails(playlistId);
    }
  }, [isOpen]);
  
  
  const form = useForm({
    resolver: zodResolver(PlaylistSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (currentPlaylist) {
      form.reset ({ 
        name: currentPlaylist.name,
        description: currentPlaylist.description 
      });
    }
  }, [currentPlaylist]);

  const onSubmit = async ( data ) => {
    if (!data) return;

    {
    await updatePlaylistDetail(playlistId, data);
    onClose(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-stone-700">Update Playlist Details</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex justify-end gap-2 mt-6">
              <DialogClose asChild>
                <Button
                  onClick={onClose}
                  variant="outline"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  "Update"
                )
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePlaylistDetailModal;