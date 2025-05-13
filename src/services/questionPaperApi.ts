
import { QuestionPaper } from "@/types/questionPaper";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const fetchQuestionPapers = async (): Promise<QuestionPaper[]> => {
  try {
    const response = await fetch('http://localhost:3001/api/question-paper/', {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch question papers');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching question papers:', error);
    return [];
  }
};

export const fetchQuestionPaperById = async (id: string): Promise<QuestionPaper | null> => {
  try {
    const response = await fetch(`http://localhost:3001/api/question-paper/${id}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch question paper');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching question paper with ID ${id}:`, error);
    return null;
  }
};
