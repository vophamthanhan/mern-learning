/*
  DESIGN: Neo-Terminal Home Page
  - Hero section with generated background
  - Terminal typing animation
  - Feature cards with glow effects
  - Stats section
  - Progress display for returning users
*/
import Header from "@/components/Header";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { BookOpen, Code2, Trophy, ChevronRight, Zap, Database, Globe, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/hooks/useProgress";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663450083476/bcUSKWXZqaXtXc55jfhBqh/hero-bg_8dd4a1d5.png";

const features = [
  {
    icon: BookOpen,
    title: "109 Bài Học Chi Tiết",
    description: "Kiến thức từ cơ bản đến nâng cao, bám sát khóa học MERN Stack Pro của TrungQuanDev.",
    color: "text-neon-cyan",
    glow: "group-hover:shadow-[0_0_20px_oklch(0.82_0.15_195/0.2)]",
  },
  {
    icon: Code2,
    title: "Bài Tập Code Thực Hành",
    description: "5 bài tập code cho mỗi bài học với code editor tích hợp, giúp bạn thực hành ngay.",
    color: "text-neon-green",
    glow: "group-hover:shadow-[0_0_20px_oklch(0.85_0.2_155/0.2)]",
  },
  {
    icon: Trophy,
    title: "Kiểm Tra Trắc Nghiệm",
    description: "15 câu trắc nghiệm cho mỗi bài, giải thích chi tiết đáp án, theo dõi tiến độ.",
    color: "text-neon-amber",
    glow: "group-hover:shadow-[0_0_20px_oklch(0.82_0.15_80/0.2)]",
  },
  {
    icon: Zap,
    title: "Giao Diện Terminal",
    description: "Thiết kế dark theme lấy cảm hứng từ IDE, giảm mỏi mắt khi học lâu.",
    color: "text-neon-pink",
    glow: "group-hover:shadow-[0_0_20px_oklch(0.75_0.2_350/0.2)]",
  },
];

const techStack = [
  { icon: Globe, label: "React", desc: "Frontend Framework" },
  { icon: Layers, label: "Node.js", desc: "Backend Runtime" },
  { icon: Database, label: "MongoDB", desc: "NoSQL Database" },
  { icon: Code2, label: "Express", desc: "Web Framework" },
];

const stats = [
  { value: "109", label: "Bài học" },
  { value: "1,635", label: "Câu trắc nghiệm" },
  { value: "545", label: "Bài tập code" },
  { value: "13", label: "Chủ đề" },
];

export default function Home() {
  const { progress, getCompletionPercentage } = useProgress();
  const completionPct = getCompletionPercentage();
  const hasProgress = progress.completedLessons.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={HERO_BG}
            alt=""
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>

        {/* Content */}
        <div className="relative z-10 container text-center max-w-4xl py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Terminal prompt */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 mb-8">
              <span className="text-neon-green font-mono text-sm">$</span>
              <span className="text-sm font-mono text-neon-cyan">npm start mern-learning</span>
              <span className="w-2 h-4 bg-neon-cyan animate-pulse rounded-sm" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-foreground">Học </span>
              <span className="text-neon-cyan text-glow-cyan">MERN Stack</span>
              <br />
              <span className="text-foreground">Từ Zero Đến </span>
              <span className="text-neon-green text-glow-green">Pro</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Nền tảng học tập toàn diện với 109 bài học chi tiết, hệ thống kiểm tra
              trắc nghiệm và bài tập code thực hành. Xây dựng dự án Trello Clone hoàn chỉnh
              cùng TrungQuanDev.
            </p>

            {/* Progress for returning users */}
            {hasProgress && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-md mx-auto mb-8 p-4 rounded-xl bg-card/80 border border-border backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-mono text-muted-foreground">Tiến độ của bạn</span>
                  <span className="text-sm font-mono text-neon-cyan">{completionPct}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-neon-cyan to-neon-green rounded-full transition-all"
                    style={{ width: `${completionPct}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Đã hoàn thành {progress.completedLessons.length}/109 bài học
                </p>
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {hasProgress && progress.lastVisited ? (
                <>
                  <Link href={`/lesson/${progress.lastVisited}`}>
                    <Button size="lg" className="bg-neon-cyan text-background hover:bg-neon-cyan/90 font-mono font-semibold px-8 glow-cyan">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Tiếp Tục Bài {progress.lastVisited}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                  <Link href="/lessons">
                    <Button size="lg" variant="outline" className="border-border hover:border-neon-cyan/50 font-mono">
                      <Code2 className="w-5 h-5 mr-2" />
                      Xem Tất Cả Bài Học
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/lessons">
                    <Button size="lg" className="bg-neon-cyan text-background hover:bg-neon-cyan/90 font-mono font-semibold px-8 glow-cyan">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Bắt Đầu Học Ngay
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                  <Link href="/lessons">
                    <Button size="lg" variant="outline" className="border-border hover:border-neon-cyan/50 font-mono">
                      <Code2 className="w-5 h-5 mr-2" />
                      Xem Danh Sách Bài Học
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 border-y border-border/50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold font-mono text-neon-cyan text-glow-cyan mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-neon-green font-mono">{">"}</span>{" "}
              Tính Năng Nổi Bật
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Mọi thứ bạn cần để master MERN Stack trong một nền tảng duy nhất.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`group terminal-card p-6 ${feature.glow}`}
                >
                  <div className={`w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4 ${feature.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 border-t border-border/50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-neon-amber font-mono">{"{"}</span>{" "}
              MERN Stack{" "}
              <span className="text-neon-amber font-mono">{"}"}</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Bốn công nghệ mạnh mẽ, một hệ sinh thái hoàn chỉnh.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {techStack.map((tech, i) => {
              const Icon = tech.icon;
              return (
                <motion.div
                  key={tech.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="terminal-card p-6 text-center"
                >
                  <Icon className="w-10 h-10 text-neon-cyan mx-auto mb-3" />
                  <h3 className="font-mono font-bold text-foreground text-lg mb-1">{tech.label}</h3>
                  <p className="text-xs text-muted-foreground">{tech.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border/50">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="font-mono text-neon-green text-sm mb-4">
              {"// Ready to start?"}
            </div>
            <h2 className="text-3xl font-bold mb-6">
              Bắt Đầu Hành Trình <span className="text-neon-cyan">MERN Stack</span> Ngay
            </h2>
            <Link href="/lessons">
              <Button size="lg" className="bg-neon-cyan text-background hover:bg-neon-cyan/90 font-mono font-semibold px-10 glow-cyan">
                Khám Phá 109 Bài Học
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground font-mono">
            <span className="text-neon-green">$</span> MERN Stack Pro Learning Platform
            <span className="text-neon-cyan"> | </span>
            Kiến thức từ khóa học của{" "}
            <a
              href="https://www.youtube.com/@trungquandev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-cyan hover:text-neon-green transition-colors"
            >
              TrungQuanDev
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
