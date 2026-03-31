import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AppProvider } from '@/contexts/AppContext';
import AuthPage from '@/pages/AuthPage';
import HomePage from '@/pages/HomePage';
import AnalysisPage from '@/pages/AnalysisPage';
import ComparePage from '@/pages/ComparePage';
import WorldCupPage from '@/pages/WorldCupPage';
import TeamsPage from '@/pages/TeamsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 2, retry: 1 },
  },
});

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route path="/auth" element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />} />
      <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
      <Route path="/analysis" element={<PrivateRoute><AnalysisPage /></PrivateRoute>} />
      <Route path="/compare" element={<PrivateRoute><ComparePage /></PrivateRoute>} />
      <Route path="/worldcup" element={<PrivateRoute><WorldCupPage /></PrivateRoute>} />
      <Route path="/teams" element={<PrivateRoute><TeamsPage /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/*
          Provider order matters:
          ThemeProvider → AppProvider (reads useTheme) → BrowserRouter
        */}
        <ThemeProvider>
          <AppProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AppProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
