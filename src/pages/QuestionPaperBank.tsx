
import { useEffect, useState } from "react";
import { QuestionPaper, fetchQuestionPapers } from "@/services/api";
import QuestionPaperCard from "@/components/QuestionPaperCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";

const QuestionPaperBank = () => {
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"ALL" | "SUBJECTIVE" | "OBJECTIVE" | "MIXED">("ALL");
  const navigate = useNavigate();

  useEffect(() => {
    const loadPapers = async () => {
      setLoading(true);
      try {
        const data = await fetchQuestionPapers();
        setPapers(data);
      } catch (error) {
        console.error("Error fetching question papers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPapers();
  }, []);

  const filteredPapers = papers
    .filter(p => {
      if (filter === "ALL") return true;
      return p.paperType === filter;
    })
    .filter(p =>
      p.paperTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.board.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.subject.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Question Paper Bank</h1>
        <Button 
          onClick={() => navigate("/create-question-paper")}
          className="bg-chatgpt-green hover:bg-chatgpt-green/90 text-white"
        >
          <Plus className="h-5 w-5 mr-2" /> New Question Paper
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search by title, board, or subject..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="w-full md:w-1/3">
          <Select 
            value={filter}
            onValueChange={(value: "ALL" | "SUBJECTIVE" | "OBJECTIVE" | "MIXED") => setFilter(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter papers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Papers</SelectItem>
              <SelectItem value="SUBJECTIVE">Subjective</SelectItem>
              <SelectItem value="OBJECTIVE">Objective</SelectItem>
              <SelectItem value="MIXED">Mixed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading question papers...</div>
      ) : filteredPapers.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No question papers found</p>
          <Button 
            className="mt-4 bg-chatgpt-green hover:bg-chatgpt-green/90 text-white" 
            onClick={() => navigate("/create-question-paper")}
          >
            Create a Question Paper
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.map(paper => (
            <QuestionPaperCard key={paper._id} paper={paper} />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionPaperBank;
