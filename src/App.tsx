
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import CreateQuestion from "./pages/CreateQuestion";
import QuestionBank from "./pages/QuestionBank";
import Layout from "./components/Layout";
import ComingSoon from "./pages/ComingSoon";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <Layout>
          <Index />
        </Layout>
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/questions" element={
        <ProtectedRoute>
          <Layout>
            <QuestionBank />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/create-question" element={
        <ProtectedRoute>
          <Layout>
            <CreateQuestion />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/question-papers" element={
        <ProtectedRoute>
          <Layout>
            <ComingSoon feature="Question Paper Bank" />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/create-question-paper" element={
        <ProtectedRoute>
          <Layout>
            <ComingSoon feature="Create Question Paper" />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
