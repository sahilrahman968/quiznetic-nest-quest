
import { Question, createMCQQuestion, createSubjectiveQuestion, getLoggedInTeacher } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { QuestionFormData } from "@/hooks/use-question-form";

export const handleQuestionSubmission = async (
  data: QuestionFormData, 
  onSuccess?: () => void
) => {
  try {
    const teacher = getLoggedInTeacher();
    if (!teacher) {
      toast({
        title: "Error",
        description: "You must be logged in to create questions",
        variant: "destructive",
      });
      return false;
    }

    // Ensure syllabusMapping is properly formatted to match the required type
    const formattedSyllabusMapping = {
      board: {
        id: data.syllabusMapping.board.id,
        name: data.syllabusMapping.board.name,
      },
      class: {
        id: data.syllabusMapping.class.id,
        name: data.syllabusMapping.class.name,
      },
      subject: {
        id: data.syllabusMapping.subject.id,
        name: data.syllabusMapping.subject.name,
      },
      chapter: data.syllabusMapping.chapter,
      topic: data.syllabusMapping.topic,
    };

    // Prepare the question data with properly typed evaluation rubric
    const questionData: Partial<Question> = {
      ...data,
      syllabusMapping: formattedSyllabusMapping,
      createdBy: teacher,
      questionType: [data.questionType],
      // Ensure options have required properties
      options: data.options?.map(opt => ({
        id: opt.id,
        text: opt.text,
        isCorrect: opt.isCorrect
      })) || [],
      // Ensure evaluation rubric has all required properties
      evaluationRubric: data.evaluationRubric?.map(rubric => ({
        criterion: rubric.criterion,
        weight: rubric.weight,
        keywordHints: rubric.keywordHints || []
      })) || []
    };

    const isMCQ = data.questionType === "SINGLE_CORRECT_MCQ" || data.questionType === "MULTIPLE_CORRECT_MCQ";
    
    // Submit based on question type
    let response;
    if (isMCQ) {
      // Validate that at least one option is marked as correct
      const hasCorrectOption = data.options?.some(option => option.isCorrect);
      if (!hasCorrectOption) {
        toast({
          title: "Error",
          description: "At least one option must be marked as correct",
          variant: "destructive",
        });
        return false;
      }
      response = await createMCQQuestion(questionData);
    } else {
      // Validate that at least one evaluation criterion is added
      if (!data.evaluationRubric || data.evaluationRubric.length === 0) {
        toast({
          title: "Error",
          description: "At least one evaluation criterion must be added",
          variant: "destructive",
        });
        return false;
      }
      response = await createSubjectiveQuestion(questionData);
    }

    toast({
      title: "Success",
      description: "Question created successfully",
    });
    
    if (onSuccess) {
      onSuccess();
    }
    
    return true;
  } catch (error) {
    console.error("Error creating question:", error);
    toast({
      title: "Error",
      description: "Failed to create question",
      variant: "destructive",
    });
    return false;
  }
};
