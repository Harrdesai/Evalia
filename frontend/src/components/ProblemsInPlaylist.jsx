// src/components/ProblemTable.jsx

import React, { useState, useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useParams } from "react-router-dom";
import {
  Bookmark,
  PencilIcon,
  Trash,
  Plus,
  TrashIcon,
  PlusIcon,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import AddToPlaylistModal from "./AddToPlaylist";
import CreatePlaylistModal from "./CreatePlaylistModal";
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
import { usePlaylistStore } from "../store/usePlaylistStore";

const ProblemsInPlaylist = ({ problems }) => {
  const { authUser } = useAuthStore();
  const {
    removeProblemFromPlaylist,
    addProblemToPlaylist,
    playlists,
    isLoading,
  } = usePlaylistStore();
  const { playlistId } = useParams();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] =
    useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [setSelectedPlaylis, setSelectedPlaylist] = useState(null);

  // Extract all unique tags from problems
  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];
    const tagsSet = new Set();
    problems.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [problems]);

  // Define allowed difficulties
  const difficulties = ["EASY", "MEDIUM", "HARD"];

  // Filter problems based on search, difficulty, and tags
  const filteredProblems = useMemo(() => {
    return (problems || [])
      .filter((problem) =>
        problem.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter((problem) =>
        difficulty === "ALL" ? true : problem.difficulty === difficulty
      )
      .filter((problem) =>
        selectedTag === "ALL" ? true : problem.tags?.includes(selectedTag)
      );
  }, [problems, search, difficulty, selectedTag]);

  // Pagination logic
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const paginatedProblems = useMemo(() => {
    return filteredProblems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredProblems, currentPage]);

  const handleDelete = (problemId, playlistId) => {
    console.log(`problemID ${problemId} and playlistID ${playlistId}`);
    const problemIds = Array.isArray(problemId) ? problemId : [problemId];
    removeProblemFromPlaylist(playlistId, problemIds);
  };

  const PlaylistSchema = z.object({
    playlistId: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(PlaylistSchema),
    defaultValues: {
      playlistId: "",
    },
  });

  return (
    <div className="w-full max-w-6xl mx-auto mt-10">
      <h2 className="text-2xl text-amber-500 font-bold mb-4">
        Problems in playlist
      </h2>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4 ">
        <Input
          type="text"
          className="w-xs"
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select value={selectedTag} onValueChange={setSelectedTag}>
          <SelectTrigger className="w-xs">
            <SelectValue
              placeholder="Select tag"
              className="select bg-stone-200 rounded-full text-stone-700 text-base"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
            />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All Tags</SelectItem>
            {allTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-xs">
            <SelectValue
              placeholder="Select difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Difficulties</SelectItem>
            {difficulties.map((diff) => (
              <SelectItem key={diff} value={diff}>
                {diff.charAt(0).toUpperCase() + diff.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Solved</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="text-center">Tags</TableHead>
              <TableHead className="text-center">Difficulty</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProblems.length > 0 ? (
              paginatedProblems.map((problem) => {
                const onSubmit = async ({ playlistId }) => {
                  const problemIds = [problem.id];
                  await addProblemToPlaylist(playlistId, problemIds);
                  form.reset();
                };

                const isSolved = problem.solvedBy.some(
                  (user) => user.userId === authUser?.id
                );
                return (
                  <TableRow key={problem.id}>
                    <TableCell className="text-center">
                      <Checkbox
                        type="checkbox"
                        checked={isSolved}
                        readOnly
                        className="checkbox checkbox-sm"
                      />
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/problem/${problem.id}`}
                        className="hover:text-amber-500"
                      >
                        {problem.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      {problem.tags?.join(", ")}
                    </TableCell>
                    <TableCell className="text-center">
                      {problem.difficulty}
                    </TableCell>
                    <TableCell className="justify-items-center">
                      <div className="flex gap-4">
                        <Dialog className="w-full">
                          <DialogTrigger asChild>
                            <Button variant="ghost">
                              <PlusIcon className="mr-2 h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="mb-4">
                                Add Problem to Playlist
                              </DialogTitle>
                              <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                  <pre>
                                    {JSON.stringify(
                                      form.formState.errors,
                                      null,
                                      2
                                    )}
                                  </pre>
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
                                            console.log(
                                              "Selected playlist:",
                                              value
                                            );
                                          }}
                                          defaultValue={field.value}
                                        >
                                          <FormControl>
                                            <SelectTrigger>
                                              <SelectValue placeholder="Select a playlist" />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            {filteredPlaylists.map(
                                              (playlist) => (
                                                console.log(
                                                  "playlist",
                                                  playlist
                                                ),
                                                (
                                                  <SelectItem
                                                    key={playlist.id}
                                                    value={playlist.id}
                                                  >
                                                    {playlist.name}
                                                  </SelectItem>
                                                )
                                              )
                                            )}
                                          </SelectContent>
                                        </Select>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <DialogFooter className="flex justify-end gap-2 mt-6">
                                    <DialogClose asChild>
                                      <Button>Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={isLoading}>
                                      {isLoading ? (
                                        <Loader className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <Plus className="w-4 h-4" />
                                      )}
                                      Add to Playlist
                                    </Button>
                                  </DialogFooter>
                                </form>
                              </Form>
                              <DialogFooter>
                                <DialogClose></DialogClose>
                              </DialogFooter>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                        <Dialog className="w-full">
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              className="text-red-500 ml-4"
                            >
                              <TrashIcon className="mr-2 h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="mb-4">
                                Delete Problem from Playlist
                              </DialogTitle>
                              <DialogDescription className="text-center text-xl">
                                {`Are you sure you want to delete this problem from the playlist?`}
                              </DialogDescription>
                              <DialogDescription className="font-semibold text-xl mb-4 text-amber-500">
                                {problem.title}
                              </DialogDescription>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                  <Button
                                    onClick={() =>
                                      handleDelete(problem.id, playlistId)
                                    }
                                  >
                                    Delete
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5}>No problems found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex justify-center mt-6 gap-2">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            variant="ghost"
          >
            Prev
          </Button>
          <span className="btn btn-ghost btn-sm">
            {currentPage} / {totalPages}
          </span>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            variant="ghost"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Modals */}
      <AddToPlaylistModal
        isOpen={isAddToPlaylistModalOpen}
        onClose={() => setIsAddToPlaylistModalOpen(false)}
        problemId={selectedProblemId}
      />
    </div>
  );
};

export default ProblemsInPlaylist;
