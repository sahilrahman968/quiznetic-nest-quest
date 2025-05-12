import React, { useState, useEffect, useCallback } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, Trash } from "lucide-react";
import {
  createParentQuestion,
  Difficulty,
  EvaluationRubric,
  getLoggedInTeacher,
  Question,
  SyllabusItem,
  SyllabusMapping,
  fetchBoards,
  fetchClasses,
  fetchSubjects,
  fetchChapters,
  fetchTopics,
} from "@/services/api";
import { toast } from "@/hooks/use-toast";
import ImageUpload from "@/components/ImageUpload";
import { Label } from "@/components/ui/label";
import { validateEvaluationRubric } from "@/utils/questionHelpers";

const formSchema = z.object({
  parentTitle: z.string().min(1, {
    message: "Parent question title is required.",
  }),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).default("MEDIUM"),
});

const childQuestionSchema = z.object({
  questionTitle: z.string().min(1, {
    message: "Question title is required.",
  }),
  marks: z.number().min(1, {
    message: "Marks must be at least 1.",
  }),
});

const NestedQuestionForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [childQuestions, setChildQuestions] = useState<
    Pick<Question, "questionTitle" | "marks">[]
  >([]);
  const [difficulty, setDifficulty] = useState<Difficulty>("MEDIUM");
  const [evaluationRubric, setEvaluationRubric] = useState<
    { criterion?: string; weight?: number }[]
  >([{ criterion: "", weight: 0 }]);
  const [images, setImages] = useState<string[]>([]);

  // Syllabus Mapping States
  const [boards, setBoards] = useState<SyllabusItem[]>([]);
  const [classes, setClasses] = useState<SyllabusItem[]>([]);
  const [subjects, setSubjects] = useState<SyllabusItem[]>([]);
  const [chapters, setChapters] = useState<SyllabusItem[]>([]);
  const [topics, setTopics] = useState<SyllabusItem[]>([]);

  const [syllabusMapping, setSyllabusMapping] = useState<SyllabusMapping>({
    board: { id: "", name: "" },
    class: { id: "", name: "" },
    subject: { id: "", name: "" },
    chapter: [],
    topic: [],
  });

  useEffect(() => {
    const loadBoards = async () => {
      const fetchedBoards = await fetchBoards();
      setBoards(fetchedBoards);
    };

    loadBoards();
  }, []);

  const handleBoardChange = async (boardId: string) => {
    const selectedBoard = boards.find((board) => board.id === boardId);
    setSyllabusMapping((prev) => ({ ...prev, board: selectedBoard! }));

    const fetchedClasses = await fetchClasses(boardId);
    setClasses(fetchedClasses);
    setSubjects([]);
    setChapters([]);
    setTopics([]);
    setSyllabusMapping((prev) => ({
      ...prev,
      class: { id: "", name: "" },
      subject: { id: "", name: "" },
      chapter: [],
      topic: [],
    }));
  };

  const handleClassChange = async (classId: string) => {
    const selectedClass = classes.find((cls) => cls.id === classId);
    setSyllabusMapping((prev) => ({ ...prev, class: selectedClass! }));

    const fetchedSubjects = await fetchSubjects(classId);
    setSubjects(fetchedSubjects);
    setChapters([]);
    setTopics([]);
    setSyllabusMapping((prev) => ({
      ...prev,
      subject: { id: "", name: "" },
      chapter: [],
      topic: [],
    }));
  };

  const handleSubjectChange = async (subjectId: string) => {
    const selectedSubject = subjects.find((subject) => subject.id === subjectId);
    setSyllabusMapping((prev) => ({ ...prev, subject: selectedSubject! }));

    const fetchedChapters = await fetchChapters(subjectId);
    setChapters(fetchedChapters);
    setTopics([]);
    setSyllabusMapping((prev) => ({ ...prev, chapter: [], topic: [] }));
  };

  const handleChapterChange = (chapterIds: string[]) => {
    const selectedChapters = chapters.filter((chapter) =>
      chapterIds.includes(chapter.id)
    );
    setSyllabusMapping((prev) => ({ ...prev, chapter: selectedChapters }));

    setTopics([]);
    fetchTopicsForSelectedChapters(chapterIds);
  };

  const fetchTopicsForSelectedChapters = async (chapterIds: string[]) => {
    let allTopics: SyllabusItem[] = [];
    for (const chapterId of chapterIds) {
      const fetchedTopics = await fetchTopics(chapterId);
      allTopics = allTopics.concat(fetchedTopics);
    }
    setTopics(allTopics);
  };

  const handleTopicChange = (topicIds: string[]) => {
    const selectedTopics = topics.filter((topic) => topicIds.includes(topic.id));
    setSyllabusMapping((prev) => ({ ...prev, topic: selectedTopics }));
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parentTitle: "",
      difficulty: "MEDIUM",
    },
  });

  const { setValue, getValues } = form;

  const addChildQuestion = () => {
    setChildQuestions([
      ...childQuestions,
      { questionTitle: "", marks: 1, },
    ]);
  };

  const updateChildQuestion = (
    index: number,
    updatedQuestion: Pick<Question, "questionTitle" | "marks">
  ) => {
    const updatedQuestions = [...childQuestions];
    updatedQuestions[index] = updatedQuestion;
    setChildQuestions(updatedQuestions);
  };

  const removeChildQuestion = (index: number) => {
    const updatedQuestions = [...childQuestions];
    updatedQuestions.splice(index, 1);
    setChildQuestions(updatedQuestions);
  };

  const addEvaluationRubric = () => {
    setEvaluationRubric([...evaluationRubric, { criterion: "", weight: 0 }]);
  };

  const updateEvaluationRubric = (
    index: number,
    updatedRubric: { criterion?: string; weight?: number }
  ) => {
    const updatedRubrics = [...evaluationRubric];
    updatedRubrics[index] = updatedRubric;
    setEvaluationRubric(updatedRubrics);
  };

  const removeEvaluationRubric = (index: number) => {
    const updatedRubrics = [...evaluationRubric];
    updatedRubrics.splice(index, 1);
    setEvaluationRubric(updatedRubrics);
  };

  const resetForm = () => {
    form.reset();
    setChildQuestions([]);
    setDifficulty("MEDIUM");
    setEvaluationRubric([{ criterion: "", weight: 0 }]);
    setImages([]);
    setSyllabusMapping({
      board: { id: "", name: "" },
      class: { id: "", name: "" },
      subject: { id: "", name: "" },
      chapter: [],
      topic: [],
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      const validRubric = validateEvaluationRubric(evaluationRubric);
      
      const parentQuestion: Partial<Question> = {
        questionTitle: form.getValues("parentTitle"),
        markupQuestionTitle: form.getValues("parentTitle"),
        marks: childQuestions.reduce((sum, q) => sum + q.marks, 0),
        questionType: ["SUBJECTIVE"],
        difficulty,
        hasChild: true,
        createdBy: getLoggedInTeacher() || { id: "", name: "" },
        source: "USER_GENERATED",
        evaluationRubric: validRubric,
        syllabusMapping
      };
      
      if (images.length > 0) {
        parentQuestion.images = images;
      }
      
      const result = await createParentQuestion({
        ...parentQuestion,
        childQuestions,
      });
      
      toast({
        title: "Success!",
        description: "Nested question created successfully",
      });
      
      // Reset the form after successful submission
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create question",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="parentTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Question Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter parent question title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select onValueChange={setDifficulty} defaultValue={difficulty}>
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EASY">Easy</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HARD">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Child Questions</Label>
            <Accordion type="multiple" collapsible>
              {childQuestions.map((question, index) => (
                <AccordionItem key={index} value={`question-${index}`}>
                  <AccordionTrigger>
                    Question {index + 1}: {question.questionTitle || "Untitled"}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`questionTitle-${index}`}>
                            Question Title
                          </Label>
                          <Input
                            id={`questionTitle-${index}`}
                            placeholder="Enter question title"
                            value={question.questionTitle}
                            onChange={(e) =>
                              updateChildQuestion(index, {
                                ...question,
                                questionTitle: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor={`marks-${index}`}>Marks</Label>
                          <Input
                            type="number"
                            id={`marks-${index}`}
                            placeholder="Enter marks"
                            value={String(question.marks)}
                            onChange={(e) =>
                              updateChildQuestion(index, {
                                ...question,
                                marks: Number(e.target.value),
                              })
                            }
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeChildQuestion(index)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Button type="button" size="sm" onClick={addChildQuestion}>
              <Plus className="h-4 w-4 mr-2" />
              Add Child Question
            </Button>
          </div>

          <div>
            <Label>Evaluation Rubric</Label>
            <Accordion type="multiple" collapsible>
              {evaluationRubric.map((rubric, index) => (
                <AccordionItem key={index} value={`rubric-${index}`}>
                  <AccordionTrigger>
                    Rubric {index + 1}: {rubric.criterion || "Untitled"}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`criterion-${index}`}>Criterion</Label>
                          <Input
                            id={`criterion-${index}`}
                            placeholder="Enter criterion"
                            value={rubric.criterion}
                            onChange={(e) =>
                              updateEvaluationRubric(index, {
                                ...rubric,
                                criterion: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor={`weight-${index}`}>Weight</Label>
                          <Input
                            type="number"
                            id={`weight-${index}`}
                            placeholder="Enter weight"
                            value={String(rubric.weight)}
                            onChange={(e) =>
                              updateEvaluationRubric(index, {
                                ...rubric,
                                weight: Number(e.target.value),
                              })
                            }
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeEvaluationRubric(index)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Button type="button" size="sm" onClick={addEvaluationRubric}>
              <Plus className="h-4 w-4 mr-2" />
              Add Evaluation Rubric
            </Button>
          </div>

          <div>
            <Label>Syllabus Mapping</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="board">Board</Label>
                <Select onValueChange={handleBoardChange}>
                  <SelectTrigger id="board">
                    <SelectValue placeholder="Select board" />
                  </SelectTrigger>
                  <SelectContent>
                    {boards.map((board) => (
                      <SelectItem key={board.id} value={board.id}>
                        {board.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="class">Class</Label>
                <Select onValueChange={handleClassChange}>
                  <SelectTrigger id="class">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Select onValueChange={handleSubjectChange}>
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="chapter">Chapter(s)</Label>
                <Select
                  multiple
                  onValueChange={handleChapterChange}
                >
                  <SelectTrigger id="chapter">
                    <SelectValue placeholder="Select chapter(s)" />
                  </SelectTrigger>
                  <SelectContent>
                    {chapters.map((chapter) => (
                      <SelectItem key={chapter.id} value={chapter.id}>
                        {chapter.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="topic">Topic(s)</Label>
                <Select
                  multiple
                  onValueChange={handleTopicChange}
                >
                  <SelectTrigger id="topic">
                    <SelectValue placeholder="Select topic(s)" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((topic) => (
                      <SelectItem key={topic.id} value={topic.id}>
                        {topic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <Label>Images</Label>
            <ImageUpload images={images} setImages={setImages} />
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Create Question"}
        </Button>
      </form>
    </Form>
  );
};

export default NestedQuestionForm;
