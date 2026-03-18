/*
  DESIGN: Neo-Terminal Lesson List
  - Category sidebar with terminal-style tabs
  - Search with terminal prompt style
  - Card grid with hover glow effects
  - Progress indicators for completed lessons
*/
import Header from "@/components/Header";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Search, BookOpen, ChevronRight, Hash, Filter, CheckCircle2, Trophy } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import lessonIndex from "@/data/lessonIndex.json";
import categories from "@/data/categories.json";
import { useProgress } from "@/hooks/useProgress";

type LessonItem = {
  id: number;
  title: string;
  category: string;
  categoryName: string;
};

const categoryColors: Record<string, string> = {
  "intro": "text-neon-cyan border-neon-cyan/30 bg-neon-cyan/5",
  "react-basics": "text-neon-green border-neon-green/30 bg-neon-green/5",
  "mui": "text-neon-amber border-neon-amber/30 bg-neon-amber/5",
  "layout": "text-neon-pink border-neon-pink/30 bg-neon-pink/5",
  "dnd": "text-neon-cyan border-neon-cyan/30 bg-neon-cyan/5",
  "backend": "text-neon-green border-neon-green/30 bg-neon-green/5",
  "mongodb": "text-neon-amber border-neon-amber/30 bg-neon-amber/5",
  "api": "text-neon-cyan border-neon-cyan/30 bg-neon-cyan/5",
  "deploy": "text-neon-green border-neon-green/30 bg-neon-green/5",
  "advanced": "text-neon-pink border-neon-pink/30 bg-neon-pink/5",
  "auth": "text-neon-amber border-neon-amber/30 bg-neon-amber/5",
  "realtime": "text-neon-cyan border-neon-cyan/30 bg-neon-cyan/5",
  "features": "text-neon-green border-neon-green/30 bg-neon-green/5",
};

export default function LessonList() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const { isLessonCompleted, getQuizScore, getCompletionPercentage } = useProgress();

  const lessons = lessonIndex as LessonItem[];

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const matchSearch = search === "" || lesson.title.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === "all" || lesson.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [lessons, search, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: lessons.length };
    lessons.forEach((l) => {
      counts[l.category] = (counts[l.category] || 0) + 1;
    });
    return counts;
  }, [lessons]);

  const completionPct = getCompletionPercentage();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="font-mono text-neon-green text-sm mb-2">
              {"// lessons.map((lesson) => <Learn />)"}
            </div>
            <h1 className="text-3xl font-bold mb-2">
              Danh Sách <span className="text-neon-cyan">Bài Học</span>
            </h1>
            <p className="text-muted-foreground mb-4">
              {lessons.length} bài học MERN Stack Pro - Từ cơ bản đến nâng cao
            </p>
            
            {/* Overall progress */}
            {completionPct > 0 && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border max-w-md">
                <Trophy className="w-5 h-5 text-neon-amber shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-muted-foreground">Tiến độ học tập</span>
                    <span className="text-xs font-mono text-neon-cyan">{completionPct}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-neon-cyan to-neon-green rounded-full transition-all"
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Search & Filter bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 space-y-4"
          >
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-neon-green font-mono text-sm">
                  <span>$</span>
                  <Search className="w-4 h-4 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm bài học..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-14 pr-4 py-3 bg-card border border-border rounded-lg font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 transition-all"
                />
              </div>
              <Button
                variant="outline"
                className="md:hidden border-border"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            {/* Category filters */}
            <div className={`flex flex-wrap gap-2 ${showFilters ? "block" : "hidden md:flex"}`}>
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                  selectedCategory === "all"
                    ? "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30"
                    : "text-muted-foreground border-border hover:border-neon-cyan/30 hover:text-foreground"
                }`}
              >
                Tất cả ({categoryCounts.all})
              </button>
              {Object.entries(categories as Record<string, string>).map(([key, name]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                    selectedCategory === key
                      ? categoryColors[key] || "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30"
                      : "text-muted-foreground border-border hover:border-neon-cyan/30 hover:text-foreground"
                  }`}
                >
                  {name} ({categoryCounts[key] || 0})
                </button>
              ))}
            </div>
          </motion.div>

          {/* Results count */}
          <div className="mb-4 font-mono text-xs text-muted-foreground">
            <span className="text-neon-green">{">"}</span> Hiển thị {filteredLessons.length} / {lessons.length} bài học
          </div>

          {/* Lesson grid */}
          <div className="grid gap-3">
            {filteredLessons.map((lesson, i) => {
              const completed = isLessonCompleted(lesson.id);
              const score = getQuizScore(lesson.id);
              
              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.5) }}
                >
                  <Link href={`/lesson/${lesson.id}`}>
                    <div className={`terminal-card p-4 flex items-center gap-4 group cursor-pointer ${completed ? "border-neon-green/20" : ""}`}>
                      {/* Lesson number */}
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                        completed ? "bg-neon-green/10" : "bg-secondary"
                      }`}>
                        {completed ? (
                          <CheckCircle2 className="w-5 h-5 text-neon-green" />
                        ) : (
                          <span className="font-mono font-bold text-neon-cyan text-sm">
                            {String(lesson.id).padStart(3, "0")}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground group-hover:text-neon-cyan transition-colors truncate">
                          <span className="text-muted-foreground font-mono text-xs mr-2">
                            {String(lesson.id).padStart(3, "0")}
                          </span>
                          {lesson.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono border ${categoryColors[lesson.category] || "text-muted-foreground border-border"}`}>
                            <Hash className="w-3 h-3" />
                            {lesson.categoryName}
                          </span>
                          {score && (
                            <span className="text-xs font-mono text-neon-amber">
                              Quiz: {score.score}/{score.total}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>15 quiz + 5 code</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-neon-cyan group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {filteredLessons.length === 0 && (
            <div className="text-center py-20">
              <div className="font-mono text-neon-amber text-sm mb-2">
                {"// No results found"}
              </div>
              <p className="text-muted-foreground">Không tìm thấy bài học phù hợp.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
