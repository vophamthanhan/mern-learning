import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "mern-learning-progress";

type ProgressData = {
  completedLessons: number[];
  quizScores: Record<number, { score: number; total: number; date: string }>;
  lastVisited: number | null;
};

const defaultProgress: ProgressData = {
  completedLessons: [],
  quizScores: {},
  lastVisited: null,
};

function loadProgress(): ProgressData {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return { ...defaultProgress, ...JSON.parse(data) };
    }
  } catch {
    // ignore
  }
  return defaultProgress;
}

function saveProgress(data: ProgressData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const markLessonVisited = useCallback((lessonId: number) => {
    setProgress((prev) => ({
      ...prev,
      lastVisited: lessonId,
    }));
  }, []);

  const markLessonCompleted = useCallback((lessonId: number) => {
    setProgress((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
      };
    });
  }, []);

  const saveQuizScore = useCallback((lessonId: number, score: number, total: number) => {
    setProgress((prev) => ({
      ...prev,
      quizScores: {
        ...prev.quizScores,
        [lessonId]: { score, total, date: new Date().toISOString() },
      },
    }));
  }, []);

  const getCompletionPercentage = useCallback(() => {
    return Math.round((progress.completedLessons.length / 109) * 100);
  }, [progress.completedLessons.length]);

  const isLessonCompleted = useCallback(
    (lessonId: number) => progress.completedLessons.includes(lessonId),
    [progress.completedLessons]
  );

  const getQuizScore = useCallback(
    (lessonId: number) => progress.quizScores[lessonId] || null,
    [progress.quizScores]
  );

  return {
    progress,
    markLessonVisited,
    markLessonCompleted,
    saveQuizScore,
    getCompletionPercentage,
    isLessonCompleted,
    getQuizScore,
  };
}
