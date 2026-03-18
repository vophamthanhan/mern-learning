import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import LessonList from "./pages/LessonList";
import LessonDetail from "./pages/LessonDetail";
import Quiz from "./pages/Quiz";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/lessons"} component={LessonList} />
      <Route path={"/lesson/:id"} component={LessonDetail} />
      <Route path={"/lesson/:id/quiz"} component={Quiz} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
