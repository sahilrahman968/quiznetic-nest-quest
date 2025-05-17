
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Question } from "@/services/api";

export const questionSchema = z.object({
  questionTitle: z.string().min(1, "Question title is required"),
  marks: z.number().min(1, "Marks must be at least 1"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  questionType: z.enum(["SINGLE_CORRECT_MCQ", "MULTIPLE_CORRECT_MCQ", "SUBJECTIVE"]),
  options: z.array(
    z.object({
      id: z.string(),
      text: z.string().min(1, "Option text is required"),
      isCorrect: z.boolean(),
    })
  ).optional(),
  evaluationRubric: z.array(
    z.object({
      criterion: z.string().min(1, "Criterion is required"),
      weight: z.number().min(1, "Weight must be at least 1"),
      keywordHints: z.array(z.string()).default([])
    })
  ).optional(),
  source: z.enum(["AI_GENERATED", "USER_GENERATED"]),
  images: z.array(z.string()).default([]),
  syllabusMapping: z.object({
    board: z.object({
      id: z.string(),
      name: z.string(),
    }),
    class: z.object({
      id: z.string(),
      name: z.string(),
    }),
    subject: z.object({
      id: z.string(),
      name: z.string(),
    }),
    chapter: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    ),
    topic: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    ),
  }),
  parentId: z.string().optional(),
});

export type QuestionFormData = z.infer<typeof questionSchema>;

export const useQuestionForm = (parentId?: string) => {
  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      questionTitle: "",
      marks: 1,
      difficulty: "MEDIUM",
      questionType: "SUBJECTIVE",
      options: [],
      evaluationRubric: [],
      source: "USER_GENERATED",
      images: [],
      parentId: parentId,
    },
  });

  const questionType = form.watch("questionType");
  const isMCQ = questionType === "SINGLE_CORRECT_MCQ" || questionType === "MULTIPLE_CORRECT_MCQ";
  const isMultipleChoice = questionType === "MULTIPLE_CORRECT_MCQ";

  return {
    form,
    questionType,
    isMCQ,
    isMultipleChoice
  };
};
