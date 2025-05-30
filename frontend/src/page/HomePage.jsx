import React, { useEffect } from "react";

import { useProblemStore } from "../store/useProblemStore";
import { Loader } from "lucide-react";
import ProblemTable from "../components/ProblemTable";

const HomePage = () => {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();

  console.log(`problems at homepage`, problems);
  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  if (isProblemsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center mt-14 px-4">
      <h1 className="text-4xl font-extrabold z-10 text-center text-stone-400">
        Welcome to <span className="text-amber-500">Evalia</span>
      </h1>

      <p className="mt-4 text-center text-lg font-semibold text-neutral-600 z-10">
        Get access to top interview questions from leading IT companies, handpicked by expert recruiters.
      </p>

      {problems.length > 0 ? (
        <ProblemTable problems={problems} />
      ) : (
        <p className="mt-10 text-center text-lg font-semibold text-neutral-600 z-10 border border-primary px-4 py-2 rounded-md border-dashed">
          No problems found
        </p>
      )}
    </div>
  );
};

export default HomePage;
