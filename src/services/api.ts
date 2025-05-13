
// Removing the import that causes error
export interface Question {
  _id?: string;
  id?: string;
  questionTitle: string;
  images: string[];
  difficulty: "EASY" | "MEDIUM" | "HARD";
  questionType: ("SUBJECTIVE" | "OBJECTIVE")[];
  marks: number;
  options: Option[];
  source: "USER_GENERATED" | "AI_GENERATED";
  evaluationRubric: EvaluationRubric[];
  board?: { id: string; name: string };
  class?: { id: string; name: string };
  subject?: { id: string; name: string };
  topic?: { id: string; name: string };
  teacher?: { id: string; name: string };
  createdAt?: string;
  updatedAt?: string;
  createdBy: {
    id: string;
    name: string;
  };
  hasChild?: boolean;
  childQuestions?: Question[];
  parentId?: string;
  childIds?: string[];
  syllabusMapping?: {
    board: { id: string; name: string };
    class: { id: string; name: string };
    subject: { id: string; name: string };
    chapter?: { id: string; name: string }[];
    topic?: { id: string; name: string }[];
  };
}

export interface Option {
  _id?: string;
  id?: string;
  text: string;
  isCorrect: boolean;
}

export interface EvaluationRubric {
  _id?: string;
  criterion: string;
  weight: number;
  keywordHints: string[];
}

export interface SyllabusItem {
  id: string;
  name: string;
}

export interface Teacher {
  id: string;
  name: string;
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

export const getLoggedInTeacher = (): Teacher | null => {
  const teacher = localStorage.getItem("teacher");
  return teacher ? JSON.parse(teacher) : null;
};

// File Upload API functions
export async function getUploadUrl(): Promise<{ url: string, key: string }> {
  const response = await fetch(`${API_BASE_URL}/upload/presigned-url`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  
  if (!response.ok) {
    throw new Error("Failed to get upload URL");
  }
  
  return await response.json();
}

export async function getImageUrl(key: string): Promise<{ url: string }> {
  const response = await fetch(`${API_BASE_URL}/upload/image-url/${key}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  
  if (!response.ok) {
    throw new Error("Failed to get image URL");
  }
  
  return await response.json();
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

export async function createParentQuestion(questionData: any): Promise<Question> {
  try {
    const response = await fetch(`${API_BASE_URL}/question/parent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(questionData),
    });
    if (!response.ok) {
      throw new Error("Failed to create parent question");
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating parent question:", error);
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

// Syllabus API calls
export async function fetchBoards(): Promise<SyllabusItem[]> {
  const response = await fetch(`${API_BASE_URL}/syllabus/boards`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch boards");
  }
  
  return await response.json();
}

export async function fetchClasses(boardId: string): Promise<SyllabusItem[]> {
  const response = await fetch(`${API_BASE_URL}/syllabus/classes/${boardId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch classes");
  }
  
  return await response.json();
}

export async function fetchSubjects(classId: string): Promise<SyllabusItem[]> {
  const response = await fetch(`${API_BASE_URL}/syllabus/subjects/${classId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch subjects");
  }
  
  return await response.json();
}

export async function fetchChapters(subjectId: string): Promise<SyllabusItem[]> {
  const response = await fetch(`${API_BASE_URL}/syllabus/chapters/${subjectId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch chapters");
  }
  
  return await response.json();
}

export async function fetchTopics(chapterId: string): Promise<SyllabusItem[]> {
  const response = await fetch(`${API_BASE_URL}/syllabus/topics/${chapterId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch topics");
  }
  
  return await response.json();
}

// Question Paper API calls
export async function fetchQuestionPapers(): Promise<QuestionPaper[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/question-paper`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
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
