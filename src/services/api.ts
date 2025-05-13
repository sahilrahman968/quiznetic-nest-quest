import { Question } from "@/types";

const API_BASE_URL = "http://localhost:3001/api";

// Utility function to get the token from localStorage
export const getToken = () => localStorage.getItem("token");

// Authentication API calls
export async function login(credentials: any): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = await response.json();
  localStorage.setItem("token", data.token); // Store the token upon successful login
  localStorage.setItem("teacher", JSON.stringify(data.teacher));
  return data;
}

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("teacher");
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};

export const getTeacher = (): any => {
  const teacher = localStorage.getItem("teacher");
  return teacher ? JSON.parse(teacher) : null;
};

// Question types
export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type QuestionType = "SUBJECTIVE" | "OBJECTIVE";
export type Source = "USER_GENERATED" | "AI_GENERATED";

export interface Option {
  _id?: string;
  text: string;
  isCorrect: boolean;
}

export interface EvaluationRubric {
  _id?: string;
  criterion: string;
  weight: number;
  keywordHints: string[];
}

export interface Question {
  _id?: string;
  questionTitle: string;
  images: string[];
  difficulty: Difficulty;
  questionType: QuestionType[];
  marks: number;
  options: Option[];
  source: Source;
  evaluationRubric: EvaluationRubric[];
  board?: { id: string; name: string };
  class?: { id: string; name: string };
  subject?: { id: string; name: string };
  topic?: { id: string; name: string };
  teacher?: { id: string; name: string };
  createdAt?: string;
  updatedAt?: string;
  id?: string;
  createdBy: {
    id: string;
    name: string;
  };
}

export interface QuestionPaper {
  _id: string;
  id: string;
  paperTitle: string;
  instructions: string[];
  paperType: "SUBJECTIVE" | "OBJECTIVE" | "MIXED";
  defaultStatus: string;
  year: string;
  board: {
    id: string;
    name: string;
  };
  class: {
    id: string;
    name: string;
  };
  subject: {
    id: string;
    name: string;
  };
  timeDuration: number;
  totalMarks: number;
  difficulty: {
    easy: number;
    medium: number;
    hard: number;
    _id: string;
  };
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

// Question API calls
export async function fetchQuestions(): Promise<Question[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/question`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
}

export async function createQuestion(questionData: Question): Promise<Question> {
  try {
    const response = await fetch(`${API_BASE_URL}/question`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(questionData),
    });
    if (!response.ok) {
      throw new Error("Failed to create question");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating question:", error);
    throw error;
  }
}

export async function updateQuestion(
  id: string,
  questionData: Question
): Promise<Question> {
  try {
    const response = await fetch(`${API_BASE_URL}/question/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(questionData),
    });
    if (!response.ok) {
      throw new Error("Failed to update question");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating question:", error);
    throw error;
  }
}

export async function deleteQuestion(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/question/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete question");
    }
  } catch (error) {
    console.error("Error deleting question:", error);
    throw error;
  }
}

// Question Paper API calls
export async function fetchQuestionPapers(): Promise<QuestionPaper[]> {
  try {
    const response = await fetch('http://localhost:3001/api/question-paper/', {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch question papers');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching question papers:', error);
    throw error;
  }
}
