
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import MCQOptions from "@/components/MCQOptions";
import EvaluationRubric from "@/components/EvaluationRubric";
import SyllabusMapping from "@/components/SyllabusMapping";
import { Question, createMCQQuestion, createSubjectiveQuestion, getLoggedInTeacher } from "@/services/api";
import { toast } from "@/hooks/use-toast";

const questionSchema = z.object({
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

type QuestionFormData = z.infer<typeof questionSchema>;

interface IndividualQuestionFormProps {
  parentId?: string;
  onSuccess?: () => void;
}

const IndividualQuestionForm = ({ parentId, onSuccess }: IndividualQuestionFormProps) => {
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

  useEffect(() => {
    // Reset options or evaluation rubric when question type changes
    if (isMCQ) {
      form.setValue("evaluationRubric", []);
    } else {
      form.setValue("options", []);
    }
  }, [questionType, form]);

  const onSubmit = async (data: QuestionFormData) => {
    try {
      const teacher = getLoggedInTeacher();
      if (!teacher) {
        toast({
          title: "Error",
          description: "You must be logged in to create questions",
          variant: "destructive",
        });
        return;
      }

      // Prepare the question data
      const questionData: Partial<Question> = {
        ...data,
        createdBy: teacher,
        questionType: [data.questionType],
      };

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
          return;
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
          return;
        }
        response = await createSubjectiveQuestion(questionData);
      }

      toast({
        title: "Success",
        description: "Question created successfully",
      });
      
      // Reset the form
      form.reset({
        questionTitle: "",
        marks: 1,
        difficulty: "MEDIUM",
        questionType: "SUBJECTIVE",
        options: [],
        evaluationRubric: [],
        source: "USER_GENERATED",
        images: [],
        parentId: parentId,
      });

      // Call the success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating question:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="questionTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question Title</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter your question here..." {...field} className="min-h-24" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="marks"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marks</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={1} 
                    {...field} 
                    onChange={e => field.onChange(parseInt(e.target.value) || 1)} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="EASY">Easy</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HARD">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="questionType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SINGLE_CORRECT_MCQ">Single Correct MCQ</SelectItem>
                    <SelectItem value="MULTIPLE_CORRECT_MCQ">Multiple Correct MCQ</SelectItem>
                    <SelectItem value="SUBJECTIVE">Subjective</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="USER_GENERATED">User Generated</SelectItem>
                  <SelectItem value="AI_GENERATED">AI Generated</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {isMCQ && <MCQOptions control={form.control} isMultipleChoice={isMultipleChoice} />}

        {!isMCQ && <EvaluationRubric control={form.control} />}

        <SyllabusMapping control={form.control} />

        <Button type="submit" className="w-full">
          Create Question
        </Button>
      </form>
    </Form>
  );
};

export default IndividualQuestionForm;
