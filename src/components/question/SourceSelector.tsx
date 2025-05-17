
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuestionFormData } from "@/hooks/use-question-form";

interface SourceSelectorProps {
  control: Control<QuestionFormData>;
}

const SourceSelector = ({ control }: SourceSelectorProps) => {
  return (
    <FormField
      control={control}
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
  );
};

export default SourceSelector;
