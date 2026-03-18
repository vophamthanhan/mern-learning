/*
  DESIGN: Neo-Terminal Quiz Page
  - Tab switching between MC and Code exercises
  - Terminal-style question cards
  - Code editor with dark theme
  - Score display with glow effects
  - Progress tracking with localStorage
*/
import Header from "@/components/Header";
import { Link, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Code2,
  CheckCircle2,
  XCircle,
  ChevronRight,
  RotateCcw,
  Eye,
  EyeOff,
  Trophy,
  Hash,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/hooks/useProgress";

const ACHIEVEMENT_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663450083476/bcUSKWXZqaXtXc55jfhBqh/achievement-bg_33bc48a3.png";

type QuizData = {
  multipleChoice: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
  codeExercises: Array<{
    title: string;
    description: string;
    starterCode: string;
    solution: string;
    testCases: string;
  }>;
};

type LessonData = {
  id: number;
  title: string;
  category: string;
  categoryName: string;
  content: string;
  quiz: QuizData;
};

export default function Quiz() {
  const params = useParams<{ id: string }>();
  const lessonId = parseInt(params.id || "1");
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"quiz" | "code">("quiz");
  const { saveQuizScore, markLessonCompleted } = useProgress();

  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});

  // Code state
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userCode, setUserCode] = useState<Record<number, string>>({});
  const [showSolution, setShowSolution] = useState<Record<number, boolean>>({});

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [lessonId]);

  useEffect(() => {
    setLoading(true);
    setShowResults(false);
    setSelectedAnswers({});
    setShowExplanation({});
    setCurrentQuestion(0);
    setCurrentExercise(0);
    setShowSolution({});
    
    const paddedId = String(lessonId).padStart(3, "0");
    import(`../data/lessons/lesson_${paddedId}.json`)
      .then((mod) => {
        const data = mod.default || mod;
        setLesson(data);
        setLoading(false);
        // Initialize user code with starter code
        const codes: Record<number, string> = {};
        data.quiz.codeExercises.forEach((ex: { starterCode: string }, i: number) => {
          codes[i] = ex.starterCode;
        });
        setUserCode(codes);
      })
      .catch(() => setLoading(false));
  }, [lessonId]);

  const handleSelectAnswer = useCallback((questionIdx: number, answerIdx: number) => {
    if (showResults) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionIdx]: answerIdx }));
  }, [showResults]);

  const handleSubmitQuiz = () => {
    setShowResults(true);
    if (lesson) {
      const correct = Object.entries(selectedAnswers).filter(
        ([qIdx, aIdx]) => lesson.quiz.multipleChoice[parseInt(qIdx)]?.correctAnswer === aIdx
      ).length;
      saveQuizScore(lessonId, correct, lesson.quiz.multipleChoice.length);
      markLessonCompleted(lessonId);
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setShowExplanation({});
    setCurrentQuestion(0);
  };

  const toggleExplanation = (idx: number) => {
    setShowExplanation((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleSolution = (idx: number) => {
    setShowSolution((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 pb-16 container">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-card rounded w-3/4" />
            <div className="h-4 bg-card rounded w-1/2" />
            <div className="h-64 bg-card rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 pb-16 container text-center">
          <p className="text-muted-foreground">Không tìm thấy bài học.</p>
          <Link href="/lessons">
            <Button variant="outline" className="mt-4">Quay lại</Button>
          </Link>
        </div>
      </div>
    );
  }

  const quiz = lesson.quiz;
  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = showResults
    ? Object.entries(selectedAnswers).filter(
        ([qIdx, aIdx]) => quiz.multipleChoice[parseInt(qIdx)]?.correctAnswer === aIdx
      ).length
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container max-w-4xl">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-muted-foreground mb-6 font-mono"
          >
            <Link href="/lessons" className="hover:text-neon-cyan transition-colors">Bài học</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/lesson/${lesson.id}`} className="hover:text-neon-cyan transition-colors">
              #{String(lesson.id).padStart(3, "0")}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-neon-cyan">Kiểm tra</span>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-bold mb-2">
              Kiểm Tra: <span className="text-neon-cyan">{lesson.title}</span>
            </h1>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 p-1 bg-card rounded-lg border border-border w-fit">
            <button
              onClick={() => setActiveTab("quiz")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-mono transition-all ${
                activeTab === "quiz"
                  ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Trắc Nghiệm ({quiz.multipleChoice.length})
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-mono transition-all ${
                activeTab === "code"
                  ? "bg-neon-green/10 text-neon-green border border-neon-green/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Code2 className="w-4 h-4" />
              Bài Tập Code ({quiz.codeExercises.length})
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "quiz" ? (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {/* Score display */}
                {showResults && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative rounded-xl overflow-hidden mb-8"
                  >
                    <img src={ACHIEVEMENT_BG} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/80" />
                    <div className="relative p-8 text-center">
                      <Trophy className="w-12 h-12 text-neon-amber mx-auto mb-4" />
                      <div className="text-4xl font-bold font-mono mb-2">
                        <span className={correctCount >= 10 ? "text-neon-green text-glow-green" : correctCount >= 7 ? "text-neon-amber" : "text-destructive"}>
                          {correctCount}
                        </span>
                        <span className="text-muted-foreground"> / {quiz.multipleChoice.length}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Đã trả lời: {answeredCount}/{quiz.multipleChoice.length} câu
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {correctCount >= 12 ? "Xuất sắc! Bạn nắm rất vững kiến thức!" :
                         correctCount >= 8 ? "Tốt lắm! Cần ôn lại một số phần." :
                         "Cần ôn tập thêm. Hãy đọc lại bài học nhé!"}
                      </p>
                      <div className="flex justify-center gap-3">
                        <Button onClick={handleResetQuiz} variant="outline" className="font-mono">
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Làm Lại
                        </Button>
                        <Link href={`/lesson/${lesson.id}`}>
                          <Button variant="outline" className="font-mono">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Xem Lại Bài Học
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Question navigation */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {quiz.multipleChoice.map((_, idx) => {
                    const isAnswered = selectedAnswers[idx] !== undefined;
                    const isCorrect = showResults && quiz.multipleChoice[idx].correctAnswer === selectedAnswers[idx];
                    const isWrong = showResults && isAnswered && !isCorrect;
                    const isCurrent = idx === currentQuestion;

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentQuestion(idx)}
                        className={`w-9 h-9 rounded-lg text-xs font-mono font-bold border transition-all ${
                          isCurrent
                            ? "border-neon-cyan bg-neon-cyan/10 text-neon-cyan"
                            : isCorrect
                            ? "border-neon-green/50 bg-neon-green/10 text-neon-green"
                            : isWrong
                            ? "border-destructive/50 bg-destructive/10 text-destructive"
                            : isAnswered
                            ? "border-neon-amber/30 bg-neon-amber/5 text-neon-amber"
                            : "border-border text-muted-foreground hover:border-neon-cyan/30"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Current question */}
                <div className="terminal-card p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-mono text-neon-cyan bg-neon-cyan/10 px-2 py-1 rounded">
                      Câu {currentQuestion + 1}/{quiz.multipleChoice.length}
                    </span>
                  </div>

                  <h3 className="text-lg font-medium text-foreground mb-6">
                    {quiz.multipleChoice[currentQuestion]?.question}
                  </h3>

                  <div className="space-y-3">
                    {quiz.multipleChoice[currentQuestion]?.options.map((option, optIdx) => {
                      const isSelected = selectedAnswers[currentQuestion] === optIdx;
                      const isCorrectAnswer = quiz.multipleChoice[currentQuestion].correctAnswer === optIdx;
                      const showCorrect = showResults && isCorrectAnswer;
                      const showWrong = showResults && isSelected && !isCorrectAnswer;

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectAnswer(currentQuestion, optIdx)}
                          disabled={showResults}
                          className={`w-full text-left p-4 rounded-lg border transition-all flex items-start gap-3 ${
                            showCorrect
                              ? "border-neon-green/50 bg-neon-green/10"
                              : showWrong
                              ? "border-destructive/50 bg-destructive/10"
                              : isSelected
                              ? "border-neon-cyan/50 bg-neon-cyan/10"
                              : "border-border hover:border-neon-cyan/30 bg-card"
                          }`}
                        >
                          <span className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-mono font-bold shrink-0 border ${
                            showCorrect
                              ? "border-neon-green text-neon-green bg-neon-green/20"
                              : showWrong
                              ? "border-destructive text-destructive bg-destructive/20"
                              : isSelected
                              ? "border-neon-cyan text-neon-cyan bg-neon-cyan/20"
                              : "border-border text-muted-foreground"
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className={`flex-1 text-sm ${
                            showCorrect ? "text-neon-green" : showWrong ? "text-destructive" : "text-foreground"
                          }`}>
                            {option}
                          </span>
                          {showCorrect && <CheckCircle2 className="w-5 h-5 text-neon-green shrink-0" />}
                          {showWrong && <XCircle className="w-5 h-5 text-destructive shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {showResults && (
                    <div className="mt-4">
                      <button
                        onClick={() => toggleExplanation(currentQuestion)}
                        className="text-xs font-mono text-neon-amber hover:text-neon-amber/80 flex items-center gap-1"
                      >
                        {showExplanation[currentQuestion] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        {showExplanation[currentQuestion] ? "Ẩn giải thích" : "Xem giải thích"}
                      </button>
                      <AnimatePresence>
                        {showExplanation[currentQuestion] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 p-4 rounded-lg bg-neon-amber/5 border border-neon-amber/20"
                          >
                            <p className="text-sm text-foreground/80">
                              {quiz.multipleChoice[currentQuestion]?.explanation}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentQuestion === 0}
                      onClick={() => setCurrentQuestion((p) => p - 1)}
                      className="font-mono"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" /> Trước
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentQuestion === quiz.multipleChoice.length - 1}
                      onClick={() => setCurrentQuestion((p) => p + 1)}
                      className="font-mono"
                    >
                      Tiếp <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>

                {/* Quick submit */}
                {!showResults && (
                  <div className="text-center">
                    <Button
                      onClick={handleSubmitQuiz}
                      disabled={answeredCount === 0}
                      className="bg-neon-green text-background hover:bg-neon-green/90 font-mono"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Nộp Bài ({answeredCount}/{quiz.multipleChoice.length} câu đã trả lời)
                    </Button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="code"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Exercise navigation */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {quiz.codeExercises.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentExercise(idx)}
                      className={`px-4 py-2 rounded-lg text-sm font-mono border transition-all ${
                        idx === currentExercise
                          ? "border-neon-green/50 bg-neon-green/10 text-neon-green"
                          : "border-border text-muted-foreground hover:border-neon-green/30"
                      }`}
                    >
                      Bài {idx + 1}
                    </button>
                  ))}
                </div>

                {/* Current exercise */}
                <div className="space-y-6">
                  {/* Description */}
                  <div className="terminal-card p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Hash className="w-4 h-4 text-neon-green" />
                      <h3 className="font-mono font-bold text-neon-green">
                        {quiz.codeExercises[currentExercise]?.title}
                      </h3>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                      {quiz.codeExercises[currentExercise]?.description}
                    </p>
                    {quiz.codeExercises[currentExercise]?.testCases && (
                      <div className="mt-4 p-3 rounded-lg bg-navy-deep border border-border">
                        <span className="text-xs font-mono text-neon-amber block mb-1">Test Cases:</span>
                        <p className="text-xs text-muted-foreground font-mono whitespace-pre-wrap">
                          {quiz.codeExercises[currentExercise].testCases}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Code editor */}
                  <div className="terminal-card overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-navy-deep">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-destructive/60" />
                        <div className="w-3 h-3 rounded-full bg-neon-amber/60" />
                        <div className="w-3 h-3 rounded-full bg-neon-green/60" />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground ml-2">
                        code-editor.js
                      </span>
                    </div>
                    <div className="relative">
                      <textarea
                        value={userCode[currentExercise] || ""}
                        onChange={(e) =>
                          setUserCode((prev) => ({ ...prev, [currentExercise]: e.target.value }))
                        }
                        className="w-full min-h-[300px] p-4 bg-navy-deep text-foreground font-mono text-sm resize-y focus:outline-none leading-relaxed"
                        spellCheck={false}
                        placeholder="// Viết code của bạn ở đây..."
                      />
                    </div>
                  </div>

                  {/* Solution toggle */}
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleSolution(currentExercise)}
                      className="font-mono border-neon-amber/30 text-neon-amber hover:bg-neon-amber/10"
                    >
                      {showSolution[currentExercise] ? (
                        <><EyeOff className="w-4 h-4 mr-2" /> Ẩn Lời Giải</>
                      ) : (
                        <><Eye className="w-4 h-4 mr-2" /> Xem Lời Giải</>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setUserCode((prev) => ({
                          ...prev,
                          [currentExercise]: quiz.codeExercises[currentExercise]?.starterCode || "",
                        }))
                      }
                      className="font-mono"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" /> Reset Code
                    </Button>
                  </div>

                  {/* Solution display */}
                  <AnimatePresence>
                    {showSolution[currentExercise] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="terminal-card overflow-hidden"
                      >
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-neon-green/20 bg-neon-green/5">
                          <CheckCircle2 className="w-4 h-4 text-neon-green" />
                          <span className="text-xs font-mono text-neon-green">Lời giải tham khảo</span>
                        </div>
                        <pre className="p-4 bg-navy-deep overflow-x-auto">
                          <code className="text-sm font-mono text-foreground/90 whitespace-pre-wrap">
                            {quiz.codeExercises[currentExercise]?.solution}
                          </code>
                        </pre>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Exercise navigation */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentExercise === 0}
                      onClick={() => setCurrentExercise((p) => p - 1)}
                      className="font-mono"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" /> Bài trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentExercise === quiz.codeExercises.length - 1}
                      onClick={() => setCurrentExercise((p) => p + 1)}
                      className="font-mono"
                    >
                      Bài tiếp <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back to lesson */}
          <div className="mt-8 text-center">
            <Link href={`/lesson/${lesson.id}`}>
              <Button variant="outline" className="font-mono">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay Lại Bài Học
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
