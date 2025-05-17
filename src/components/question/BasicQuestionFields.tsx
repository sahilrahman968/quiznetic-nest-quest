
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EquationTextarea } from "@/components/ui/equation-textarea";
import { QuestionFormData } from "@/hooks/use-question-form";

interface BasicQuestionFieldsProps {
  control: Control<QuestionFormData>;
}

const BasicQuestionFields = ({ control }: BasicQuestionFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
        name="questionTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Question Title</FormLabel>
            <FormControl>
              <EquationTextarea placeholder="Enter your question here..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={control}
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
          control={control}
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
          control={control}
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
    </>
  );
};

export default BasicQuestionFields;
