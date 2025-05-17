
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  renderEquations?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, renderEquations, ...props }, ref) => {
    const [content, setContent] = React.useState(props.value as string || "");
    
    React.useEffect(() => {
      setContent(props.value as string || "");
    }, [props.value]);

    // Function to render math equations using MathJax if enabled
    const renderContent = () => {
      if (!renderEquations || !content) return null;
      
      // Simple regex to identify LaTeX equations between $$ markers
      // This is a basic implementation - a more robust solution would use a proper parser
      const parts = String(content).split(/(\$\$[^$]+\$\$)/g);
      
      return (
        <div className="math-content">
          {parts.map((part, i) => {
            if (part.startsWith("$$") && part.endsWith("$$")) {
              // This is a LaTeX equation
              const equation = part.slice(2, -2);
              return (
                <span key={i} className="math-equation">
                  {/* The equation would be rendered by MathJax */}
                  <span className="text-blue-600">{part}</span>
                </span>
              );
            }
            return <span key={i}>{part}</span>;
          })}
        </div>
      );
    };

    return (
      <>
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {renderEquations && renderContent()}
      </>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
