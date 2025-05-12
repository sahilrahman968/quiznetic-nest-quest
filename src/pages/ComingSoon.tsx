
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <Card className="w-full max-w-md border border-chatgpt-border rounded-lg shadow-sm">
        <CardHeader className="border-b border-chatgpt-border text-center">
          <div className="flex justify-center mb-4">
            <Clock className="h-16 w-16 text-chatgpt-green" />
          </div>
          <CardTitle className="text-2xl text-chatgpt-text">Coming Soon</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <p className="text-chatgpt-lightText">
              We're working hard to bring this feature to you. Please check back later!
            </p>
            <Button 
              onClick={() => navigate("/")}
              className="bg-chatgpt-green hover:bg-chatgpt-green/90 text-white font-medium rounded-md"
            >
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComingSoon;
