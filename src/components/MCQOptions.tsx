
import { useState } from "react";
import { Control, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Option } from "@/services/api";

interface MCQOptionsProps {
  control: Control<any>;
  isMultipleChoice: boolean;
}

const MCQOptions = ({ control, isMultipleChoice }: MCQOptionsProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const addOption = () => {
    append({ id: String(fields.length + 1), text: "", isCorrect: false });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Options</h3>
        <Button type="button" onClick={addOption} size="sm">
          Add Option
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="flex items-start space-x-2 border p-3 rounded-md">
          <FormField
            control={control}
            name={`options.${index}.isCorrect`}
            render={({ field: checkboxField }) => (
              <FormItem className="flex items-start space-x-3 space-y-0 mt-2">
                <FormControl>
                  <Checkbox 
                    checked={checkboxField.value}
                    onCheckedChange={(checked) => {
                      // If single choice MCQ, uncheck all others
                      if (!isMultipleChoice && checked) {
                        // We need to get all current options and uncheck them
                        const currentOptions = control._formValues.options || [];
                        currentOptions.forEach((_, i: number) => {
                          if (i !== index) {
                            control._fields.options.update(i, { isCorrect: false });
                          }
                        });
                      }
                      checkboxField.onChange(checked);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`options.${index}.text`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder={`Option ${index + 1}`} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="button" 
            variant="destructive" 
            size="sm"
            onClick={() => remove(index)}
          >
            Remove
          </Button>
        </div>
      ))}

      {fields.length === 0 && (
        <p className="text-sm text-muted-foreground">No options added yet. Click "Add Option" to create options.</p>
      )}
    </div>
  );
};

export default MCQOptions;
