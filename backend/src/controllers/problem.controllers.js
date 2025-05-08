import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
// import { PrismaClient } from "../generated/prisma/index.js";
import { getJudge0LanguageId, submitBatch, pollBatchResults } from "../utils/judge0.utils.js";

// const prisma = new PrismaClient();

const createProblem = async (request, response) => {

  const { title, description, difficulty, tags, examples, constraints, hints, editorial, testcases, codeSnippets, referenceSolutions } = request.body

  try {



    if (!title || !description || !difficulty || !tags || !examples || !constraints || !testcases || !codeSnippets || !referenceSolutions) {

      throw new ApiError(400, "Missing fields")

    }

    if (request.user.role === "USER") {

      throw new ApiError(403, "You are not authorized to create problems")

    }

    for (const [language, SolutionCode] of Object.entries(referenceSolutions)) {

      const languageId = getJudge0LanguageId(language);

      if (!languageId) {

        throw new ApiError(400, `${language} language is not supported`)

      }

      const submissions = testcases.map(({ input, output }) => ({
        source_code: SolutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output
      }))

      const submissionResults = await submitBatch(submissions)

      const testcaseTokens = submissionResults.map(result => result.token)

      console.log("testcaseTokens", testcaseTokens)

      const results = await pollBatchResults(testcaseTokens)


      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log("Result-----", result);

        if (result.status.id !== 3) {
          return response.status(400).json(
            400, `Testcase ${i + 1} failed for ${language} language`
          )
        }
      }
    }

    const newProblem = await prisma.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        hints,
        editorial,
        testcases: {
          createMany: {
            data: testcases
          }
        },
        codeSnippets: {
          createMany: {
            data: codeSnippets
          }
        },
        referenceSolutions: {
          createMany: {
            data: referenceSolutions
          }
        },
        user: {
          connect: {
            id: request.user.id
          }
        }
      }
    });

    if (!newProblem) {
      throw new ApiError(500, "Error creating problem")
    }

    response.status(201).json(
      new ApiResponse(201, newProblem, "Problem created successfully")
    )

  } catch (error) {

    response.status(error.statusCode || 500).json(
      new ApiError(error.statusCode || 500, "Error creating problem", {
        error: error.message
      })
    )

  }

}

const getAllProblems = async (request, response) => {

}

const getProblemById = async (request, response) => {

}

const updateProblem = async (request, response) => {

}

const deleteProblem = async (request, response) => {

}

const getAllProblemsSolvedByUser = async (request, response) => {

}

export {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
  getAllProblemsSolvedByUser
}