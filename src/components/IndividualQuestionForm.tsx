
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Button } from "@/components/ui/button";
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
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import {
  Question,
  EvaluationRubric,
  Option,
} from "@/services/api";

const formSchema = z.object({
  questionTitle: z.string().min(2, {
    message: "Question title must be at least 2 characters.",
  }),
  questionType: z.array(z.enum(["SUBJECTIVE", "OBJECTIVE"])).min(1, {
    message: "You have to select at least one question type.",
  }),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  marks: z.number().min(1, {
    message: "Marks must be at least 1.",
  }),
  options: z.array(
    z.object({
      text: z.string(),
      isCorrect: z.boolean(),
    })
  ),
  evaluationRubric: z.array(
    z.object({
      criterion: z.string(),
      weight: z.number(),
      keywordHints: z.array(z.string()),
    })
  ),
});

interface IndividualQuestionFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  initialValues?: Partial<Question>;
  parentId?: string;
  onSuccess?: () => void;
}

const defaultQuestion: Partial<Question> = {
  questionTitle: "",
  images: [],
  difficulty: "MEDIUM",
  questionType: ["SUBJECTIVE"],
  marks: 1,
  options: [],
  source: "USER_GENERATED",
  evaluationRubric: [{ criterion: "", weight: 0, keywordHints: [] }],
  createdBy: {
    id: "teacher1",
    name: "Sahil Bin Asif",
  },
};

const IndividualQuestionForm = ({
  onSubmit,
  initialValues = defaultQuestion,
  parentId,
  onSuccess,
}: IndividualQuestionFormProps) => {
  const [open, setOpen] = useState(false);
  const [questionType, setQuestionType] = useState<("SUBJECTIVE" | "OBJECTIVE")[]>(
    initialValues?.questionType || ["SUBJECTIVE"]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      questionTitle: initialValues?.questionTitle || "",
      questionType: initialValues?.questionType || ["SUBJECTIVE"],
      difficulty: initialValues?.difficulty || "MEDIUM",
      marks: initialValues?.marks || 1,
      options: initialValues?.options || [],
      evaluationRubric: initialValues?.evaluationRubric || [
        { criterion: "", weight: 0, keywordHints: [] },
      ],
    },
  });

  useEffect(() => {
    form.reset({
      questionTitle: initialValues?.questionTitle || "",
      questionType: initialValues?.questionType || ["SUBJECTIVE"],
      difficulty: initialValues?.difficulty || "MEDIUM",
      marks: initialValues?.marks || 1,
      options: initialValues?.options || [],
      evaluationRubric: initialValues?.evaluationRubric || [
        { criterion: "", weight: 0, keywordHints: [] },
      ],
    });
    setQuestionType(initialValues?.questionType || ["SUBJECTIVE"]);
  }, [initialValues, form]);

  const handleQuestionTypeChange = (value: ("SUBJECTIVE" | "OBJECTIVE")[]) => {
    setQuestionType(value);
    form.setValue("questionType", value);
  };

  const addOption = () => {
    form.setValue("options", [...form.getValues("options"), { text: "", isCorrect: false }]);
  };

  const removeOption = (index: number) => {
    const options = [...form.getValues("options")];
    options.splice(index, 1);
    form.setValue("options", options);
  };

  const addRubricItem = () => {
    form.setValue("evaluationRubric", [
      ...form.getValues("evaluationRubric"),
      { criterion: "", weight: 0, keywordHints: [] },
    ]);
  };

  const removeRubricItem = (index: number) => {
    const rubric = [...form.getValues("evaluationRubric")];
    rubric.splice(index, 1);
    form.setValue("evaluationRubric", rubric);
  };

  const onSubmitHandler = (values: z.infer<typeof formSchema>) => {
    if (onSubmit) {
      onSubmit(values);
    }
    if (onSuccess) {
      onSuccess();
    }
    toast({
      title: "Question created successfully!",
      description: "Your question has been saved.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          {initialValues?.questionTitle ? "Edit Question" : "Create Question"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle>
            {initialValues?.questionTitle ? "Edit Question" : "Create Question"}
          </DialogTitle>
          <DialogDescription>
            Make changes to your question here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitHandler)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="questionTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter question title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center space-x-2">
              <FormField
                control={form.control}
                name="questionType"
                render={() => (
                  <FormItem>
                    <FormLabel>Question Type</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={
                          questionType.includes("SUBJECTIVE") ? "default" : "secondary"
                        }
                        onClick={() => {
                          const includes = questionType.includes("SUBJECTIVE");
                          const newTypes = includes
                            ? questionType.filter((type) => type !== "SUBJECTIVE")
                            : [...questionType, "SUBJECTIVE"];
                          handleQuestionTypeChange(newTypes);
                        }}
                        className="cursor-pointer"
                      >
                        Subjective
                      </Badge>
                      <Badge
                        variant={
                          questionType.includes("OBJECTIVE") ? "default" : "secondary"
                        }
                        onClick={() => {
                          const includes = questionType.includes("OBJECTIVE");
                          const newTypes = includes
                            ? questionType.filter((type) => type !== "OBJECTIVE")
                            : [...questionType, "OBJECTIVE"];
                          handleQuestionTypeChange(newTypes);
                        }}
                        className="cursor-pointer"
                      >
                        Objective
                      </Badge>
                    </div>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                name="marks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marks</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter marks"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {questionType.includes("OBJECTIVE") && (
              <>
                <FormLabel>Options</FormLabel>
                <FormDescription>
                  Add options for the question. Mark the correct option(s).
                </FormDescription>
                <Accordion type="multiple">
                  {form.watch("options").map((option, index) => (
                    <AccordionItem value={String(index)} key={index}>
                      <AccordionTrigger>Option {index + 1}</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-4">
                          <FormField
                            control={form.control}
                            name={`options.${index}.text`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Text</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter option text"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`options.${index}.isCorrect`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-sm">
                                    Is Correct?
                                  </FormLabel>
                                  <FormDescription>
                                    Mark if this option is correct.
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeOption(index)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                <Button type="button" onClick={addOption}>
                  Add Option
                </Button>
              </>
            )}

            {questionType.includes("SUBJECTIVE") && (
              <>
                <FormLabel>Evaluation Rubric</FormLabel>
                <FormDescription>
                  Add criteria for evaluating the question.
                </FormDescription>
                <Accordion type="multiple">
                  {form.watch("evaluationRubric").map((rubricItem, index) => (
                    <AccordionItem value={String(index)} key={index}>
                      <AccordionTrigger>Criterion {index + 1}</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-4">
                          <FormField
                            control={form.control}
                            name={`evaluationRubric.${index}.criterion`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Criterion</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter criterion"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`evaluationRubric.${index}.weight`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Weight</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="Enter weight"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`evaluationRubric.${index}.keywordHints`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Keyword Hints</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Enter keyword hints (comma separated)"
                                    value={field.value.join(', ')}
                                    onChange={(e) => field.onChange(e.target.value.split(',').map(item => item.trim()))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeRubricItem(index)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                <Button type="button" onClick={addRubricItem}>
                  Add Criterion
                </Button>
              </>
            )}

            <DialogFooter>
              <Button type="submit">Save changes</Button>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default IndividualQuestionForm;
