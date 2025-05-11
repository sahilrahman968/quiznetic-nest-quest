
import { useFieldArray, Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface EvaluationRubricProps {
  control: Control<any>;
}

interface EvaluationCriterion {
  criterion: string;
  weight: number;
}

const EvaluationRubric = ({ control }: EvaluationRubricProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "evaluationRubric",
  });

  const addCriterion = () => {
    append({ criterion: "", weight: 1 });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Evaluation Rubric</h3>
        <Button type="button" onClick={addCriterion} size="sm">
          Add Criterion
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="border p-3 rounded-md space-y-3">
          <FormField
            control={control}
            name={`evaluationRubric.${index}.criterion`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Criterion</FormLabel>
                <FormControl>
                  <Input placeholder="E.g., Understanding of the concept" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`evaluationRubric.${index}.weight`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={1} 
                    max={10} 
                    {...field} 
                    onChange={e => field.onChange(parseInt(e.target.value) || 1)}
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
            onClick={() => remove(index)}
            className="mt-2"
          >
            Remove Criterion
          </Button>
        </div>
      ))}

      {fields.length === 0 && (
        <p className="text-sm text-muted-foreground">No criteria added yet. Click "Add Criterion" to create evaluation criteria.</p>
      )}
    </div>
  );
};

export default EvaluationRubric;
