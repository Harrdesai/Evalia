import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { getLanguageName, pollBatchResults, submitBatch } from "../utils/judge0.utils.js";
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();
const executeCode = async (request, response) => {

  try {

    const { source_code, language_id, stdin, expected_outputs, problemId } = request.body;

    if (!source_code || !language_id || !stdin || !expected_outputs || !problemId) {
      throw new ApiError(400, "All fields are required");
    }

    const userId = request.user.id;

    // validate test cases

    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      stdin.length !== expected_outputs.length
    ) {
      throw new ApiError(400, "Invalid or missing test cases");
    }

    // prepare each test case for judge0 batch submission

    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    console.log(`Submissions:------------`, submissions);

    // send batch submission to judge0

    const submitResponse = await submitBatch(submissions);

    const tokens = submitResponse.map((response) => response.token);

    // poll batch results from judge0

    const results = await pollBatchResults(tokens);

    console.log(`Results:------------`, results);

    // Analyze test case results
    let allPassed = true;
    const detailedResults = results.map((result, index) => {
      const stdout = result.stdout.trim();
      const expected_output = expected_outputs[index].trim();
      const passed = stdout === expected_output;

      if (!passed) {
        allPassed = false;
      }

      return {
        testCase: index + 1,
        passed,
        stdout,
        expected: expected_output,
        stderr: result.stderr || null,
        compile_output: result.compile_output,
        status: result.status.description,
        memory: result.memory ? `${result.memory / 1024 } KB ` : undefined,
        time: result.time ? `${result.time} S` : undefined,
      }
    })

    console.log(`Detailed Results:------------`, detailedResults);

    if (!allPassed) {
      throw new ApiError(400, "Test cases failed");
    }

    response.status(200).json(
      new ApiResponse(200, { results: detailedResults, allPassed }, "Code executed successfully")
    )

  } catch (error) {

    response.status(error.statusCode || 500).json(
      new ApiError(error.statusCode || 500, "Error executing code", {
        error: error.message
      })
    )
  }

}

export { executeCode }










    // const submission = await prisma.submission.create({
    //   data: {
    //     userId,
    //     problemId,
    //     sourceCode: source_code,
    //     language: getLanguageName(language_id),
    //     stdin: stdin.join("\n"),
    //     stdout: JSON.stringify(detailedResults.map((result) => result.stdout)),
    //     stderr: detailedResults.some((result) => result.stderr) ? JSON.stringify(detailedResults.map((result) => result.stderr)) : null,
    //     compileOutput: detailedResults.some((result) => result.compile_output) ? JSON.stringify(detailedResults.map((result) => result.compile_output)) : null,
    //     status: allPassed ? "Accepted" : "Wrong Answer",
    //     memory: detailedResults.some((result) => result.memory) ? JSON.stringify(detailedResults.map((result) => result.memory)) : null,
    //     time: detailedResults.some((result) => result.time) ? JSON.stringify(detailedResults.map((result) => result.time)) : null,
    //   }
    // })

    // if (!submission) {
    //   throw new ApiError(500, "Error creating submission");
    // }

    // if (allPassed) {
    //   await prisma.problemSolved.upsert({
    //     where : {
    //       userId_problemId: {
    //         userId,
    //         problemId
    //       }
    //     },
    //     update: {},
    //     create: {
    //       userId,
    //       problemId
    //     }
    //   })
    // }

    // const testCaseResults = detailedResults.map((result) => ({
    //   submissionId: submission.id,
    //   testCase: result.testCase,
    //   passed: result.passed,
    //   stdout: result.stdout,
    //   expected: result.expected,
    //   stderr: result.stderr,
    //   compileOutput: result.compile_output,
    //   status: result.status,
    //   memory: result.memory,
    //   time: result.time,
    // }))

    // await prisma.testCaseResult.createMany({
    //   data: testCaseResults
    // })

    // const submissionWthTestCase = await prisma.submission.findUnique({
    //   where: {
    //     id: submission.id
    //   },
    //   include: {
    //     testCases: true
    //   }
    // })
