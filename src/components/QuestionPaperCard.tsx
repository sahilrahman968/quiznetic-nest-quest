
import { QuestionPaper } from "@/services/api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface QuestionPaperCardProps {
  paper: QuestionPaper;
}

const QuestionPaperCard = ({ paper }: QuestionPaperCardProps) => {
  // Helper function to generate placeholder background colors
  const getColorClass = (id: string) => {
    const colors = [
      "bg-blue-100",
      "bg-green-100",
      "bg-purple-100",
      "bg-amber-100",
      "bg-rose-100",
      "bg-cyan-100",
    ];
    const index = paper.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className={`${getColorClass(paper.id)} p-4 flex items-center justify-center h-40`}>
        <div className="text-center">
          <FileText className="h-16 w-16 mx-auto text-gray-700" />
          <p className="font-medium mt-2 text-gray-800">{paper.paperType} Paper</p>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2 line-clamp-2">{paper.paperTitle}</CardTitle>
        <div className="space-y-2 text-sm text-gray-600">
          <p className="flex items-center gap-1">
            <Book className="h-4 w-4" /> 
            {paper.board.name} • {paper.class.name} • {paper.subject.name}
          </p>
          <p>Year: {paper.year}</p>
          <p>Duration: {paper.timeDuration} {paper.timeDuration === 1 ? "hour" : "hours"}</p>
          <p>Total Marks: {paper.totalMarks}</p>
        </div>

        <div className="flex flex-wrap gap-1 mt-3">
          <Badge variant="outline" className="text-xs">
            Questions: {paper.questions.length}
          </Badge>
          
          {paper.difficulty.easy > 0 && (
            <Badge variant="outline" className="bg-green-50 text-green-700 text-xs border-green-200">
              {paper.difficulty.easy}% Easy
            </Badge>
          )}
          {paper.difficulty.medium > 0 && (
            <Badge variant="outline" className="bg-orange-50 text-orange-700 text-xs border-orange-200">
              {paper.difficulty.medium}% Medium
            </Badge>
          )}
          {paper.difficulty.hard > 0 && (
            <Badge variant="outline" className="bg-red-50 text-red-700 text-xs border-red-200">
              {paper.difficulty.hard}% Hard
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="px-4 py-2 text-xs text-gray-500 border-t">
        Created {formatDistanceToNow(new Date(paper.createdAt), { addSuffix: true })}
      </CardFooter>
    </Card>
  );
};

export default QuestionPaperCard;
