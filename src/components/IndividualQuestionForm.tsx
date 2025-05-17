
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useQuestionForm } from "@/hooks/use-question-form";
import BasicQuestionFields from "@/components/question/BasicQuestionFields";
import SourceSelector from "@/components/question/SourceSelector";
import QuestionImageUpload from "@/components/question/QuestionImageUpload";
import MCQOptions from "@/components/MCQOptions";
import EvaluationRubric from "@/components/EvaluationRubric";
import SyllabusMapping from "@/components/SyllabusMapping";
import { handleQuestionSubmission } from "@/utils/question-submission";

interface IndividualQuestionFormProps {
  parentId?: string;
  onSubmit?: (data: any) => void;
  onSuccess?: () => void;
}

const IndividualQuestionForm = ({ parentId, onSubmit, onSuccess }: IndividualQuestionFormProps) => {
  const { form, isMCQ, isMultipleChoice } = useQuestionForm(parentId);
  const questionType = form.watch("questionType");

  useEffect(() => {
    // Reset options or evaluation rubric when question type changes
    if (isMCQ) {
      form.setValue("evaluationRubric", []);
    } else {
      form.setValue("options", []);
    }
  }, [questionType, form, isMCQ]);

  const handleSubmit = async (data: any) => {
    // Handle custom onSubmit if provided
    if (onSubmit) {
      onSubmit(data);
      return;
    }

    const success = await handleQuestionSubmission(data, onSuccess);
    
    if (success) {
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
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <BasicQuestionFields control={form.control} />
        <SourceSelector control={form.control} />
        <QuestionImageUpload control={form.control} />

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
