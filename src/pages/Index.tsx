
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-duolingo-light">
      <Card className="w-full max-w-md border-2 border-duolingo-green rounded-2xl shadow-lg">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-2xl text-duolingo-green">Question Management System</CardTitle>
          <CardDescription>Create and manage questions for exams and assessments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <p>This system allows teachers to:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Create individual questions (MCQ or subjective)</li>
            <li>Create nested questions with multiple parts</li>
            <li>Manage a question bank</li>
            <li>Organize questions by syllabus mapping</li>
          </ul>
        </CardContent>
        <CardFooter>
          {isAuthenticated ? (
            <div className="flex gap-4 w-full">
              <Button onClick={() => navigate("/questions")} className="flex-1 bg-duolingo-green hover:bg-duolingo-green/90 rounded-xl text-white font-bold">
                Question Bank
              </Button>
              <Button onClick={() => navigate("/create-question")} className="flex-1 bg-duolingo-blue hover:bg-duolingo-blue/90 rounded-xl text-white font-bold">
                Create Question
              </Button>
            </div>
          ) : (
            <Button onClick={() => navigate("/login")} className="w-full bg-duolingo-green hover:bg-duolingo-green/90 rounded-xl text-white font-bold py-3">
              Login to Get Started
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Index;
