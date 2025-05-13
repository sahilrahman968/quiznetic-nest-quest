
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { QuestionPaper } from "@/types/questionPaper";
import { Book, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuestionPaperCardProps {
  questionPaper: QuestionPaper;
}

const QuestionPaperCard = ({ questionPaper }: QuestionPaperCardProps) => {
  const { id, paperTitle, board, subject, class: classInfo, year, timeDuration, totalMarks, questions } = questionPaper;
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/question-papers/${id}`);
  };
  
  return (
    <Card 
      className="w-full h-full hover:shadow-md transition-shadow cursor-pointer" 
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold line-clamp-2">{paperTitle}</CardTitle>
          <div className="bg-chatgpt-green text-white rounded-full p-1.5">
            <FileText className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div className="flex items-center">
            <span className="font-medium">Board:</span>
            <span className="ml-1">{board.name}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium">Class:</span>
            <span className="ml-1">{classInfo.name}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium">Subject:</span>
            <span className="ml-1">{subject.name}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium">Year:</span>
            <span className="ml-1">{year}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t flex justify-between py-2 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span className="flex items-center">
            <Book className="h-4 w-4 mr-1 text-chatgpt-green" />
            {questions.length} Questions
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>{timeDuration} hrs</span>
          <span className="mx-1">•</span>
          <span>{totalMarks} marks</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default QuestionPaperCard;
