
import { QuestionPaper } from "@/types/questionPaper";

export const fetchQuestionPapers = async (): Promise<QuestionPaper[]> => {
  try {
    const response = await fetch('http://localhost:3001/api/question-paper/');
    
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
