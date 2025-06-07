// src/components/ProblemTable.jsx

import React, { useState, useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Bookmark, PencilIcon, Trash, Plus } from "lucide-react";
import { useActions } from "../store/useAction";
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
import { Checkbox } from "@/components/ui/checkbox";
import AddToPlaylistModal from "./AddToPlaylist";
import CreatePlaylistModal from "./CreatePlaylistModal";

const ProblemsTable = ({ problems }) => {
  const { authUser } = useAuthStore();
  const { onDeleteProblem } = useActions();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] =
    useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);

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

  const handleDelete = (id) => {
    onDeleteProblem(id);
  };

  const handleCreatePlaylist = async (data) => {
    await createPlaylist(data);
  };

  const handleAddToPlaylist = (problemId) => {
    console.log(`problemID ${problemId}`);
    setSelectedProblemId(problemId);
    setIsAddToPlaylistModalOpen(true);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-10">
      {/* Header with Create Playlist Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl text-stone-400 font-bold">Problems</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-6 h-6" />
          Create Playlist
        </Button>
      </div>
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
                        <Button
                          onClick={() => handleAddToPlaylist(problem.id)}
                          variant="ghost"
                          size="xs"
                        >
                          <Bookmark className="text-amber-500 fill-amber-500" />
                        </Button>
                        {authUser?.role === "CLIENT" && (
                          <div className="flex gap-4">
                            <Button
                              onClick={() => handleDelete(problem.id)}
                              variant="ghost"
                              size="xs"
                            >
                              <Trash className=" text-amber-500 " />
                            </Button>
                            <Button disabled variant="ghost" size="xs">
                              <PencilIcon className=" text-amber-500" />
                            </Button>
                          </div>
                        )}
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
      <CreatePlaylistModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlaylist}
      />

      <AddToPlaylistModal
        isOpen={isAddToPlaylistModalOpen}
        onClose={() => setIsAddToPlaylistModalOpen(false)}
        problemId={selectedProblemId}
      />
    </div>
  );
};

export default ProblemsTable;