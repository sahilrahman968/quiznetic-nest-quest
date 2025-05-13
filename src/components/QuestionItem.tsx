
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { QuestionItem as QuestionItemType } from "@/types/questionPaper";

interface QuestionItemProps {
  question: QuestionItemType;
  index: number;
  sectionIndex?: number;
}

const QuestionItem = ({ question, index, sectionIndex }: QuestionItemProps) => {
  const { questionTitle, marks, difficulty, questionType, childQuestions } = question;

  const questionNumber = sectionIndex ? `${sectionIndex}.${index + 1}` : `${index + 1}`;

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold flex items-start">
            <span className="mr-2">{questionNumber}.</span>
            <span>{questionTitle}</span>
          </h3>
          <Badge variant="outline" className="ml-2">{marks} mark{marks > 1 ? 's' : ''}</Badge>
        </div>
        
        {question.hasChild && childQuestions && childQuestions.length > 0 && (
          <div className="pl-8 mt-4 space-y-3 border-l-2 border-gray-200">
            {childQuestions.map((childQuestion, childIndex) => (
              <div key={childQuestion.id} className="relative">
                <div className="flex justify-between items-start">
                  <h4 className="flex items-start">
                    <span className="mr-2 text-gray-600">{String.fromCharCode(97 + childIndex)})</span>
                    <span>{childQuestion.questionTitle}</span>
                  </h4>
                  <Badge variant="outline" className="ml-2">{childQuestion.marks} mark{childQuestion.marks > 1 ? 's' : ''}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="secondary">{difficulty}</Badge>
          {questionType.map((type, i) => (
            <Badge key={i} className="bg-blue-100 text-blue-800 border-blue-300">
              {type.replace(/_/g, " ")}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionItem;
