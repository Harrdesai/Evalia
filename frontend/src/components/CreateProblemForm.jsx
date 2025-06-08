// src/components/CreateProblemForm.jsx
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Code2, FileText, Lightbulb, BookOpen, CheckCircle2, Download, LoaderCircleIcon } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const problemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  testcases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      })
    )
    .min(1, "At least one test case is required"),
  examples: z.object({
    JAVASCRIPT: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    PYTHON: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    // JAVA: z.object({
    //   input: z.string().min(1, "Input is required"),
    //   output: z.string().min(1, "Output is required"),
    //   explanation: z.string().optional(),
    // }),
  }),
  codeSnippets: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript code snippet is required"),
    PYTHON: z.string().min(1, "Python code snippet is required"),
    // JAVA: z.string().min(1, "Java solution is required"),
  }),
  referenceSolutions: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript solution is required"),
    PYTHON: z.string().min(1, "Python solution is required"),
    // JAVA: z.string().min(1, "Java solution is required"),
  }),
  constraints: z.string().min(1, "Constraints are required"),
  hints: z.string().optional(),
  editorial: z.string().optional(),
});

const sampledpData = {
  title: "Climbing Stairs",
  category: "dp", // Dynamic Programming
  description:
    "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
  difficulty: "EASY",
  tags: ["Dynamic Programming", "Math", "Memoization"],
  constraints: "1 <= n <= 45",
  hints:
    "To reach the nth step, you can either come from the (n-1)th step or the (n-2)th step.",
  editorial:
    "This is a classic dynamic programming problem. The number of ways to reach the nth step is the sum of the number of ways to reach the (n-1)th step and the (n-2)th step, forming a Fibonacci-like sequence.",
  testcases: [
    {
      input: "2",
      output: "2",
    },
    {
      input: "3",
      output: "3",
    },
    {
      input: "4",
      output: "5",
    },
  ],
  examples: {
    JAVASCRIPT: {
      input: "n = 2",
      output: "2",
      explanation:
        "There are two ways to climb to the top:\n1. 1 step + 1 step\n2. 2 steps",
    },
    PYTHON: {
      input: "n = 3",
      output: "3",
      explanation:
        "There are three ways to climb to the top:\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step",
    },
    // JAVA: {
    //   input: "n = 4",
    //   output: "5",
    //   explanation:
    //     "There are five ways to climb to the top:\n1. 1 step + 1 step + 1 step + 1 step\n2. 1 step + 1 step + 2 steps\n3. 1 step + 2 steps + 1 step\n4. 2 steps + 1 step + 1 step\n5. 2 steps + 2 steps",
    // },
  },
  codeSnippets: {
    JAVASCRIPT: `/**
* @param {number} n
* @return {number}
*/
function climbStairs(n) {
// Write your code here
}

// Parse input and execute
const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: false
});

rl.on('line', (line) => {
const n = parseInt(line.trim());
const result = climbStairs(n);

console.log(result);
rl.close();
});`,
    PYTHON: `class Solution:
  def climbStairs(self, n: int) -> int:
      # Write your code here
      pass

# Input parsing
if __name__ == "__main__":
  import sys
  
  # Parse input
  n = int(sys.stdin.readline().strip())
  
  # Solve
  sol = Solution()
  result = sol.climbStairs(n)
  
  # Print result
  print(result)`,
    //     JAVA: `import java.util.Scanner;

    // class Main {
    //   public int climbStairs(int n) {
    //       // Write your code here
    //       return 0;
    //   }

    //   public static void main(String[] args) {
    //       Scanner scanner = new Scanner(System.in);
    //       int n = Integer.parseInt(scanner.nextLine().trim());

    //       // Use Main class instead of Solution
    //       Main main = new Main();
    //       int result = main.climbStairs(n);

    //       System.out.println(result);
    //       scanner.close();
    //   }
    // }`,
  },
  referenceSolutions: {
    JAVASCRIPT: `/**
* @param {number} n
* @return {number}
*/
function climbStairs(n) {
// Base cases
if (n <= 2) {
  return n;
}

// Dynamic programming approach
let dp = new Array(n + 1);
dp[1] = 1;
dp[2] = 2;

for (let i = 3; i <= n; i++) {
  dp[i] = dp[i - 1] + dp[i - 2];
}

return dp[n];

/* Alternative approach with O(1) space
let a = 1; // ways to climb 1 step
let b = 2; // ways to climb 2 steps

for (let i = 3; i <= n; i++) {
  let temp = a + b;
  a = b;
  b = temp;
}

return n === 1 ? a : b;
*/
}

// Parse input and execute
const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: false
});

rl.on('line', (line) => {
const n = parseInt(line.trim());
const result = climbStairs(n);

console.log(result);
rl.close();
});`,
    PYTHON: `class Solution:
  def climbStairs(self, n: int) -> int:
      # Base cases
      if n <= 2:
          return n
      
      # Dynamic programming approach
      dp = [0] * (n + 1)
      dp[1] = 1
      dp[2] = 2
      
      for i in range(3, n + 1):
          dp[i] = dp[i - 1] + dp[i - 2]
      
      return dp[n]
      
      # Alternative approach with O(1) space
      # a, b = 1, 2
      # 
      # for i in range(3, n + 1):
      #     a, b = b, a + b
      # 
      # return a if n == 1 else b

# Input parsing
if __name__ == "__main__":
  import sys
  
  # Parse input
  n = int(sys.stdin.readline().strip())
  
  # Solve
  sol = Solution()
  result = sol.climbStairs(n)
  
  # Print result
  print(result)`,
    //     JAVA: `import java.util.Scanner;

    // class Main {
    //   public int climbStairs(int n) {
    //       // Base cases
    //       if (n <= 2) {
    //           return n;
    //       }

    //       // Dynamic programming approach
    //       int[] dp = new int[n + 1];
    //       dp[1] = 1;
    //       dp[2] = 2;

    //       for (int i = 3; i <= n; i++) {
    //           dp[i] = dp[i - 1] + dp[i - 2];
    //       }

    //       return dp[n];

    //       /* Alternative approach with O(1) space
    //       int a = 1; // ways to climb 1 step
    //       int b = 2; // ways to climb 2 steps

    //       for (int i = 3; i <= n; i++) {
    //           int temp = a + b;
    //           a = b;
    //           b = temp;
    //       }

    //       return n == 1 ? a : b;
    //       */
    //   }

    //   public static void main(String[] args) {
    //       Scanner scanner = new Scanner(System.in);
    //       int n = Integer.parseInt(scanner.nextLine().trim());

    //       // Use Main class instead of Solution
    //       Main main = new Main();
    //       int result = main.climbStairs(n);

    //       System.out.println(result);
    //       scanner.close();
    //   }
    // }`,
  },
};

// Sample problem data for another type of question
const sampleStringProblem = {
  title: "Valid Palindrome",
  description:
    "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string s, return true if it is a palindrome, or false otherwise.",
  difficulty: "EASY",
  tags: ["String", "Two Pointers"],
  constraints:
    "1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.",
  hints:
    "Consider using two pointers, one from the start and one from the end, moving towards the center.",
  editorial:
    "We can use two pointers approach to check if the string is a palindrome. One pointer starts from the beginning and the other from the end, moving towards each other.",
  testcases: [
    {
      input: "A man, a plan, a canal: Panama",
      output: "true",
    },
    {
      input: "race a car",
      output: "false",
    },
    {
      input: " ",
      output: "true",
    },
  ],
  examples: {
    JAVASCRIPT: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.',
    },
    PYTHON: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.',
    },
    // JAVA: {
    //   input: 's = "A man, a plan, a canal: Panama"',
    //   output: "true",
    //   explanation: '"amanaplanacanalpanama" is a palindrome.',
    // },
  },
  codeSnippets: {
    JAVASCRIPT: `/**
   * @param {string} s
   * @return {boolean}
   */
  function isPalindrome(s) {
    // Write your code here
  }
  
  // Add readline for dynamic input handling
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  
  // Process input line
  rl.on('line', (line) => {
    // Call solution with the input string
    const result = isPalindrome(line);
    
    // Output the result
    console.log(result ? "true" : "false");
    rl.close();
  });`,
    PYTHON: `class Solution:
      def isPalindrome(self, s: str) -> bool:
          # Write your code here
          pass
  
  # Input parsing
  if __name__ == "__main__":
      import sys
      # Read the input string
      s = sys.stdin.readline().strip()
      
      # Call solution
      sol = Solution()
      result = sol.isPalindrome(s)
      
      # Output result
      print(str(result).lower())  # Convert True/False to lowercase true/false`,
    //     JAVA: `import java.util.Scanner;

    // public class Main {
    //     public static String preprocess(String s) {
    //         return s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    //     }

    //     public static boolean isPalindrome(String s) {

    //     }

    //     public static void main(String[] args) {
    //         Scanner sc = new Scanner(System.in);
    //         String input = sc.nextLine();

    //         boolean result = isPalindrome(input);
    //         System.out.println(result ? "true" : "false");
    //     }
    // }
    // `,
  },
  referenceSolutions: {
    JAVASCRIPT: `/**
   * @param {string} s
   * @return {boolean}
   */
  function isPalindrome(s) {
    // Convert to lowercase and remove non-alphanumeric characters
    s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Check if it's a palindrome
    let left = 0;
    let right = s.length - 1;
    
    while (left < right) {
      if (s[left] !== s[right]) {
        return false;
      }
      left++;
      right--;
    }
    
    return true;
  }
  
  // Add readline for dynamic input handling
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  
  // Process input line
  rl.on('line', (line) => {
    // Call solution with the input string
    const result = isPalindrome(line);
    
    // Output the result
    console.log(result ? "true" : "false");
    rl.close();
  });`,
    PYTHON: `class Solution:
      def isPalindrome(self, s: str) -> bool:
          # Convert to lowercase and keep only alphanumeric characters
          filtered_chars = [c.lower() for c in s if c.isalnum()]
          
          # Check if it's a palindrome
          return filtered_chars == filtered_chars[::-1]
  
  # Input parsing
  if __name__ == "__main__":
      import sys
      # Read the input string
      s = sys.stdin.readline().strip()
      
      # Call solution
      sol = Solution()
      result = sol.isPalindrome(s)
      
      # Output result
      print(str(result).lower())  # Convert True/False to lowercase true/false`,
    //     JAVA: `import java.util.Scanner;

    // public class Main {
    //     public static String preprocess(String s) {
    //         return s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    //     }

    //     public static boolean isPalindrome(String s) {
    //         s = preprocess(s);
    //         int left = 0, right = s.length() - 1;

    //         while (left < right) {
    //             if (s.charAt(left) != s.charAt(right)) return false;
    //             left++;
    //             right--;
    //         }

    //         return true;
    //     }

    //     public static void main(String[] args) {
    //         Scanner sc = new Scanner(System.in);
    //         String input = sc.nextLine();

    //         boolean result = isPalindrome(input);
    //         System.out.println(result ? "true" : "false");
    //     }
    // }
    // `,
  },
};

const CreateProblemForm = () => {
  const [sampleType, setSampleType] = useState("DP");
  const navigation = useNavigate();

  const form = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "EASY",
      tags: ["", ""],
      testcases: [{ input: "", output: "" }],
      constraints: "",
      hints: "",
      editorial: "",
      examples: {
        JAVASCRIPT: { input: "", output: "", explanation: "" },
        PYTHON: { input: "", output: "", explanation: "" },
        // JAVA: { input: "", output: "", explanation: "" },
      },
      // referenceSolutions
      codeSnippets: {
        JAVASCRIPT: "function solution() {\n  // Write your code here\n}",
        PYTHON: "def solution():\n    # Write your code here\n    pass",
        // JAVA: "public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
      },
      referenceSolutions: {
        JAVASCRIPT: "// Add your reference solution here",
        PYTHON: "# Add your reference solution here",
        // JAVA: "// Add your reference solution here",
      },
    },
  });

  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
    replace: replacetestcases,
  } = useFieldArray({
    control: form.control,
    name: "testcases",
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
    replace: replaceTags,
  } = useFieldArray({
    control: form.control,
    name: "tags",
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.post("/problems/create-problem", data);
      console.log(data);
      toast.success(res.data.message || "Problem Created successfully⚡");
      navigation("/");
    } catch (error) {
      console.log(error);
      toast.error("Error creating problem");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleData = () => {
    const sampleData = sampleType === "DP" ? sampledpData : sampleStringProblem;

    replaceTags(sampleData.tags.map((tag) => tag));
    replacetestcases(sampleData.testcases.map((tc) => tc));

    // Reset the form with sample data
    form.reset(sampleData);
  };

  return (
    <div className="flex flex-col w-screen items-center">
      <Card className="flex flex-col items-center justify-center w-4/5">
        <div className="flex flex-col w-full md:flex-row justify-between items-start md:items-center mb-6 md:mb-8border-b">
          <CardTitle className="flex justify-center items-center gap-2 text-2xl text-stone-600">
            <FileText className="w-6 h-6 md:w-8 md:h-8" />
            Create Problem
          </CardTitle>

          <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
            <div className="join">
              <Button
                variant="link"
                className={`${sampleType === "DP" ? "btn-active" : ""}`}
                onClick={() => setSampleType("array")}
              >
                DP Problem
              </Button>
              <Button
                variant="link"
                className={`${sampleType === "string" ? "btn-active" : ""}`}
                onClick={() => setSampleType("string")}
              >
                String Problem
              </Button>
            </div>
            <Button variant="link" className="gap-2" onClick={loadSampleData}>
              <Download className="w-4 h-4" />
              Load Sample
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full p-8"
          >
            {/* Basic Information */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter problem title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter problem description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-wrap gap-4">
                    <FormLabel>Difficulty</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="EASY">Easy</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HARD">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            {/* Tags Array usging useFieldArray */}
            <Card className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-4">
                <FormLabel>
                  <BookOpen className="w-5 h-5" />
                  Tags
                </FormLabel>
                <Button type="button" onClick={() => appendTag("")}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Tag
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 ml-4">
                {tagFields.map((tag, index) => (
                  <div key={tag.id} className="flex gap-2 m-2">
                    <FormField
                      control={form.control}
                      name={`tags.${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Enter problem tags"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      variant="ghost"
                      className="gap-2"
                      onClick={() => removeTag(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
            {/* test cases */}
            <Card className="flex flex-wrap flex-col gap-4">
              <div className="flex flex-wrap gap-4 ml-4">
                <FormLabel>Test Cases</FormLabel>
                <Button
                  onClick={() => appendTestCase({ input: "", output: "" })}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Test Case
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {testCaseFields.map((testCase, index) => (
                  <Card
                    key={testCase.id}
                    className="flex flex-wrap flex-row gap-2 m-2"
                  >
                    <FormField
                      control={form.control}
                      name={`testcases.${index}.input`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Input</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter problem test cases"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`testcases.${index}.output`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Output</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter problem test cases"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      variant="ghost"
                      className="gap-2"
                      onClick={() => removeTestCase(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Code Editor Sections */}
            <Card className="space-y-4 p-0 rounded-4xl">
              {["JAVASCRIPT", "PYTHON", "JAVA"].map((language) => (
                <Card key={language} className="border-0 bg-stone-100">
                  <CardTitle className="flex items-center pb-0">
                    <Code2 className="w-5 h-5" />
                    {language}
                  </CardTitle>

                  <Card className="bg-stone-200 p-0">
                    {/* Starter Code */}
                    <Card className="p-0">
                      <Card className="p-4 md:p-6">
                        <FormLabel>Starter Code Template</FormLabel>
                        <Card className="border overflow-hidden">
                          <Controller
                            name={`codeSnippets.${language}`}
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <Editor
                                  height="300px"
                                  language={language.toLowerCase()}
                                  value={field.value}
                                  onChange={field.onChange}
                                  options={{
                                    minimap: { enabled: false },
                                    fontSize: 18,
                                    lineNumbers: "on",
                                    roundedSelection: false,
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                  }}
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </Card>
                        {form.formState.errors.codeSnippets?.[language] && (
                          <div className="mt-2">
                            <span className="text-error text-sm">
                              {
                                form.formState.errors.codeSnippets[language]
                                  .message
                              }
                            </span>
                          </div>
                        )}
                      </Card>
                    </Card>

                    {/* Reference Solution */}
                    <Card className="p-0">
                      <Card className="p-4 md:p-6">
                        <FormLabel>
                          <CheckCircle2 className="w-5 h-5 text-success" />
                          Reference Solution
                        </FormLabel>
                        <Card className="border overflow-hidden">
                          <Controller
                            name={`referenceSolutions.${language}`}
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <Editor
                                  height="300px"
                                  language={language.toLowerCase()}
                                  value={field.value}
                                  onChange={field.onChange}
                                  options={{
                                    minimap: { enabled: false },
                                    fontSize: 18,
                                    lineNumbers: "on",
                                    roundedSelection: false,
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                  }}
                                />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </Card>
                        {form.formState.errors.referenceSolutions?.[
                          language
                        ] && (
                          <div className="mt-2">
                            <span className="text-error text-sm">
                              {
                                form.formState.errors.referenceSolutions[
                                  language
                                ].message
                              }
                            </span>
                          </div>
                        )}
                      </Card>
                    </Card>

                    {/* Examples */}
                    <Card className="p-4 md:p-6">
                      <FormLabel>Example</FormLabel>
                      <Card className="space-y-4">
                        <FormField
                          control={form.control}
                          name={`examples.${language}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input placeholder="Example title" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`examples.${language}.input`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Input</FormLabel>
                              <FormControl>
                                <Input placeholder="Example input" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`examples.${language}.output`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Output</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Example output"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`examples.${language}.explanation`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Explanation</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Example explanation"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </Card>
                    </Card>
                  </Card>
                </Card>
              ))}
            </Card>

            <CardTitle className="flex flex-wrap items-center gap-2">
              <Lightbulb className="w-5 h-5 text-warning" />
              Additional Details
            </CardTitle>
            <FormField
              control={form.control}
              name="constraints"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Constraints</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter problem constraints" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hints"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hints</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter problem hints" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="editorial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Editorial</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter problem editorial" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isLoading} type="submit">
              {isLoading && (
                <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Problem
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default CreateProblemForm;
