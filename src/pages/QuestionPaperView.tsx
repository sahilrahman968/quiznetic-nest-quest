
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchQuestionPaperById } from "@/services/questionPaperApi";
import QuestionItem from "@/components/QuestionItem";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, FileText, Book } from "lucide-react";

const QuestionPaperView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: questionPaper, isLoading, isError } = useQuery({
    queryKey: ["questionPaper", id],
    queryFn: () => fetchQuestionPaperById(id || ""),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-chatgpt-green border-opacity-50 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (isError || !questionPaper) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => navigate("/question-papers")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Question Papers
        </Button>
        <div className="bg-red-50 p-4 rounded-md text-center">
          <p className="text-red-600">Failed to load question paper. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Group questions by section
  const questionsBySection = questionPaper.questions.reduce((acc, question) => {
    const sectionKey = `Section ${question.sectionOrder || 1}`;
    
    if (!acc[sectionKey]) {
      acc[sectionKey] = [];
    }
    
    acc[sectionKey].push(question);
    return acc;
  }, {} as Record<string, typeof questionPaper.questions>);

  // Sort questions within each section by questionOrder
  Object.keys(questionsBySection).forEach(section => {
    questionsBySection[section].sort((a, b) => 
      (a.questionOrder || 0) - (b.questionOrder || 0)
    );
  });

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => navigate("/question-papers")}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Question Papers
      </Button>

      <div className="bg-white rounded-lg shadow-sm p-6 border">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-chatgpt-green text-white rounded-full p-2">
              <FileText className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">{questionPaper.paperTitle}</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Board</div>
              <div>{questionPaper.board.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Class</div>
              <div>{questionPaper.class.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Subject</div>
              <div>{questionPaper.subject.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Year</div>
              <div>{questionPaper.year}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {questionPaper.timeDuration} hours
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Book className="h-3 w-3" />
              {questionPaper.totalMarks} marks
            </Badge>
            {Object.entries(questionPaper.difficulty).filter(([key]) => key !== '_id').map(
              ([level, percentage]) => percentage > 0 && (
                <Badge key={level} className={`${level === 'easy' ? 'bg-green-100 text-green-800' : level === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                  {level}: {percentage}%
                </Badge>
              )
            )}
          </div>

          {questionPaper.instructions && questionPaper.instructions.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Instructions:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {questionPaper.instructions.map((instruction, i) => (
                  <li key={i}>{instruction}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {Object.keys(questionsBySection).map((section, sectionIndex) => (
          <div key={section} className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">{section}</h2>
              <Separator className="my-2" />
            </div>
            
            {questionsBySection[section].map((question, index) => (
              <QuestionItem 
                key={question.id} 
                question={question} 
                index={index} 
                sectionIndex={sectionIndex + 1} 
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionPaperView;
