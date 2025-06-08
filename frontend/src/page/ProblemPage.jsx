import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Play, FileText, Lightbulb, Bookmark, Share2, Clock, ChevronRight, BookOpen, Terminal, Code2, Users, ThumbsUp } from "lucide-react";
import { useParams } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import { getLanguageId } from "../lib/lang";
import { useExecutionStore } from "../store/useExecutionStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import Submission from "../components/Submission";
import SubmissionsList from "../components/SubmissionList";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ProblemPage = () => {
  const { id } = useParams();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();

  const {
    submission: submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
  } = useSubmissionStore();

  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("JAVASCRIPT");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testcases, setTestCases] = useState([]);

  const { executeCode, submitSolutionCode, submission, isExecuting } = useExecutionStore();

  useEffect(() => {
    getProblemById(id);
    getSubmissionCountForProblem(id);
  }, [id]);

  useEffect(() => {
    if (problem) {
      setCode(
        problem.codeSnippets?.createMany?.data?.[selectedLanguage] ||
          submission?.sourceCode ||
          ""
      );
      setTestCases(
        problem.testcases?.createMany?.data?.map((tc) => ({
          input: tc.input,
          output: tc.output,
        })) || []
      );
    }
  }, [problem, selectedLanguage]);

  useEffect(() => {
    if (activeTab === "submissions" && id) {
      getSubmissionForProblem(id);
    }
  }, [activeTab, id]);

  console.log("submission------------", submissions);
  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setCode(problem.codeSnippets?.createMany?.data?.[lang] || "");
  };

  const handleRunCode = (e) => {
    e.preventDefault();
    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testcases.createMany?.data?.map((tc) => tc.input);
      const expected_outputs = problem.testcases.createMany?.data?.map(
        (tc) => tc.output
      );
      executeCode(code, language_id, stdin, expected_outputs, id);
    } catch (error) {
      console.log("Error executing code", error);
    }
  };

  const handleSubmitCode = (e) => {
    e.preventDefault();
    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testcases.createMany?.data?.map((tc) => tc.input);
      const expected_outputs = problem.testcases.createMany?.data?.map(
        (tc) => tc.output
      );
      submitSolutionCode(code, language_id, stdin, expected_outputs, id);
      getSubmissionCountForProblem(id);
    } catch (error) {
      console.log("Error executing code", error);
    }
  };

  if (isProblemLoading || !problem) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-200">
        <div className="card bg-base-100 p-8 shadow-xl">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">Loading problem...</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="prose max-w-none">
            <p className="text-lg mb-6">{problem.description}</p>

            {problem.examples && (
              <>
                <h3 className="text-xl text-amber-500 font-bold pl-4">Examples:</h3>
                {Object.entries(problem.examples).map(
                  ([lang, example], idx) => (
                    <div
                      key={lang}
                      className="bg-base-200 p-6 rounded-xl font-mono"
                    >
                      <div className="mb-4">
                        <div className="text-stone-700 mb-2 text-base font-semibold">
                          Input:
                        </div>
                        <span className="bg-black/20 px-4 py-1 rounded-full font-semibold text-stone-700">
                          {example.input}
                        </span>
                      </div>
                      <div className="mb-4">
                        <div className="text-stone-700 mb-2 text-base font-semibold">
                          Output:
                        </div>
                        <span className="bg-black/20 px-4 py-1 rounded-full font-semibold text-stone-700">
                          {example.output}
                        </span>
                      </div>
                      {example.explanation && (
                        <div>
                          <div className="text-stone-700 mb-2 text-base font-semibold">
                            Explanation:
                          </div>
                          <span className="text-stone-700 bg-black/20 px-4 py-1 rounded-full text-lg">
                            {example.explanation}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                )}
              </>
            )}

            {problem.constraints && (
              <>
                <h3 className="text-xl text-amber-500 pl-4 font-bold">Constraints:</h3>
                <div className="bg-base-200 p-6 rounded-xl">
                  <span className="bg-black/20 px-4 py-1 rounded-full font-semibold text-stone-700">
                    {problem.constraints}
                  </span>
                </div>
              </>
            )}
          </div>
        );
      case "submissions":
        return (
          <SubmissionsList
            submissions={submissions}
            isLoading={isSubmissionsLoading}
          />
        );
      case "editorial":
        return (
          <div className="p-4">
            <div className="bg-base-200 p-6 rounded-xl">
              <span className=" px-4 py-1 rounded-lg font-semibold text-stone-700 text-lg">
                {problem.editorial}
              </span>
            </div>
          </div>
        );
      // case "discussions":
      //   return (
      //     <div className="p-4 text-center text-base-content/70">
      //       No discussions yet
      //     </div>
      //   );
      case "hints":
        return (
          <div className="p-4">
            {problem?.hints ? (
              <div className="bg-base-200 p-6 rounded-xl">
                <span className="px-4 py-1 rounded-lg font-semibold text-stone-700 text-lg">
                  {problem.hints}
                </span>
              </div>
            ) : (
              <div className="text-center text-base-content/70">
                No hints available
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-4/5">
      <nav className="shadow-lg px-4 flex rounded-3xl items-center justify-between p-2">
        <div className="flex flex-1/2 flex-col mb-2">
          <div className="mt-2">
            <h1 className="text-xl font-bold">{problem.title}</h1>
            <div className="flex items-center gap-2 text-sm text-base-content/70 mt-5">
              <Clock className="w-4 h-4" />
              <span>
                Updated{" "}
                {new Date(problem.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="text-base-content/30">•</span>
              <Users className="w-4 h-4" />
              <span>{submissionCount} Submissions</span>
              <span className="text-base-content/30">•</span>
              <ThumbsUp className="w-4 h-4" />
              <span>95% Success Rate</span>
            </div>
          </div>
        </div>
        <div className="flex flex-1/2 justify-end gap-4 items-center">
          {/* <Button
          variant="ghost"
            className={` ${
              isBookmarked ? "text-primary" : ""
            }`}
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
          >
            <Share2 className="w-5 h-5" />
          </Button> */}
          <div className="flex">
            <Select
              onValueChange={setSelectedLanguage}
            >
              <SelectTrigger>
                <SelectValue placeholder="JavaScript"/>
              </SelectTrigger>
              <SelectContent>
                {Object.keys(problem.codeSnippets.createMany.data || {}).map(
                  (lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() +
                        lang.slice(1).toLowerCase()}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="shadow-xl rounded-3xl">
            <div className="card-body p-0">
              <div className="tabs tabs-bordered">
                <Button
                  className={`gap-2 ${
                    activeTab === "description" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("description")}
                  variant="link"
                >
                  <FileText className="w-4 h-4" />
                  Description
                </Button>
                <Button
                  className={`tab gap-2 ${
                    activeTab === "submissions" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("submissions")}
                  variant="link"
                >
                  <Code2 className="w-4 h-4" />
                  Submissions
                </Button>
                {/* <Button
                  className={`tab gap-2 ${
                    activeTab === "discussion" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("discussion")}
                  variant="link"
                >
                  <MessageSquare className="w-4 h-4" />
                  Discussion
                </Button> */}
                <Button
                  className={`tab gap-2 ${
                    activeTab === "hints" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("hints")}
                  variant="link"
                >
                  <Lightbulb className="w-4 h-4" />
                  Hints
                </Button>
                <Button
                  className={`tab gap-2 ${
                    activeTab === "editorial" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("editorial")}
                  variant="link"
                >
                  <BookOpen className="w-4 h-4" />
                  Editorial
                </Button>
              </div>

              <div className="p-2">{renderTabContent()}</div>
            </div>
          </div>

          <div className="shadow-xl rounded-3xl">
            <div className="p-0">
              <div className="flex items-center gap-2 p-4">
                <Terminal className="w-4 h-4" />
                Code Editor
              </div>

              <div className="h-[600px] w-full bg-stone-100 p-2">
                <Editor
                  height="100%"
                  language={selectedLanguage.toLowerCase()}
                  theme="vs-light"
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 20,
                    lineNumbers: "on",
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    automaticLayout: true,
                  }}
                />
              </div>
              
              <div className="p-4 border-t border-base-300 bg-base-200">
                <div className="flex justify-between items-center">
                  <Button
                    className={`gap-2 ${
                      isExecuting ? "loading" : ""
                    }`}
                    onClick={handleRunCode}
                    disabled={isExecuting}
                  >
                    {!isExecuting && <Play className="w-4 h-4" />}
                    Run Code
                  </Button>
                  <Button className={`bg-emerald-500 hover:bg-emerald-600 text-white gap-2 ${
                      isExecuting ? "loading" : ""
                    }`}
                    onClick={handleSubmitCode}
                    disabled={isExecuting}
                  >
                    {!isExecuting && <Play className="w-4 h-4" />}
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl mt-6 rounded-3xl">
          <div className="card-body">
            {submission ? (
              <Submission submission={submission} />
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-amber-500 pl-4">Test Cases</h3>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center text-stone-700">Input</TableHead>
                        <TableHead className="text-center text-stone-700">
                          Expected Output
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testcases.map((testCase, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-center text-stone-700">
                            {testCase.input}
                          </TableCell>
                          <TableCell className="font-mono text-center text-stone-700">
                            {testCase.output}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
