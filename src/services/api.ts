
import { toast } from "@/hooks/use-toast";

// Base URL for API
const API_URL = "https://api.example.com"; // Replace with your actual API URL

// Type for EvaluationRubric
export interface EvaluationRubric {
  criterion: string;
  weight: number;
}

// Type for SyllabusMapping
export interface SyllabusMapping {
  subject?: string;
  topic?: string;
  subtopic?: string;
  difficulty?: string;
}

// Type for an option in a MCQ
export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

// Teacher type
export interface Teacher {
  id: string;
  name: string;
}

// Question type
export interface Question {
  id: string;
  questionType: ("SINGLE_CORRECT_MCQ" | "MULTIPLE_CORRECT_MCQ" | "SUBJECTIVE")[];
  question: string;
  explanation?: string;
  options?: Option[];
  createdBy: Teacher;
  source?: "AI_GENERATED" | "USER_GENERATED";
  difficulty?: "EASY" | "MEDIUM" | "HARD";
  tags?: string[];
  evaluationRubric?: EvaluationRubric[];
  syllabusMapping?: SyllabusMapping;
  images?: string[];
  childQuestions?: Question[];
}

// Mock data and functions for testing
let loggedInTeacher: Teacher = {
  id: "teacher-123",
  name: "John Doe"
};

// Login function
export async function login(email: string, password: string): Promise<Teacher> {
  // Mock login logic
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password) {
        resolve(loggedInTeacher);
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 500);
  });
}

// Logout function
export function logout() {
  // Mock logout logic
  toast({
    title: "Logged out",
    description: "You have been logged out successfully."
  });
}

// Get logged in teacher
export async function getLoggedInTeacher(): Promise<Teacher> {
  // Mock getting logged in teacher
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(loggedInTeacher);
    }, 200);
  });
}

// Create an MCQ question
export async function createMCQQuestion(questionData: Partial<Question>): Promise<Question> {
  // Mock creating MCQ question
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `question-${Date.now()}`,
        ...questionData,
      } as Question);
    }, 500);
  });
}

// Create a subjective question
export async function createSubjectiveQuestion(questionData: Partial<Question>): Promise<Question> {
  // Mock creating subjective question
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `question-${Date.now()}`,
        ...questionData,
      } as Question);
    }, 500);
  });
}

// Upload image function
export async function uploadImage(file: File): Promise<string> {
  // Mock image upload
  return new Promise((resolve) => {
    setTimeout(() => {
      const imageUrl = `https://example.com/images/${file.name}`;
      resolve(imageUrl);
    }, 1000);
  });
}

// Get questions
export async function getQuestions(): Promise<Question[]> {
  // Mock getting questions
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "question-1",
          questionType: ["SINGLE_CORRECT_MCQ"],
          question: "What is React?",
          options: [
            { id: "opt-1", text: "A JavaScript library", isCorrect: true },
            { id: "opt-2", text: "A programming language", isCorrect: false },
          ],
          createdBy: loggedInTeacher,
          difficulty: "MEDIUM",
          tags: ["React", "JavaScript"],
        },
        {
          id: "question-2",
          questionType: ["SUBJECTIVE"],
          question: "Explain the concept of virtual DOM in React.",
          createdBy: loggedInTeacher,
          difficulty: "HARD",
          tags: ["React", "Virtual DOM"],
          evaluationRubric: [
            { criterion: "Explanation", weight: 60 },
            { criterion: "Examples", weight: 40 },
          ],
        }
      ] as Question[]);
    }, 500);
  });
}
