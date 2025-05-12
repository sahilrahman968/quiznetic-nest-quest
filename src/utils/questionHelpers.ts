
import { EvaluationRubric } from "@/services/api";

// Helper function to ensure evaluation rubric items have required properties
export const validateEvaluationRubric = (rubric: { criterion?: string; weight?: number }[]): EvaluationRubric[] => {
  return rubric
    .filter(item => item.criterion && item.weight !== undefined)
    .map(item => ({
      criterion: item.criterion as string,
      weight: item.weight as number,
      keywordHints: []
    }));
};
