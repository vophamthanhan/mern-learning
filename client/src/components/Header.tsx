/*
  DESIGN: Neo-Terminal Header
  - Glassmorphism navbar with backdrop blur
  - Terminal-style branding with blinking cursor
  - Neon cyan accents
*/
import { Link, useLocation } from "wouter";
import { Terminal, BookOpen, Home, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Trang chủ", icon: Home },
    { href: "/lessons", label: "Bài học", icon: BookOpen },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <Terminal className="w-7 h-7 text-neon-cyan group-hover:drop-shadow-[0_0_8px_oklch(0.82_0.15_195)] transition-all" />
          </div>
          <div className="flex items-center gap-1">
            <span className="font-mono font-bold text-lg text-foreground tracking-tight">
              MERN
            </span>
            <span className="font-mono font-bold text-lg text-neon-cyan">
              Stack
            </span>
            <span className="font-mono text-sm text-neon-green ml-1">Pro</span>
            <span className="w-2 h-5 bg-neon-cyan/80 animate-pulse ml-1 rounded-sm" />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location === link.href || (link.href !== "/" && location.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Stats badge */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-green/10 border border-neon-green/20">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="text-xs font-mono text-neon-green">109 Bài học</span>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
          >
            <nav className="container py-4 flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
