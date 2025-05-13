
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Question, createQuestion, getTeacher } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import IndividualQuestionForm from "./IndividualQuestionForm";
import ImageUpload from "./ImageUpload";

const parentQuestionSchema = z.object({
  questionTitle: z.string().min(1, "Parent question title is required"),
  source: z.enum(["AI_GENERATED", "USER_GENERATED"]),
  images: z.array(z.string()).default([]),
});

type ParentQuestionFormData = z.infer<typeof parentQuestionSchema>;

const NestedQuestionForm = () => {
  const [parentQuestion, setParentQuestion] = useState<Question | null>(null);
  const [childQuestionsCount, setChildQuestionsCount] = useState(0);

  const form = useForm<ParentQuestionFormData>({
    resolver: zodResolver(parentQuestionSchema),
    defaultValues: {
      questionTitle: "",
      source: "USER_GENERATED",
      images: [],
    },
  });

  const onCreateParent = async (data: ParentQuestionFormData) => {
    try {
      const teacher = getTeacher();
      if (!teacher) {
        toast({
          title: "Error",
          description: "You must be logged in to create questions",
          variant: "destructive",
        });
        return;
      }

      const questionData = {
        ...data,
        hasChild: true,
        childIds: [],
        childQuestions: [],
        createdBy: teacher,
        difficulty: "MEDIUM", // Default difficulty
        questionType: ["SUBJECTIVE"], // Default question type
        marks: 0, // Parent questions don't have marks
        options: [],
        evaluationRubric: []
      };

      const response = await createQuestion(questionData as Question);
      setParentQuestion(response);
      
      toast({
        title: "Success",
        description: "Parent question created successfully",
      });

      // Reset the form
      form.reset();
    } catch (error) {
      console.error("Error creating parent question:", error);
    }
  };

  const handleChildQuestionSuccess = () => {
    setChildQuestionsCount(prev => prev + 1);
    toast({
      title: "Success",
      description: "Child question added successfully",
    });
  };

  const startNewNestedQuestion = () => {
    setParentQuestion(null);
    setChildQuestionsCount(0);
  };

  // Mock implementation for child question creation
  const handleCreateChildQuestion = (data: any) => {
    console.log("Child question data:", data);
    handleChildQuestionSuccess();
  };

  return (
    <div className="space-y-6">
      {!parentQuestion ? (
        <>
          <h2 className="text-xl font-semibold">Create Parent Question</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onCreateParent)} className="space-y-6">
              <FormField
                control={form.control}
                name="questionTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent Question Title</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter the parent question here..." {...field} className="min-h-24" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <FormField
                control={form.control}
                name="images"
                render={() => (
                  <FormItem>
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <ImageUpload fieldName="images" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Create Parent Question
              </Button>
            </form>
          </Form>
        </>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Parent Question</h3>
                <p className="text-gray-700">{parentQuestion.questionTitle}</p>
                {parentQuestion.images && parentQuestion.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                    {parentQuestion.images.map((imageKey, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                        <img 
                          src={imageKey}
                          alt={`Image ${index + 1}`}
                          className="object-contain w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Add Child Question {childQuestionsCount + 1}</h2>
              <Button onClick={startNewNestedQuestion} variant="outline">
                New Nested Question
              </Button>
            </div>

            <IndividualQuestionForm 
              onSubmit={handleCreateChildQuestion}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NestedQuestionForm;
