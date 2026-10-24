import type { StudyDocument, VideoExplanation } from '../types';

export const SAMPLE_DOCUMENTS: StudyDocument[] = [
  {
    id: 'doc-py-operators',
    title: 'Python Operators, Expressions & Evaluation',
    subject: 'CS101: Computer Programming',
    totalPages: 3,
    fileType: 'pdf',
    pages: [
      {
        pageNumber: 1,
        title: 'Arithmetic Operators and Division Nuances',
        content: `Chapter 3: Python Operators & Precedence

1. Arithmetic Operators Overview:
Python provides standard arithmetic operators: addition (+), subtraction (-), multiplication (*), division (/), floor division (//), modulus (%), and exponentiation (**).

2. The Critical Difference: True Division (/) vs Floor Division (//):
A common pitfall for BTech undergraduates is distinguishing between the single forward slash '/' and double forward slash '//'.
- The '/' operator performs float division (True Division). Regardless of the operand types (even if two integers are divided, such as 10 / 2), the result is always a floating-point number (5.0).
- The '//' operator performs floor division (Integer Division). It computes the quotient and rounds DOWN towards negative infinity to the nearest whole integer. For example, 7 // 2 returns 3, whereas -7 // 2 returns -4.

3. Modulus (%) Operator:
The '%' operator yields the remainder from the division of the first argument by the second. For positive integers, 7 % 2 = 1.
Formula relationship: a = (a // b) * b + (a % b).`,
        equations: ['a / b = Float Result', 'a // b = \\lfloor a/b \\rfloor', 'a = (a // b) \\times b + (a \\% b)'],
      },
      {
        pageNumber: 2,
        title: 'Operator Precedence and Associativity Rules',
        content: `PEMDAS and Python Expression Precedence:
When evaluating complex expressions, Python adheres to strict operator precedence:
1. Parentheses: () [Highest Precedence]
2. Exponentiation: ** (Right-to-left associativity: 2 ** 3 ** 2 = 2 ** 9 = 512, NOT 64)
3. Unary positive, negative, bitwise NOT: +x, -x, ~x
4. Multiplication, True Division, Floor Division, Modulus: *, /, //, % (Left-to-right)
5. Addition, Subtraction: +, - (Left-to-right)
6. Comparison Operators: <, <=, >, >=, ==, !=
7. Logical Operators: not, and, or [Lowest Precedence]

Example Problem:
Evaluate: 10 + 20 * 2 // 5 - 3
Step 1: Multiplication: 20 * 2 = 40
Step 2: Floor Division: 40 // 5 = 8
Step 3: Addition: 10 + 8 = 18
Step 4: Subtraction: 18 - 3 = 15. Final output is 15.`,
        equations: ['2 ** 3 ** 2 = 2 ** 9 = 512', '10 + (20 \\times 2 // 5) - 3 = 15'],
      },
      {
        pageNumber: 3,
        title: 'Bitwise Operators and Common Exam Pitfalls',
        content: `Bitwise Manipulation in Python:
Unlike boolean operators (and, or, not), bitwise operators manipulate numbers at the binary bit level.
- Bitwise AND (&): Sets each bit to 1 if both bits are 1.
- Bitwise OR (|): Sets each bit to 1 if one of two bits is 1.
- Bitwise XOR (^): Sets each bit to 1 if only one of two bits is 1. (5 ^ 3: 101 ^ 011 = 110 = 6).
- Bitwise Left Shift (<<): Shifts bits left, equivalent to multiplying by powers of 2.
- Bitwise Right Shift (>>): Shifts bits right, equivalent to integer division by powers of 2.

Exam Tip:
Remember that 'is' tests for object identity (memory address equality), while '==' tests for value equality. Never use 'is' for numerical comparison in Python!`,
        equations: ['x \\ll k \\equiv x \\times 2^k', 'x \\gg k \\equiv \\lfloor x / 2^k \\rfloor'],
      }
    ],
    flashcards: [
      {
        id: 'fc-1',
        category: 'Operators',
        front: 'What is the exact return type and value of 7 / 2 in Python 3?',
        back: 'Float: 3.5 (The single slash / is True Division, always yielding float).',
        pageReference: 1
      },
      {
        id: 'fc-2',
        category: 'Floor Division',
        front: 'What is the output of -7 // 2 in Python and why?',
        back: '-4. Floor division rounds down towards negative infinity (floor of -3.5 is -4).',
        pageReference: 1
      },
      {
        id: 'fc-3',
        category: 'Precedence',
        front: 'What is the associativity of the exponentiation operator (**) in Python?',
        back: 'Right-to-left. Therefore 2 ** 3 ** 2 evaluates as 2 ** (3 ** 2) = 2 ** 9 = 512.',
        pageReference: 2
      }
    ]
  },
  {
    id: 'doc-dsa-search',
    title: 'Data Structures: Binary Search & Complexity',
    subject: 'CS201: Data Structures & Algorithms',
    totalPages: 2,
    fileType: 'notes',
    pages: [
      {
        pageNumber: 1,
        title: 'Binary Search Algorithm & Invariants',
        content: `Binary Search on Sorted Arrays:
Binary Search is a divide-and-conquer search algorithm with logarithmic time complexity O(log N).

Prerequisite:
The array MUST be sorted monotonically in either ascending or descending order.

Algorithm Implementation:
1. Initialize pointers: left = 0, right = n - 1.
2. While left <= right:
   a. Compute mid = left + (right - left) // 2. (Note: Using this formula prevents 32-bit integer overflow instead of (left + right) // 2).
   b. If arr[mid] == target: return mid
   c. If arr[mid] < target: left = mid + 1
   d. If arr[mid] > target: right = mid - 1
3. If not found, return -1.`,
        equations: ['mid = left + \\lfloor (right - left) / 2 \\rfloor', 'T(n) = T(n/2) + O(1) \\implies O(\\log n)'],
      },
      {
        pageNumber: 2,
        title: 'Recurrence Relations and Master Theorem',
        content: `Time and Space Complexity Analysis:
Recurrence relation for Binary Search:
T(n) = T(n / 2) + c

Applying the Master Theorem:
a = 1, b = 2, f(n) = O(1).
log_b(a) = log_2(1) = 0.
Since f(n) = Theta(n^0) = Theta(1), this falls under Case 2 of the Master Theorem.
Hence, T(n) = Theta(log n).

Space Complexity:
- Iterative Binary Search: O(1) auxiliary space (constant extra space).
- Recursive Binary Search: O(log n) call stack space.`,
        equations: ['T(n) = T(n/2) + O(1)', '\\log_2(1) = 0 \\implies O(\\log n)'],
      }
    ],
    flashcards: [
      {
        id: 'fc-4',
        category: 'DSA',
        front: 'Why compute mid as left + (right - left) // 2 instead of (left + right) // 2?',
        back: 'To prevent potential 32-bit integer overflow when (left + right) exceeds INT_MAX.',
        pageReference: 1
      },
      {
        id: 'fc-5',
        category: 'Complexity',
        front: 'What is the auxiliary space complexity of iterative vs recursive binary search?',
        back: 'Iterative is O(1) space. Recursive is O(log n) space due to recursion call stack frames.',
        pageReference: 2
      }
    ]
  }
];

export const MOCK_VIDEOS: Record<string, VideoExplanation> = {
  'py-division': {
    videoId: 'k9TUPpGqYTo',
    title: 'Python / vs // Division Operator Explained in 2 Minutes',
    channel: 'Corey Schafer / Programming With Mosh',
    startTime: 45,
    endTime: 160,
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    keyPoints: [
      '`/` returns float even when integers divide evenly: 10 / 2 = 5.0',
      '`//` drops decimal and floors down: 7 // 2 = 3',
      'Negative floor division always moves towards negative infinity: -7 // 2 = -4'
    ],
    transcriptSnippet: 'At 0:45: "Let\'s look at division in Python. If we take 10 divided by 2 using single slash, Python 3 converts this to a float 5.0. But if you use double slash 10 // 2, it drops the remainder and returns the integer 5..."'
  },
  'binary-search': {
    videoId: 'MFhxShGxHWc',
    title: 'Binary Search Algorithm Visualized Step-by-Step',
    channel: 'CS Dojo / NeetCode',
    startTime: 72,
    endTime: 210,
    thumbnailUrl: 'https://images.unsplash.com/photo-1516116211227-bbc0c25a17a7?w=600&auto=format&fit=crop&q=80',
    keyPoints: [
      'Pointers move inward by half each iteration',
      'Calculation of mid prevents integer overflow',
      'Guaranteed O(log n) runtime vs O(n) linear scan'
    ],
    transcriptSnippet: 'At 1:12: "Notice how mid is computed. If target is greater than arr[mid], the entire left half is discarded in one single step. That\'s where the log N efficiency comes from..."'
  }
};
