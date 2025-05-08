import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config({
  path: './.env'
})
const getJudge0LanguageId = (language) => {
  const languageMap = {
    "PYTHON": 71,
    "JAVASCRIPT": 63
  }

  return languageMap[language.toUpperCase()]
}

const submitBatch = async(submissions) => {
  
  const {data} = await axios.post(`${process.env.JUDGE0_API_URL}submissions/batch?base64_encoded=false`, {submissions})

  console.log(`Submission Results:`, data)

  return data // [{token}, {token}]

}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))


const pollBatchResults = async(tokens) => {
  while(true) {
    const {data} = await axios.get(`${process.env.JUDGE0_API_URL}submissions/batch`, {params: {
      tokens: tokens.join(','),
      base64_encoded: false
    }})

    console.log(`Batch Results:`, data)
    
    const results = data.submissions;

    const isAllDone = results.every((result) => result.status.id !== 1 && result.status.id !== 2)

    if(isAllDone) return results
    await sleep(1000)

  }
}

export { getJudge0LanguageId, submitBatch, pollBatchResults }