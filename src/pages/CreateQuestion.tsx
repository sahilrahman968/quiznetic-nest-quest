
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IndividualQuestionForm from "@/components/IndividualQuestionForm";
import NestedQuestionForm from "@/components/NestedQuestionForm";

const CreateQuestion = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create Question</h1>

      <Tabs defaultValue="individual" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-sm">
          <TabsTrigger value="individual">Individual Question</TabsTrigger>
          <TabsTrigger value="nested">Nested Question</TabsTrigger>
        </TabsList>
        <TabsContent value="individual" className="pt-4">
          <IndividualQuestionForm onSuccess={() => console.log("Question created successfully")} />
        </TabsContent>
        <TabsContent value="nested" className="pt-4">
          <NestedQuestionForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateQuestion;
