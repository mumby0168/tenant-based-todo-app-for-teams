import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/Layout/AppLayout';
import { NotificationSnackbar } from './components/NotificationSnackbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { queryClient } from './lib/query-client';
import { CreateAccount } from './pages/CreateAccount';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { TodoLists } from './pages/TodoLists';
import { VerifyCode } from './pages/VerifyCode';
import { theme } from './theme/theme';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            {/* Public authentication routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Login />} />
            <Route path="/verify" element={<VerifyCode />} />
            <Route path="/register" element={<CreateAccount />} />
            
            <Route element={<AppLayout />}>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/lists"
                element={
                  <ProtectedRoute>
                    <TodoLists />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/team"
                element={
                  <ProtectedRoute>
                    <div>Team Page (Coming Soon)</div>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <div>Search Page (Coming Soon)</div>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/activity"
                element={
                  <ProtectedRoute>
                    <div>Activity Page (Coming Soon)</div>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <div>Profile Page (Coming Soon)</div>
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/team-settings"
                element={
                  <ProtectedRoute>
                    <div>Team Settings Page (Coming Soon)</div>
                  </ProtectedRoute>
                }
              />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <NotificationSnackbar />
        <ReactQueryDevtools  buttonPosition='bottom-left' initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;