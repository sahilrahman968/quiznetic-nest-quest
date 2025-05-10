import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import MCQOptions from "@/components/MCQOptions";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, X } from "lucide-react";
import { nanoid } from "nanoid";
import { toast } from "@/components/ui/sonner";
import { createMCQQuestion, createSubjectiveQuestion, getLoggedInTeacher } from "@/services/api";

const questionSchema = z.object({
  questionType: z.enum(["SINGLE_CORRECT_MCQ", "MULTIPLE_CORRECT_MCQ", "SUBJECTIVE"]),
  question: z.string().min(1, { message: "Question is required" }),
  explanation: z.string().optional(),
  options: z.array(
    z.object({
      id: z.string(),
      text: z.string().min(1, { message: "Option text is required" }),
      isCorrect: z.boolean(),
    })
  ).optional(),
  evaluationRubric: z.array(
    z.object({
      criterion: z.string().min(1, { message: "Criterion is required" }),
      weight: z.number().min(0, { message: "Weight must be at least 0" }).max(100, { message: "Weight must be at most 100" }),
    })
  ).optional(),
});

// Ensure options are complete
const ensureCompleteOptions = (options: any[]) => {
  if (!options) return [];
  return options.map(opt => ({
    id: opt.id || nanoid(),
    text: opt.text || '',
    isCorrect: !!opt.isCorrect
  }));
};

// Ensure evaluation rubric items are valid
const ensureValidEvaluationRubric = (rubric: any[]) => {
  if (!rubric) return [];
  return rubric.map(item => ({
    criterion: item.criterion || '',
    weight: item.weight || 0
  }));
};

const IndividualQuestionForm = () => {
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      questionType: "SINGLE_CORRECT_MCQ",
      question: "",
      explanation: "",
      options: [{ id: nanoid(), text: "", isCorrect: false }],
      evaluationRubric: [{ criterion: "", weight: 0 }],
    },
  });

  const { control } = form;

  const handleQuestionTypeChange = (value: "SINGLE_CORRECT_MCQ" | "MULTIPLE_CORRECT_MCQ" | "SUBJECTIVE") => {
    form.setValue("questionType", value);
    setIsMultipleChoice(value === "MULTIPLE_CORRECT_MCQ");
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "evaluationRubric",
  });

  const handleAddCriterion = () => {
    append({ criterion: "", weight: 0 });
  };

  const handleRemoveCriterion = (index: number) => {
    remove(index);
  };

  const isSubjective = form.watch("questionType") === "SUBJECTIVE";

  const onSubmit = async (data: z.infer<typeof questionSchema>) => {
    try {
      setIsSubmitting(true);
      const teacher = await getLoggedInTeacher();
      
      // Prepare question data with proper types
      const questionData = {
        ...data,
        createdBy: teacher,
        questionType: [data.questionType],
        options: ensureCompleteOptions(data.options),
        evaluationRubric: ensureValidEvaluationRubric(data.evaluationRubric),
      };

      if (data.questionType === "SINGLE_CORRECT_MCQ" || data.questionType === "MULTIPLE_CORRECT_MCQ") {
        if (!data.options || data.options.length < 2) {
          toast({
            title: "Error",
            description: "MCQ questions must have at least two options.",
            variant: "destructive",
          });
          return;
        }

        const correctOptions = data.options.filter((option) => option.isCorrect);
        if (correctOptions.length === 0) {
          toast({
            title: "Error",
            description: "MCQ questions must have at least one correct option.",
            variant: "destructive",
          });
          return;
        }

        await createMCQQuestion(questionData);
        toast({
          title: "Success",
          description: "MCQ question created successfully!",
        });
      } else if (data.questionType === "SUBJECTIVE") {
        await createSubjectiveQuestion(questionData);
        toast({
          title: "Success",
          description: "Subjective question created successfully!",
        });
      }

      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="futuristic-card">
      <CardHeader>
        <CardTitle className="text-lg">Create a New Question</CardTitle>
        <CardDescription>Fill in the details below to create your question.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="questionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Type</FormLabel>
                  <Select onValueChange={(value) => {
                      field.onChange(value);
                      handleQuestionTypeChange(value as "SINGLE_CORRECT_MCQ" | "MULTIPLE_CORRECT_MCQ" | "SUBJECTIVE");
                    }} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a question type" />
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

            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter your question here..." {...field} />
                  </FormControl>
                  <FormDescription>Write the question you want to ask.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("questionType") !== "SUBJECTIVE" && (
              <MCQOptions control={control} isMultipleChoice={isMultipleChoice} />
            )}

            {isSubjective && (
              <div className="space-y-4">
                <FormLabel className="text-base">Evaluation Rubric</FormLabel>
                <p className="text-sm text-gray-500">Add criteria for evaluating the subjective question.</p>
                
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center space-x-3">
                      <FormField
                        control={control}
                        name={`evaluationRubric.${index}.criterion`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Criterion {index + 1}</FormLabel>
                            <FormControl>
                              <Input placeholder="Criterion" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`evaluationRubric.${index}.weight`}
                        render={({ field }) => (
                          <FormItem className="w-24">
                            <FormLabel>Weight (%)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Weight"
                                {...field}
                                onChange={(e) => {
                                  const value = Math.max(0, Math.min(100, Number(e.target.value)));
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemoveCriterion(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <Button 
                    type="button"
                    onClick={handleAddCriterion}
                    size="sm"
                    variant="outline"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Criterion
                  </Button>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="explanation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Explanation</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter the explanation here..." {...field} />
                  </FormControl>
                  <FormDescription>Provide an explanation for the correct answer.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="button-neon">
              {isSubmitting ? "Submitting..." : "Create Question"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default IndividualQuestionForm;
