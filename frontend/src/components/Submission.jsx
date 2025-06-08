// src/components/Submission.jsx

import { CheckCircle2, XCircle, Clock, MemoryStick as Memory } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const SubmissionResults = ({ submission }) => {
  console.log(`submission in submission.js file`, submission);

  // Parse stringified arrays
const memoryArr = submission.results.map(tc =>  
  parseFloat(tc.memory?.replace(/[^\d.]/g, "") || "0")
);

const timeArr = submission.results.map(tc =>
  parseFloat(tc.time?.replace(/[^\d.]/g, "") || "0")
);

  // Calculate averages
  const avgMemory =
    memoryArr
      .map((m) => parseFloat(m)) // remove ' KB' using parseFloat
      .reduce((a, b) => a + b, 0) / memoryArr.length;

  const avgTime =
    timeArr
      .map((t) => parseFloat(t)) // remove ' s' using parseFloat
      .reduce((a, b) => a + b, 0) / timeArr.length;

  const passedTests = submission.results.filter((tc) => tc.passed).length;
  const totalTests = submission.results.length;
  const successRate = (passedTests / totalTests) * 100;

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card rounded-2xl bg-base-200 shadow-lg">
          <div className="card-body p-4">
            <h3 className="card-title text-sm">Status</h3>
            <div
              className={`text-lg font-bold ${
                submission.allPassed ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {submission.allPassed ? "Accepted" : "Rejected"}
            </div>
          </div>
        </div>

        <div className="card rounded-2xl bg-base-200 shadow-lg">
          <div className="card-body p-4">
            <h3 className="card-title text-sm">Success Rate</h3>
            <div className="text-lg font-bold">{successRate.toFixed(1)}%</div>
          </div>
        </div>

        <div className="card rounded-2xl bg-base-200 shadow-lg">
          <div className="card-body p-4">
            <h3 className="card-title text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Avg. Runtime
            </h3>
            <div className="text-lg font-bold">{avgTime.toFixed(3)} s</div>
          </div>
        </div>

        <div className="card rounded-2xl bg-base-200 shadow-lg">
          <div className="card-body p-4">
            <h3 className="card-title text-sm flex items-center gap-2">
              <Memory className="w-4 h-4" />
              Avg. Memory
            </h3>
            <div className="text-lg font-bold">{avgMemory.toFixed(0)} KB</div>
          </div>
        </div>
      </div>

      {/* Test Cases Results */}
      <div>
        <div className="card rounded-2xl bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-amber-500 font-bold ml-4 mb-4">Test Cases Results</h2>
            <div className="overflow-x-auto p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Expected Output</TableHead>
                    <TableHead className="text-center">Your Output</TableHead>
                    <TableHead className="text-center">Memory</TableHead>
                    <TableHead className="text-center">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submission.results.map((testCase) => (
                    <TableRow key={testCase.testCase}>
                      {console.log(`TestcaseID ------${testCase.id}`)}
                      <TableCell>
                        {testCase.passed ? (
                          <div className="flex items-center justify-center gap-2 text-emerald-600">
                            <CheckCircle2 className="w-5 h-5" />
                            Passed
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-rose-700">
                            <XCircle className="w-5 h-5" />
                            Failed
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center font-mono">{testCase.expected}</TableCell>
                      <TableCell className="text-center font-mono">{testCase.stdout || "null"}</TableCell>
                      <TableCell className="text-center">{parseFloat(testCase.memory?.replace(/[^\d.]/g, "") || "0").toFixed(4)}</TableCell>
                      <TableCell className="text-center">{testCase.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionResults;
