
export interface Teacher {
  id: string;
  name: string;
}

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface EvaluationCriterion {
  criterion: string;
  weight: number;
}

export interface SyllabusItem {
  id: string;
  name: string;
}

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
  questionType: string[];
  questionTitle?: string;
  explanation?: string;
  marks?: number;
  hasChild?: boolean;
  childQuestions?: Question[];
  syllabusMapping?: SyllabusMapping;
  options?: Option[];
  evaluationRubric?: EvaluationCriterion[];
  images?: string[];
  createdBy?: Teacher;
  source?: string;
  difficulty?: string;
}
