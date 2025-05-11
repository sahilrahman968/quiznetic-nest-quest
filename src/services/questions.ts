
import { Question } from "@/types/api";

const API_BASE_URL = "http://localhost:3001";

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

// Add these specialized question creation functions
export const createMCQQuestion = async (questionData: any): Promise<Question> => {
  return createQuestion({
    ...questionData,
    questionType: Array.isArray(questionData.questionType) 
      ? questionData.questionType 
      : [questionData.questionType]
  });
};

export const createSubjectiveQuestion = async (questionData: any): Promise<Question> => {
  return createQuestion({
    ...questionData,
    questionType: Array.isArray(questionData.questionType) 
      ? questionData.questionType 
      : [questionData.questionType]
  });
};

export function createParentQuestion(data: any) {
  // Mock implementation
  return Promise.resolve({ id: '123', ...data });
}
