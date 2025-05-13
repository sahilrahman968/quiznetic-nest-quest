
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import CreateQuestion from "./pages/CreateQuestion";
import QuestionBank from "./pages/QuestionBank";
import QuestionPaperBank from "./pages/QuestionPaperBank";
import QuestionPaperView from "./pages/QuestionPaperView";
import ComingSoon from "./pages/ComingSoon";
import Layout from "./components/Layout";

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
      <Route path="/coming-soon" element={
        <ProtectedRoute>
          <Layout>
            <ComingSoon />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/question-papers" element={
        <ProtectedRoute>
          <Layout>
            <QuestionPaperBank />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/question-papers/:id" element={
        <ProtectedRoute>
          <Layout>
            <QuestionPaperView />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/create-question-paper" element={
        <ProtectedRoute>
          <Layout>
            <ComingSoon />
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
        <SidebarProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </SidebarProvider>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
