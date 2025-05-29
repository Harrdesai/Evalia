{
  "title": "Longest Balanced Substring",
  "description": "Given a binary string s, return the length of the longest substring that has equal number of 0s and 1s. The substring must be contiguous.\n\nA balanced substring is defined as a contiguous sequence with the same number of 0s and 1s.",
  "difficulty": "MEDIUM",
  "tags": ["string", "prefix sum", "hash table"],
  "examples": {
      "PYTHON": {
          "input": "s = \"00110011\"",
          "output": 6,
          "explanation": "The longest balanced substring is \"001100\" or \"110011\"."
      },
      "JAVASCRIPT": {
          "input": "s = \"10101\"",
          "output": 4,
          "explanation": "The longest balanced substring is \"1010\" or \"0101\"."
      }
  },
  "constraints": "- 1 <= s.length <= 10^5\n- s[i] is either '0' or '1'",
  "hints": "Use a hash map to store prefix sums.\n\nMap 0 to -1 to calculate cumulative balance.\n\nThe longest substring with the same cumulative balance at two indices forms a balanced substring.",
  "editorial": "To solve this efficiently, use a prefix sum approach. Convert 0 to -1 and compute cumulative sums. Store the first index where each sum occurs. When the same sum reappears, the elements between these indices have a net sum of 0, meaning equal numbers of 1s and -1s (originally 0s). The length of the substring can then be computed as the difference between indices.",
  "testcases": [
      {
          "input": "100 200",
          "output": "300"
      },
      {
          "input": "-500 -600",
          "output": "-1100"
      },
      {
          "input": "0 0",
          "output": "0"
      }
  ],
  "codeSnippets": {
      "PYTHON": "def longest_balanced_substring(s: str) -> int:\n    balance_map = {0: -1}\n    balance = 0\n    max_len = 0\n\n    for i, char in enumerate(s):\n        balance += 1 if char == '1' else -1\n        if balance in balance_map:\n            max_len = max(max_len, i - balance_map[balance])\n        else:\n            balance_map[balance] = i\n\n    return max_len",
      "JAVASCRIPT":"function longestBalancedSubstring(s) {\n    const balanceMap = new Map();\n    balanceMap.set(0, -1);\n    let balance = 0;\n    let maxLen = 0;\n\n    for (let i = 0; i < s.length; i++) {\n        balance += s[i] === '1' ? 1 : -1;\n        if (balanceMap.has(balance)) {\n            maxLen = Math.max(maxLen, i - balanceMap.get(balance));\n        } else {\n            balanceMap.set(balance, i);\n        }\n    }\n\n    return maxLen;\n}"
  },
  "referenceSolutions": {
      "PYTHON": "def longest_balanced_substring(s: str) -> int:\n    balance_map = {0: -1}\n    balance = 0\n    max_len = 0\n\n    for i, char in enumerate(s):\n        balance += 1 if char == '1' else -1\n        if balance in balance_map:\n            max_len = max(max_len, i - balance_map[balance])\n        else:\n            balance_map[balance] = i\n\n    return max_len",
      "JAVASCRIPT": "function longestBalancedSubstring(s) {\n    const balanceMap = new Map();\n    balanceMap.set(0, -1);\n    let balance = 0;\n    let maxLen = 0;\n\n    for (let i = 0; i < s.length; i++) {\n        balance += s[i] === '1' ? 1 : -1;\n        if (balanceMap.has(balance)) {\n            maxLen = Math.max(maxLen, i - balanceMap.get(balance));\n        } else {\n            balanceMap.set(balance, i);\n        }\n    }\n\n    return maxLen;\n}"
  }
}


    const submission = await prisma.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: getLanguageName(language_id),
        stdin: JSON.stringify(stdin),
        stdout: JSON.stringify(detailedResults.map((result) => result.stdout)),
        stderr: JSON.stringify(detailedResults.map((result) => result.stderr)),
        compileOutput: JSON.stringify(detailedResults.map((result) => result.compile_output)),
        status: JSON.stringify(detailedResults.map((result) => result.status)),
        memory: JSON.stringify(detailedResults.map((result) => result.memory)),
        time: JSON.stringify(detailedResults.map((result) => result.time)),
      }
    })
