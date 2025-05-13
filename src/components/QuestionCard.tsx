
import { useState } from "react";
import { Question } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

interface QuestionCardProps {
  question: Question;
}

const QuestionCard = ({ question }: QuestionCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const renderImages = (images: string[] | undefined) => {
    if (!images || images.length === 0) return null;

    return (
      <div className="mt-4">
        <h4 className="font-medium mb-2">Images:</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {images.map((imageUrl, index) => (
            <div key={index} className="aspect-square bg-gray-100 rounded flex items-center justify-center overflow-hidden">
              <img
                src={imageUrl}
                alt={`Image ${index + 1}`}
                className="object-contain w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderOptions = (options: Question["options"]) => {
    if (!options || options.length === 0) return null;

    return (
      <div className="mt-4">
        <h4 className="font-medium">Options:</h4>
        <ul className="list-disc pl-5 space-y-1">
          {options.map((option, index) => (
            <li key={index} className={option.isCorrect ? "text-green-600 font-medium" : ""}>
              {option.text}
              {option.isCorrect && " (Correct)"}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderEvaluationRubric = (rubrics: Question["evaluationRubric"]) => {
    if (!rubrics || rubrics.length === 0) return null;

    return (
      <div className="mt-4">
        <h4 className="font-medium">Evaluation Rubric:</h4>
        <ul className="list-disc pl-5 space-y-1">
          {rubrics.map((rubric, index) => (
            <li key={index}>
              {rubric.criterion} (Weight: {rubric.weight})
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderChildQuestions = (children: Question[] | undefined) => {
    if (!children || children.length === 0) return null;

    return (
      <div className="mt-6 space-y-4">
        <h4 className="text-lg font-medium">Child Questions:</h4>
        {children.map(child => (
          <Card key={child.id} className="border-gray-200">
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">Q: {child.questionTitle}</p>
                    <Badge variant="outline">Marks: {child.marks}</Badge>
                    <Badge variant="outline">{child.difficulty}</Badge>
                  </div>

                  <div className="flex gap-2 mt-2">
                    {child.questionType.map(type => (
                      <Badge key={type} className="bg-blue-100 text-blue-800 border-blue-300">
                        {type.replace(/_/g, " ")}
                      </Badge>
                    ))}
                  </div>
                </div>

                {renderImages(child.images)}
                {renderOptions(child.options)}
                {renderEvaluationRubric(child.evaluationRubric)}

                <div className="text-sm text-gray-500">
                  Created by: {child.createdBy?.name || "Unknown"} | Source: {child.source}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle>{question.questionTitle}</CardTitle>
            {question.hasChild ? (
              <>
                <CardDescription>Nested Question with {question.childQuestions?.length || 0} sub-questions</CardDescription>
                {renderImages(question.images)}
              </>
            ) : (
              <div className="flex gap-2 mt-1">
                <Badge variant="outline">Marks: {question.marks}</Badge>
                <Badge variant="outline">{question.difficulty}</Badge>
              </div>
            )}
          </div>
          {question.hasChild && (
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? "Hide Details" : "Show Details"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!question.hasChild && (
          <>
            <div className="flex gap-2 my-2">
              {question.questionType.map(type => (
                <Badge key={type} className="bg-blue-100 text-blue-800 border-blue-300">
                  {type.replace(/_/g, " ")}
                </Badge>
              ))}
            </div>

            {renderImages(question.images)}
            {renderOptions(question.options)}
            {renderEvaluationRubric(question.evaluationRubric)}

            {question.syllabusMapping && (
              <div className="mt-4 text-sm">
                <p>Syllabus: {question.syllabusMapping.board.name} &gt; {question.syllabusMapping.class.name} &gt; {question.syllabusMapping.subject.name}</p>
              </div>
            )}
          </>
        )}

        <div className="text-sm text-gray-500 mt-2">
          Created by: {question.createdBy?.name || "Unknown"} | Source: {question.source}
        </div>

        {question.hasChild && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleContent>
              {renderChildQuestions(question.childQuestions)}
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
