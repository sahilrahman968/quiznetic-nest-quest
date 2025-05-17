
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import ImageUpload from "@/components/ImageUpload";
import { QuestionFormData } from "@/hooks/use-question-form";

interface QuestionImageUploadProps {
  control: Control<QuestionFormData>;
}

const QuestionImageUpload = ({ control }: QuestionImageUploadProps) => {
  return (
    <FormField
      control={control}
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
  );
};

export default QuestionImageUpload;
