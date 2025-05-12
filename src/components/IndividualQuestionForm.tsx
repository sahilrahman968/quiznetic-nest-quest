import React, { useState, useEffect } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type Question,
  type Option,
  createSubjectiveQuestion,
  createMCQQuestion,
  SyllabusItem,
  fetchBoards,
  fetchClasses,
  fetchSubjects,
  fetchChapters,
  fetchTopics,
  getLoggedInTeacher,
  getUploadUrl,
  getImageUrl,
} from "@/services/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { v4 as uuidv4 } from 'uuid';
import { UploadButton } from "@/lib/uploadthing";

// Import the helper function
import { validateEvaluationRubric } from "@/utils/questionHelpers";

const formSchema = z.object({
  questionTitle: z.string().min(2, {
    message: "Question title must be at least 2 characters.",
  }),
  marks: z.number().min(1, {
    message: "Marks must be at least 1.",
  }),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
});

const IndividualQuestionForm = () => {
  const [questionTitle, setQuestionTitle] = useState("");
  const [marks, setMarks] = useState(1);
  const [difficulty, setDifficulty] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");
  const [questionType, setQuestionType] = useState<("SINGLE_CORRECT_MCQ" | "MULTIPLE_CORRECT_MCQ" | "SUBJECTIVE")[]>(["SINGLE_CORRECT_MCQ"]);
  const [options, setOptions] = useState<Option[]>([]);
  const [evaluationRubric, setEvaluationRubric] = useState<{ criterion?: string; weight?: number }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [boards, setBoards] = useState<SyllabusItem[]>([]);
  const [classes, setClasses] = useState<SyllabusItem[]>([]);
  const [subjects, setSubjects] = useState<SyllabusItem[]>([]);
  const [chapters, setChapters] = useState<SyllabusItem[]>([]);
  const [topics, setTopics] = useState<SyllabusItem[]>([]);
  const [syllabusMapping, setSyllabusMapping] = useState<{
    board: SyllabusItem | null;
    class: SyllabusItem | null;
    subject: SyllabusItem | null;
    chapter: SyllabusItem[];
    topic: SyllabusItem[];
  }>({
    board: null,
    class: null,
    subject: null,
    chapter: [],
    topic: [],
  });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadBoards = async () => {
      const data = await fetchBoards();
      setBoards(data);
    };
    loadBoards();
  }, []);

  useEffect(() => {
    const loadClasses = async () => {
      if (syllabusMapping.board) {
        const data = await fetchClasses(syllabusMapping.board.id);
        setClasses(data);
      } else {
        setClasses([]);
      }
    };
    loadClasses();
  }, [syllabusMapping.board]);

  useEffect(() => {
    const loadSubjects = async () => {
      if (syllabusMapping.class) {
        const data = await fetchSubjects(syllabusMapping.class.id);
        setSubjects(data);
      } else {
        setSubjects([]);
      }
    };
    loadSubjects();
  }, [syllabusMapping.class]);

  useEffect(() => {
    const loadChapters = async () => {
      if (syllabusMapping.subject) {
        const data = await fetchChapters(syllabusMapping.subject.id);
        setChapters(data);
      } else {
        setChapters([]);
      }
    };
    loadChapters();
  }, [syllabusMapping.subject]);

  useEffect(() => {
    const loadTopics = async () => {
      if (syllabusMapping.chapter.length > 0) {
        const topicsPromises = syllabusMapping.chapter.map(chapter => fetchTopics(chapter.id));
        const topicsArrays = await Promise.all(topicsPromises);
        // Flatten the array of arrays into a single array
        const allTopics = topicsArrays.reduce((acc, topics) => acc.concat(topics), []);
        setTopics(allTopics);
      } else {
        setTopics([]);
      }
    };
    loadTopics();
  }, [syllabusMapping.chapter]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      questionTitle: "",
      marks: 1,
      difficulty: "MEDIUM",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    });
  }

  const addOption = () => {
    setOptions([...options, { id: uuidv4(), text: "", isCorrect: false }]);
  };

  const updateOption = (id: string, text: string) => {
    setOptions(
      options.map((option) =>
        option.id === id ? { ...option, text } : option
      )
    );
  };

  const toggleCorrect = (id: string) => {
    if (questionType[0] === "SINGLE_CORRECT_MCQ") {
      // For single correct MCQ, only allow one correct answer
      setOptions(
        options.map((option) => ({
          ...option,
          isCorrect: option.id === id ? true : false,
        }))
      );
    } else {
      // For multiple correct MCQ, toggle the isCorrect property
      setOptions(
        options.map((option) =>
          option.id === id ? { ...option, isCorrect: !option.isCorrect } : option
        )
      );
    }
  };

  const deleteOption = (id: string) => {
    setOptions(options.filter((option) => option.id !== id));
  };

  const addRubricItem = () => {
    setEvaluationRubric([...evaluationRubric, { criterion: "", weight: 1 }]);
  };

  const updateRubricItem = (index: number, criterion: string, weight: number) => {
    const newRubric = [...evaluationRubric];
    newRubric[index] = { criterion, weight };
    setEvaluationRubric(newRubric);
  };

  const deleteRubricItem = (index: number) => {
    const newRubric = evaluationRubric.filter((_, i) => i !== index);
    setEvaluationRubric(newRubric);
  };

  const resetForm = () => {
    setQuestionTitle("");
    setMarks(1);
    setDifficulty("MEDIUM");
    setQuestionType(["SINGLE_CORRECT_MCQ"]);
    setOptions([]);
    setEvaluationRubric([]);
    setSyllabusMapping({
      board: null,
      class: null,
      subject: null,
      chapter: [],
      topic: [],
    });
    setImages([]);
  };

  const handleSubjectiveSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Validate evaluation rubric
      const validRubric = validateEvaluationRubric(evaluationRubric);
      
      const newQuestion: Partial<Question> = {
        questionTitle,
        markupQuestionTitle: questionTitle,
        marks,
        questionType: ["SUBJECTIVE"],
        options: [],
        difficulty,
        hasChild: false,
        createdBy: getLoggedInTeacher() || { id: "", name: "" },
        source: "USER_GENERATED",
        evaluationRubric: validRubric,
        syllabusMapping
      };
      
      if (images.length > 0) {
        newQuestion.images = images;
      }

      await createSubjectiveQuestion(newQuestion);
      toast({
        title: "Success!",
        description: "Question created successfully",
      });
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

  const handleMCQSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      if (options.length < 2) {
        toast({
          title: "Error",
          description: "Please add at least 2 options",
          variant: "destructive",
        });
        return;
      }

      // Check if at least one option is selected as correct for SINGLE_CORRECT_MCQ
      if (questionType[0] === "SINGLE_CORRECT_MCQ" && !options.some(opt => opt.isCorrect)) {
        toast({
          title: "Error",
          description: "Please select at least one correct option",
          variant: "destructive",
        });
        return;
      }
      
      const newQuestion: Partial<Question> = {
        questionTitle,
        markupQuestionTitle: questionTitle,
        marks,
        questionType,
        options,
        difficulty,
        hasChild: false,
        createdBy: getLoggedInTeacher() || { id: "", name: "" },
        source: "USER_GENERATED",
        evaluationRubric: [],
        syllabusMapping
      };
      
      if (images.length > 0) {
        newQuestion.images = images;
      }

      await createMCQQuestion(newQuestion);
      toast({
        title: "Success!",
        description: "Question created successfully",
      });
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
    <div className="container max-w-4xl mx-auto p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-2">
            <FormItem>
              <FormLabel>Question Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter question title"
                  value={questionTitle}
                  onChange={(e) => setQuestionTitle(e.target.value)}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Marks</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter marks"
                  value={marks}
                  onChange={(e) => setMarks(Number(e.target.value))}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Difficulty</FormLabel>
              <Select
                value={difficulty}
                onValueChange={(value) => setDifficulty(value as "EASY" | "MEDIUM" | "HARD")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EASY">Easy</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HARD">Hard</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Question Type</FormLabel>
              <Select
                value={questionType[0]}
                onValueChange={(value) => setQuestionType([value as "SINGLE_CORRECT_MCQ" | "MULTIPLE_CORRECT_MCQ" | "SUBJECTIVE"])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SINGLE_CORRECT_MCQ">Single Correct MCQ</SelectItem>
                  <SelectItem value="MULTIPLE_CORRECT_MCQ">Multiple Correct MCQ</SelectItem>
                  <SelectItem value="SUBJECTIVE">Subjective</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </div>

          {questionType[0] !== "SUBJECTIVE" && (
            <div className="space-y-2">
              <FormLabel>Options</FormLabel>
              {options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Enter option text"
                    value={option.text}
                    onChange={(e) => updateOption(option.id, e.target.value)}
                    className="flex-1"
                  />
                  {questionType[0] === "MULTIPLE_CORRECT_MCQ" ? (
                    <Switch
                      id={`option-${option.id}`}
                      checked={option.isCorrect}
                      onCheckedChange={() => toggleCorrect(option.id)}
                    />
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleCorrect(option.id)}
                      className={option.isCorrect ? "bg-green-500 text-white hover:bg-green-700" : "hover:bg-gray-100"}
                    >
                      {option.isCorrect ? "Correct" : "Mark Correct"}
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteOption(option.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addOption}>
                Add Option
              </Button>
            </div>
          )}

          {questionType[0] === "SUBJECTIVE" && (
            <div className="space-y-2">
              <FormLabel>Evaluation Rubric</FormLabel>
              {evaluationRubric.map((rubricItem, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Criterion"
                    value={rubricItem.criterion}
                    onChange={(e) =>
                      updateRubricItem(index, e.target.value, rubricItem.weight || 1)
                    }
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Weight"
                    value={rubricItem.weight}
                    onChange={(e) =>
                      updateRubricItem(index, rubricItem.criterion || "", Number(e.target.value))
                    }
                    className="w-24"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteRubricItem(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addRubricItem}>
                Add Rubric Item
              </Button>
            </div>
          )}

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Syllabus Mapping</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <FormItem>
                      <FormLabel>Board</FormLabel>
                      <Select
                        value={syllabusMapping.board?.id || undefined}
                        onValueChange={(value) => {
                          const selectedBoard = boards.find((board) => board.id === value);
                          setSyllabusMapping({
                            ...syllabusMapping,
                            board: selectedBoard || null,
                            class: null,
                            subject: null,
                            chapter: [],
                            topic: [],
                          });
                        }}
                      >
                        <SelectTrigger>
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
                      <FormMessage />
                    </FormItem>
                  </div>

                  <div>
                    <FormItem>
                      <FormLabel>Class</FormLabel>
                      <Select
                        value={syllabusMapping.class?.id || undefined}
                        onValueChange={(value) => {
                          const selectedClass = classes.find((cls) => cls.id === value);
                          setSyllabusMapping({
                            ...syllabusMapping,
                            class: selectedClass || null,
                            subject: null,
                            chapter: [],
                            topic: [],
                          });
                        }}
                      >
                        <SelectTrigger>
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
                      <FormMessage />
                    </FormItem>
                  </div>

                  <div>
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <Select
                        value={syllabusMapping.subject?.id || undefined}
                        onValueChange={(value) => {
                          const selectedSubject = subjects.find((subject) => subject.id === value);
                          setSyllabusMapping({
                            ...syllabusMapping,
                            subject: selectedSubject || null,
                            chapter: [],
                            topic: [],
                          });
                        }}
                      >
                        <SelectTrigger>
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
                      <FormMessage />
                    </FormItem>
                  </div>

                  <div>
                    <FormItem>
                      <FormLabel>Chapter</FormLabel>
                      <Select
                        multiple
                        value={syllabusMapping.chapter.map((chapter) => chapter.id)}
                        onValueChange={(values) => {
                          const selectedChapters = chapters.filter((chapter) => values.includes(chapter.id));
                          setSyllabusMapping({
                            ...syllabusMapping,
                            chapter: selectedChapters,
                            topic: [],
                          });
                        }}
                      >
                        <SelectTrigger>
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
                      <FormMessage />
                    </FormItem>
                  </div>

                  <div>
                    <FormItem>
                      <FormLabel>Topic</FormLabel>
                      <Select
                        multiple
                        value={syllabusMapping.topic.map((topic) => topic.id)}
                        onValueChange={(values) => {
                          const selectedTopics = topics.filter((topic) => values.includes(topic.id));
                          setSyllabusMapping({
                            ...syllabusMapping,
                            topic: selectedTopics,
                          });
                        }}
                      >
                        <SelectTrigger>
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
                      <FormMessage />
                    </FormItem>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-2">
              <AccordionTrigger>Images</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col space-y-4">
                  <FormLabel>Upload Images</FormLabel>
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      // Do something with the response
                      console.log("Files: ", res);
                      if (res && res.length > 0) {
                        const newImages = res.map((file) => file.key);
                        setImages([...images, ...newImages]);
                      }
                      toast({
                        title: "Upload Complete!",
                        description: "Images uploaded successfully",
                      });
                    }}
                    onUploadError={(error) => {
                      // Do something with the error.
                      toast({
                        title: "Error",
                        description: error.message || "Failed to upload images",
                        variant: "destructive",
                      });
                      console.log("Error: ", error);
                    }}
                  />

                  {images.length > 0 && (
                    <div className="flex flex-wrap gap-4">
                      {images.map((imageKey) => (
                        <div key={imageKey} className="relative">
                          <img
                            src={`http://localhost:3001/api/s3/get-image-url/${imageKey}`}
                            alt="Uploaded"
                            className="w-32 h-32 object-cover rounded-md"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-0 right-0 rounded-full"
                            onClick={() => setImages(images.filter((key) => key !== imageKey))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button type="button"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            onClick={() => {
              if (questionType[0] === "SUBJECTIVE") {
                handleSubjectiveSubmit();
              } else {
                handleMCQSubmit();
              }
            }}
          >
            {questionType[0] === "SUBJECTIVE" ? "Create Subjective Question" : "Create MCQ Question"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default IndividualQuestionForm;
