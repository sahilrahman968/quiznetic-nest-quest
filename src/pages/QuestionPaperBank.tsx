
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchQuestionPapers } from "@/services/questionPaperApi";
import QuestionPaperCard from "@/components/QuestionPaperCard";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { FileText } from "lucide-react";

const ITEMS_PER_PAGE = 9;

const QuestionPaperBank = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: questionPapers = [], isLoading, isError } = useQuery({
    queryKey: ["questionPapers"],
    queryFn: fetchQuestionPapers
  });
  
  // Filter question papers based on search term
  const filteredPapers = questionPapers.filter(paper => 
    paper.paperTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paper.subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paper.board.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredPapers.length / ITEMS_PER_PAGE);
  const paginatedPapers = filteredPapers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold">Question Paper Bank</h1>
        <div className="relative w-full md:w-72">
          <Input
            type="text"
            placeholder="Search by title, subject, board..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on new search
            }}
            className="pl-8"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 absolute left-2.5 top-3 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-chatgpt-green border-opacity-50 rounded-full border-t-transparent"></div>
        </div>
      ) : isError ? (
        <div className="bg-red-50 p-4 rounded-md text-center">
          <p className="text-red-600">Failed to load question papers. Please try again later.</p>
        </div>
      ) : filteredPapers.length === 0 ? (
        <div className="bg-gray-50 p-12 rounded-md text-center flex flex-col items-center">
          <FileText className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No question papers found.</p>
          {searchTerm && (
            <p className="text-gray-400 mt-2">
              Try adjusting your search query.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedPapers.map((paper) => (
            <QuestionPaperCard key={paper.id} questionPaper={paper} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredPapers.length > ITEMS_PER_PAGE && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} 
              />
            </PaginationItem>
            
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink 
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} 
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default QuestionPaperBank;
