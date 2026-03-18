/*
  DESIGN: Neo-Terminal Lesson Detail
  - Terminal-style breadcrumb
  - Markdown content with syntax highlighting
  - Floating sidebar navigation
  - Quiz CTA at bottom
  - Progress tracking with localStorage
*/
import Header from "@/components/Header";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Code2, Hash, ChevronRight, FileText, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import lessonIndex from "@/data/lessonIndex.json";
import { useProgress } from "@/hooks/useProgress";

type LessonData = {
  id: number;
  title: string;
  category: string;
  categoryName: string;
  content: string;
  quiz: {
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
};

const QUIZ_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663450083476/bcUSKWXZqaXtXc55jfhBqh/quiz-bg_42f28e54.png";

export default function LessonDetail() {
  const params = useParams<{ id: string }>();
  const lessonId = parseInt(params.id || "1");
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const { markLessonVisited, markLessonCompleted, isLessonCompleted, getQuizScore } = useProgress();

  // Scroll to top on lesson change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [lessonId]);

  useEffect(() => {
    setLoading(true);
    const paddedId = String(lessonId).padStart(3, "0");
    import(`../data/lessons/lesson_${paddedId}.json`)
      .then((mod) => {
        setLesson(mod.default || mod);
        setLoading(false);
        markLessonVisited(lessonId);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [lessonId, markLessonVisited]);

  const prevLesson = lessonId > 1 ? lessonIndex.find((l) => l.id === lessonId - 1) : null;
  const nextLesson = lessonId < 109 ? lessonIndex.find((l) => l.id === lessonId + 1) : null;
  const completed = isLessonCompleted(lessonId);
  const quizScore = getQuizScore(lessonId);

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
          <div className="font-mono text-neon-amber text-sm mb-2">
            {"// Error 404: Lesson not found"}
          </div>
          <p className="text-muted-foreground mb-4">Không tìm thấy bài học này.</p>
          <Link href="/lessons">
            <Button variant="outline">Quay lại danh sách</Button>
          </Link>
        </div>
      </div>
    );
  }

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
            <Link href="/lessons" className="hover:text-neon-cyan transition-colors">
              Bài học
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-neon-cyan">#{String(lesson.id).padStart(3, "0")}</span>
          </motion.div>

          {/* Lesson header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono border border-neon-cyan/30 text-neon-cyan bg-neon-cyan/5">
                <Hash className="w-3 h-3" />
                {lesson.categoryName}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                Bài {lesson.id} / 109
              </span>
              {completed && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono border border-neon-green/30 text-neon-green bg-neon-green/5">
                  <CheckCircle2 className="w-3 h-3" />
                  Đã hoàn thành
                </span>
              )}
              {quizScore && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono border border-neon-amber/30 text-neon-amber bg-neon-amber/5">
                  Quiz: {quizScore.score}/{quizScore.total}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              {lesson.title}
            </h1>
            
            {/* Progress bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-neon-cyan to-neon-green rounded-full transition-all"
                  style={{ width: `${(lesson.id / 109) * 100}%` }}
                />
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {Math.round((lesson.id / 109) * 100)}%
              </span>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="terminal-card p-6 sm:p-8 mb-8"
          >
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-neon-amber/60" />
                <div className="w-3 h-3 rounded-full bg-neon-green/60" />
              </div>
              <span className="text-xs font-mono text-muted-foreground ml-2 truncate">
                <FileText className="w-3 h-3 inline mr-1" />
                {lesson.title}
              </span>
            </div>

            <div className="markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeRaw]}
              >
                {lesson.content}
              </ReactMarkdown>
            </div>
          </motion.div>

          {/* Mark as completed */}
          {!completed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-8"
            >
              <Button
                onClick={() => markLessonCompleted(lessonId)}
                variant="outline"
                className="border-neon-green/30 text-neon-green hover:bg-neon-green/10 font-mono"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Đánh Dấu Hoàn Thành
              </Button>
            </motion.div>
          )}

          {/* Quiz CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative rounded-xl overflow-hidden mb-8"
          >
            <img src={QUIZ_BG} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/70" />
            <div className="relative p-8 flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">
                  Kiểm Tra Kiến Thức Bài {lesson.id}
                </h3>
                <p className="text-sm text-muted-foreground">
                  15 câu trắc nghiệm + 5 bài tập code để củng cố kiến thức
                </p>
              </div>
              <div className="flex gap-3">
                <Link href={`/lesson/${lesson.id}/quiz`}>
                  <Button className="bg-neon-cyan text-background hover:bg-neon-cyan/90 font-mono glow-cyan">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Trắc Nghiệm
                  </Button>
                </Link>
                <Link href={`/lesson/${lesson.id}/quiz`}>
                  <Button variant="outline" className="border-neon-green/30 text-neon-green hover:bg-neon-green/10 font-mono">
                    <Code2 className="w-4 h-4 mr-2" />
                    Bài Tập Code
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            {prevLesson ? (
              <Link href={`/lesson/${prevLesson.id}`}>
                <Button variant="outline" className="border-border hover:border-neon-cyan/30 font-mono text-sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Bài {prevLesson.id}</span>
                  <span className="sm:hidden">Trước</span>
                </Button>
              </Link>
            ) : (
              <div />
            )}
            {nextLesson ? (
              <Link href={`/lesson/${nextLesson.id}`}>
                <Button variant="outline" className="border-border hover:border-neon-cyan/30 font-mono text-sm">
                  <span className="hidden sm:inline">Bài {nextLesson.id}</span>
                  <span className="sm:hidden">Tiếp</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
