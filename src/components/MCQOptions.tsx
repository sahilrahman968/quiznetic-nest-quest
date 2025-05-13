
import { useState } from "react";
import { Control, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PlusCircle, X } from "lucide-react";

interface Option {
  id?: string;
  text: string;
  isCorrect: boolean;
}

interface MCQOptionsProps {
  control: Control<any>;
  isMultipleChoice: boolean;
}

const MCQOptions = ({ control, isMultipleChoice }: MCQOptionsProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const [newOptionText, setNewOptionText] = useState("");

  const handleAddOption = () => {
    if (!newOptionText.trim()) return;
    
    append({
      id: Math.random().toString(36).substring(2, 9), // Simple ID generator instead of nanoid
      text: newOptionText,
      isCorrect: false,
    });
    
    setNewOptionText("");
  };

  return (
    <div className="space-y-4">
      <FormLabel className="text-base">Options</FormLabel>
      <p className="text-sm text-gray-500">
        {isMultipleChoice 
          ? "Add options and mark all correct answers (multiple can be selected)" 
          : "Add options and mark one as the correct answer"}
      </p>
      
      <div className="space-y-3">
        {fields.map((field, index) => (
          <FormItem key={field.id} className="flex items-center space-x-3">
            <FormControl>
              <Checkbox 
                checked={(field as unknown as Option).isCorrect} 
                onCheckedChange={(checked) => {
                  const value = typeof checked === "boolean" ? checked : false;
                  
                  if (!isMultipleChoice && value) {
                    // For single choice, uncheck all other options
                    for (let i = 0; i < fields.length; i++) {
                      if (i !== index) {
                        const options = control._formValues.options as Option[];
                        if (options && options[i]) {
                          options[i].isCorrect = false;
                        }
                      }
                    }
                  }
                  
                  const options = control._formValues.options as Option[];
                  if (options && options[index]) {
                    options[index].isCorrect = value;
                  }
                  
                  // Update the form state
                  control._updateFormState({ isDirty: true });
                }} 
              />
            </FormControl>
            <Input
              defaultValue={(field as unknown as Option).text}
              className="flex-1"
              onChange={(e) => {
                const options = control._formValues.options as Option[];
                if (options && options[index]) {
                  options[index].text = e.target.value;
                }
                // Update the form state
                control._updateFormState({ isDirty: true });
              }}
            />
            <Button 
              type="button"
              size="icon"
              variant="ghost" 
              onClick={() => remove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </FormItem>
        ))}

        <div className="flex items-center space-x-2">
          <Input
            placeholder="Add a new option..."
            value={newOptionText}
            onChange={(e) => setNewOptionText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddOption();
              }
            }}
          />
          <Button 
            type="button"
            onClick={handleAddOption}
            size="icon"
            variant="outline"
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {fields.length === 0 && (
        <FormMessage>At least one option is required</FormMessage>
      )}
    </div>
  );
};

export default MCQOptions;
