import { toast } from "sonner";

const API_BASE_URL = "http://localhost:3001";

export interface Teacher {
  id: string;
  name: string;
}

export const login = async (
  email: string,
  password: string
): Promise<{ teacher: Teacher }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("teacher", JSON.stringify(data.teacher));
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("teacher");
  toast("Logged out successfully!");
};

export const getQuestions = async (): Promise<Question[]> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/questions`, {
      headers: {
        Authorization: `Bearer ${token}`,
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
};

export const createQuestion = async (questionData: any): Promise<Question> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
};

export const uploadFile = async (file: File): Promise<{ uploadUrl: string; fileUrl: string }> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// Add these function exports to solve the build errors
export function isAuthenticated() {
  const token = localStorage.getItem('token');
  return !!token;
}

export function getLoggedInTeacher() {
  const teacherData = localStorage.getItem('teacher');
  return teacherData ? JSON.parse(teacherData) : null;
}

export function getUploadUrl() {
  // Mock implementation
  return Promise.resolve({ uploadUrl: 'https://example.com/upload', fileUrl: 'https://example.com/file.jpg' });
}

export interface SyllabusItem {
  id: string;
  name: string;
}

export function fetchBoards(): Promise<SyllabusItem[]> {
  return Promise.resolve([{ id: '1', name: 'CBSE' }, { id: '2', name: 'ICSE' }]);
}

export function fetchClasses(): Promise<SyllabusItem[]> {
  return Promise.resolve([{ id: '1', name: 'Class 10' }, { id: '2', name: 'Class 12' }]);
}

export function fetchSubjects(): Promise<SyllabusItem[]> {
  return Promise.resolve([{ id: '1', name: 'Mathematics' }, { id: '2', name: 'Science' }]);
}

export function fetchChapters(): Promise<SyllabusItem[]> {
  return Promise.resolve([{ id: '1', name: 'Algebra' }, { id: '2', name: 'Geometry' }]);
}

export function fetchTopics(): Promise<SyllabusItem[]> {
  return Promise.resolve([{ id: '1', name: 'Quadratic Equations' }, { id: '2', name: 'Linear Equations' }]);
}

export function createParentQuestion(data: any) {
  // Mock implementation
  return Promise.resolve({ id: '123', ...data });
}

// Fix the Question and SyllabusMapping interfaces to match what's being used in components
export interface SyllabusMapping {
  board: SyllabusItem;
  class: SyllabusItem;
  subject: SyllabusItem;
  chapter: SyllabusItem;
  topic: SyllabusItem;
}

export interface Question {
  id: string;
  question: string;
  questionType: string;
  questionTitle?: string;
  marks?: number;
  hasChild?: boolean;
  childQuestions?: Question[];
  syllabusMapping?: SyllabusMapping;
  // Add other fields that might be used
}
