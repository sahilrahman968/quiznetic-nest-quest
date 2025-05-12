
import { FileText } from "lucide-react";

interface ComingSoonProps {
  feature: string;
}

const ComingSoon = ({ feature }: ComingSoonProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-duolingo-yellow/20 w-20 h-20 rounded-full flex items-center justify-center mb-6">
        <FileText className="w-10 h-10 text-duolingo-green" />
      </div>
      <h1 className="text-3xl font-bold text-duolingo-green mb-4">{feature}</h1>
      <p className="text-center text-gray-600 max-w-md mb-6">
        This feature is under development and will be available soon. Thank you for your patience!
      </p>
      <div className="bg-duolingo-yellow/20 rounded-lg p-4 max-w-md">
        <p className="text-center text-sm text-gray-500">
          We're working hard to bring you the best experience. Check back soon!
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
