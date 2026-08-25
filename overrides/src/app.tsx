import { Suspense } from "react";
import { lazyWithRetry } from "@/lib/lazyWithRetry";
import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";

import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";
import LoadingScreen from "@/components/LoadingScreen";

// Business pages — lazy loaded for code splitting (better mobile navigation)
const HomePage = lazyWithRetry(() => import("@/pages/HomePage/HomePage"));
const BrowsePage = lazyWithRetry(() => import("@/pages/BrowsePage/BrowsePage"));
const SentenceDetailPage = lazyWithRetry(() => import("@/pages/SentenceDetailPage/SentenceDetailPage"));
const FlashcardPage = lazyWithRetry(() => import("@/pages/FlashcardPage/FlashcardPage"));
const QuizPage = lazyWithRetry(() => import("@/pages/QuizPage/QuizPage"));
const ProgressPage = lazyWithRetry(() => import("@/pages/ProgressPage/ProgressPage"));
const ScenarioPracticePage = lazyWithRetry(() => import("@/pages/ScenarioPracticePage/ScenarioPracticePage"));
const FavoritesPage = lazyWithRetry(() => import("@/pages/FavoritesPage/FavoritesPage"));
const CustomScenarioPracticePage = lazyWithRetry(() => import("@/pages/CustomScenarioPracticePage/CustomScenarioPracticePage"));
const AIChatPage = lazyWithRetry(() => import("@/pages/AIChatPage/AIChatPage"));
const WrongBookPage = lazyWithRetry(() => import("@/pages/WrongBookPage/WrongBookPage"));
const ScenarioListPage = lazyWithRetry(() => import("@/pages/ScenarioListPage/ScenarioListPage"));
const TextAnalysisPage = lazyWithRetry(() => import("@/pages/TextAnalysisPage/TextAnalysisPage"));
const AlarmEnglishPage = lazyWithRetry(() => import("@/pages/AlarmEnglishPage/AlarmEnglishPage"));

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
    <Routes>
      {/* Personal edition: all learning features are available without an account. */}
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/register" element={<Navigate to="/" replace />} />

      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="scenarios" element={<ScenarioListPage />} />
        <Route path="browse" element={<BrowsePage />} />
        <Route path="browse/:id" element={<SentenceDetailPage />} />
        <Route path="flashcard" element={<FlashcardPage />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="progress" element={<ProgressPage />} />
        <Route path="scenario/:sectionIndex" element={<ScenarioPracticePage />} />
        <Route path="text-analysis" element={<TextAnalysisPage />} />
        <Route path="alarms" element={<AlarmEnglishPage />} />
        <Route path="wrong-book" element={<WrongBookPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="custom-practice/:favId" element={<CustomScenarioPracticePage />} />
        <Route path="ai-chat" element={<AIChatPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </Suspense>
  );
}
