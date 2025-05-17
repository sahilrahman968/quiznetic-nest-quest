
import React, { useEffect, useRef, useState } from 'react';
import { addStyles, EditableMathField, StaticMathField } from 'react-mathquill';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sigma, Pi, SquareRoot, Function, Brackets, Parentheses } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// Initialize MathQuill
addStyles();

export interface EquationTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onMathChange?: (latex: string) => void;
}

const EquationTextarea = React.forwardRef<HTMLTextAreaElement, EquationTextareaProps>(
  ({ className, onChange, onMathChange, value, ...props }, ref) => {
    const [text, setText] = useState(value as string || '');
    const [isEquationMode, setIsEquationMode] = useState(false);
    const [mathInput, setMathInput] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const combinedRef = (node: HTMLTextAreaElement) => {
      textareaRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    };

    useEffect(() => {
      setText(value as string || '');
    }, [value]);

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
      if (onChange) onChange(e);
    };

    const handleMathChange = (mathField: any) => {
      setMathInput(mathField.latex());
    };

    const insertEquation = () => {
      if (!mathInput.trim()) {
        setIsEquationMode(false);
        return;
      }

      const equationTag = `$$${mathInput}$$`;
      const cursorPosition = textareaRef.current?.selectionStart || text.length;
      const newText = 
        text.substring(0, cursorPosition) + 
        equationTag + 
        text.substring(cursorPosition);
      
      setText(newText);
      
      // Trigger onChange event with new text
      if (onChange) {
        const syntheticEvent = {
          target: { value: newText }
        } as React.ChangeEvent<HTMLTextAreaElement>;
        onChange(syntheticEvent);
      }

      // Also call onMathChange if provided
      if (onMathChange) {
        onMathChange(mathInput);
      }
      
      setIsEquationMode(false);
      setMathInput('');
    };

    const insertTemplate = (template: string) => {
      setMathInput(prev => prev + template);
    };

    return (
      <div className="space-y-2">
        {!isEquationMode ? (
          <>
            <Textarea
              ref={combinedRef}
              className={cn("min-h-24", className)}
              value={text}
              onChange={handleTextareaChange}
              {...props}
            />
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => setIsEquationMode(true)}
              >
                <Sigma className="h-4 w-4 mr-2" />
                Add Equation
              </Button>
            </div>
          </>
        ) : (
          <div className="border rounded-md p-4 space-y-4">
            <div className="flex flex-wrap gap-2 mb-2">
              <Button type="button" variant="outline" size="sm" onClick={() => insertTemplate('\\frac{a}{b}')}>
                <Function className="h-4 w-4 mr-1" /> Fraction
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => insertTemplate('\\sqrt{x}')}>
                <SquareRoot className="h-4 w-4 mr-1" /> Square Root
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => insertTemplate('\\sum_{i=0}^{n}')}>
                <Sigma className="h-4 w-4 mr-1" /> Summation
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => insertTemplate('\\prod_{i=0}^{n}')}>
                <Pi className="h-4 w-4 mr-1" /> Product
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => insertTemplate('\\left(\\right)')}>
                <Parentheses className="h-4 w-4 mr-1" /> Parentheses
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => insertTemplate('\\left[\\right]')}>
                <Brackets className="h-4 w-4 mr-1" /> Brackets
              </Button>
            </div>

            <div className="border rounded p-3 bg-white">
              <EditableMathField
                latex={mathInput}
                onChange={handleMathChange}
                className="w-full p-2"
              />
            </div>

            {mathInput && (
              <div className="p-2 bg-gray-50 rounded-md">
                <p className="text-sm font-medium mb-1">Preview:</p>
                <StaticMathField>{mathInput}</StaticMathField>
              </div>
            )}

            <div className="flex justify-between pt-2">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setIsEquationMode(false);
                  setMathInput('');
                }}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                size="sm"
                onClick={insertEquation}
              >
                Insert Equation
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

EquationTextarea.displayName = "EquationTextarea";

export { EquationTextarea };
