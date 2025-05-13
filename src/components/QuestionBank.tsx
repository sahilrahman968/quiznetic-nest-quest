
import { useEffect, useState } from "react";
import { Question, fetchQuestions } from "@/services/api";
import QuestionCard from "@/components/QuestionCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const QuestionBank = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"ALL" | "SINGLE" | "NESTED">("ALL");

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      try {
        const data = await fetchQuestions();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const filteredQuestions = questions
    .filter(q => {
      if (filter === "ALL") return true;
      if (filter === "NESTED") return q.hasChild === true;
      return q.hasChild !== true;
    })
    .filter(q => 
      q.questionTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Question Bank</h1>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3">
          <Input
            placeholder="Search questions..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-1/3">
          <Select 
            value={filter}
            onValueChange={(value: "ALL" | "SINGLE" | "NESTED") => setFilter(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter questions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Questions</SelectItem>
              <SelectItem value="SINGLE">Individual Questions</SelectItem>
              <SelectItem value="NESTED">Nested Questions</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading questions...</div>
      ) : filteredQuestions.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No questions found</p>
          <Button className="mt-4" onClick={() => window.location.href = "/create-question"}>
            Create a Question
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredQuestions.map(question => (
            <QuestionCard key={question._id || question.id} question={question} />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionBank;
