import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage/landingPage";
import Register from "./pages/register/register";
import SignIn from "./pages/signIn/signIn";
import BusinessForm from "./pages/businessForm/businessForm";
import ProtectedRoute from "./components/ProtectedRoute";
import TrendPage from "./pages/trendPage/trendPage";
import SuggestionPage from "./pages/suggestionsPage/suggestionsPage";
import Profile from "./pages/profile/profile";
import ProgressPage from "./pages/ProgressPage/ProgressPage";
import VideoTemplateGenerator from "./pages/videoTemplateGenerator/videoTemplateGenerator";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signIn" element={<SignIn />} />
        <Route
          path="/businessForm"
          element={
            <ProtectedRoute>
              <BusinessForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/suggestionsPage"
          element={
            <ProtectedRoute>
              <SuggestionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trendPage/:id"
          element={
            <ProtectedRoute>
              <TrendPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/videoGenerate"
          element={
            <ProtectedRoute>
              <VideoTemplateGenerator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/progressPage"
          element={
            <ProtectedRoute>
              <ProgressPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
