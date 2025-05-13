
export interface SyllabusItem {
  id: string;
  name: string;
  _id?: string;
}

export interface SyllabusMappingType {
  board: SyllabusItem;
  class: SyllabusItem;
  subject: SyllabusItem;
  chapter?: SyllabusItem[];
  topic?: SyllabusItem[];
  _id?: string;
}

export interface CreatedBy {
  id: string;
  name: string;
}

export interface EvaluationRubricItem {
  criterion: string;
  weight: number;
  keywordHints: string[];
  _id?: string;
}

export interface QuestionItem {
  _id: string;
  id: string;
  parentId: string | null;
  hasChild: boolean;
  questionTitle: string;
  marks: number;
  difficulty: string;
  questionType: string[];
  source: string;
  createdBy: CreatedBy;
  images: string[];
  childIds?: string[];
  options: any[];
  evaluationRubric: EvaluationRubricItem[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  syllabusMapping?: SyllabusMappingType;
  childQuestions?: QuestionItem[];
  questionId?: string;
  questionOrder?: number;
  sectionOrder?: number;
}

export interface DifficultyLevel {
  easy: number;
  medium: number;
  hard: number;
  _id: string;
}

export interface QuestionPaper {
  _id: string;
  id: string;
  paperTitle: string;
  instructions: string[];
  paperType: string;
  defaultStatus: string;
  year: string;
  board: SyllabusItem;
  class: SyllabusItem;
  subject: SyllabusItem;
  timeDuration: number;
  totalMarks: number;
  difficulty: DifficultyLevel;
  questions: QuestionItem[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
