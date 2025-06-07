
import React, { useEffect, useState } from "react";
import { X, Plus, Loader } from "lucide-react";
import { usePlaylistStore } from "../store/usePlaylistStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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


const CreatePlaylistModal = ({isOpen , onClose , onSubmit}) => {
  
const PlaylistSchema = z.object({
  name: z.string().min(1, { message: "Playlist name is required" }),
  description: z.string().min(1, { message: "Playlist description is required" })
});

  const { createPlaylist , isLoading } = usePlaylistStore();

  const form = useForm({
    resolver: zodResolver(PlaylistSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })
    const handleFormSubmit = async (data)=>{
        await createPlaylist(data)
        form.reset()
        onClose()
    }

    if(!isOpen) return null;

  return (
   <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Playlist</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Playlist Name</FormLabel>
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
                  <FormLabel>Playlist Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Create</Button>
              <Button onClick={onClose}>Cancel</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreatePlaylistModal