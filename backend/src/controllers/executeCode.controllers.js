import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { pollBatchResults, submitBatch } from "../utils/judge0.utils.js";

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

    response.status(200).json(
      new ApiResponse(200, results, "Code executed successfully")
    )

    // validate results

  } catch (error) {

    response.status(error.statusCode || 500).json(
      new ApiError(error.statusCode || 500, "Error executing code", {
        error: error.message
      })
    )
  }

}

export { executeCode }