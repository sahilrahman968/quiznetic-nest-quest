import { toast } from "@/hooks/use-toast";

// Base URL for API
const BASE_URL = "http://localhost:3001/api";

// Types
export interface Teacher {
  _id: string;
  id: string;
  name: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  teacher: Teacher;
}

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface EvaluationRubric {
  criterion: string;
  weight: number;
  keywordHints?: string[];
}

export interface SyllabusItem {
  id: string;
  name: string;
}

export interface SyllabusMapping {
  board: SyllabusItem;
  class: SyllabusItem;
  subject: SyllabusItem;
  chapter: SyllabusItem[];
  topic: SyllabusItem[];
}

export interface Question {
  _id?: string;
  id?: string;
  parentId?: string | null;
  hasChild: boolean;
  questionTitle: string;
  markupQuestionTitle?: string;
  marks: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  questionType: ("SINGLE_CORRECT_MCQ" | "MULTIPLE_CORRECT_MCQ" | "SUBJECTIVE")[];
  source: "AI_GENERATED" | "USER_GENERATED";
  options?: Option[];
  evaluationRubric?: EvaluationRubric[];
  syllabusMapping?: SyllabusMapping;
  createdBy?: {
    id: string;
    name: string;
  };
  images?: string[];
  childIds?: string[];
  childQuestions?: Question[];
  year?: string;
}

// Auth functions
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/teachers/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();
    // Store the auth token
    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("teacher", JSON.stringify(data.teacher));
    
    return data;
  } catch (error: any) {
    toast({
      title: "Login Failed",
      description: error.message || "Failed to login. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};

// Function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

// Syllabus API functions
export const fetchBoards = async (): Promise<SyllabusItem[]> => {
  try {
    const response = await fetch(`${BASE_URL}/boards`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch boards");
    return await response.json();
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message || "Failed to fetch boards",
      variant: "destructive",
    });
    return [];
  }
};

export const fetchClasses = async (boardId: string): Promise<SyllabusItem[]> => {
  try {
    const response = await fetch(`${BASE_URL}/classes?boardId=${boardId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch classes");
    return await response.json();
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message || "Failed to fetch classes",
      variant: "destructive",
    });
    return [];
  }
};

export const fetchSubjects = async (classId: string): Promise<SyllabusItem[]> => {
  try {
    const response = await fetch(`${BASE_URL}/subjects?classId=${classId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch subjects");
    return await response.json();
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message || "Failed to fetch subjects",
      variant: "destructive",
    });
    return [];
  }
};

export const fetchChapters = async (subjectId: string): Promise<SyllabusItem[]> => {
  try {
    const response = await fetch(`${BASE_URL}/chapters?subjectId=${subjectId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch chapters");
    return await response.json();
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message || "Failed to fetch chapters",
      variant: "destructive",
    });
    return [];
  }
};

export const fetchTopics = async (chapterId: string): Promise<SyllabusItem[]> => {
  try {
    const response = await fetch(`${BASE_URL}/topics?chapterId=${chapterId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch topics");
    return await response.json();
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message || "Failed to fetch topics",
      variant: "destructive",
    });
    return [];
  }
};

// Question API functions
export const createSubjectiveQuestion = async (question: Partial<Question>): Promise<Question> => {
  try {
    const response = await fetch(`${BASE_URL}/questions/create-subjective`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(question),
    });
    if (!response.ok) throw new Error("Failed to create subjective question");
    return await response.json();
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message || "Failed to create subjective question",
      variant: "destructive",
    });
    throw error;
  }
};

export const createMCQQuestion = async (question: Partial<Question>): Promise<Question> => {
  try {
    const response = await fetch(`${BASE_URL}/questions/create-mcq`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(question),
    });
    if (!response.ok) throw new Error("Failed to create MCQ question");
    return await response.json();
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message || "Failed to create MCQ question",
      variant: "destructive",
    });
    throw error;
  }
};

export const createParentQuestion = async (question: Partial<Question>): Promise<Question> => {
  try {
    const response = await fetch(`${BASE_URL}/questions/create-parent`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(question),
    });
    if (!response.ok) throw new Error("Failed to create parent question");
    return await response.json();
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message || "Failed to create parent question",
      variant: "destructive",
    });
    throw error;
  }
};

export const fetchQuestions = async (): Promise<Question[]> => {
  try {
    const response = await fetch(`${BASE_URL}/questions`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch questions");
    return await response.json();
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message || "Failed to fetch questions",
      variant: "destructive",
    });
    return [];
  }
};

export const getUploadUrl = async (): Promise<{ url: string; key: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/s3/get-upload-url`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Failed to get upload URL");
    return await response.json();
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message || "Failed to get upload URL",
      variant: "destructive",
    });
    throw error;
  }
};

// Helper to get logged in teacher info
export const getLoggedInTeacher = (): { id: string; name: string } | null => {
  const teacherStr = localStorage.getItem("teacher");
  if (!teacherStr) return null;
  
  const teacher = JSON.parse(teacherStr);
  return { id: teacher.id, name: teacher.name };
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("auth_token");
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("teacher");
  window.location.href = "/";
};
