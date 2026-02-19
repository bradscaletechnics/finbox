import { useState } from "react";
import { BookOpen, Brain, ShieldCheck, GraduationCap, ChevronRight, CheckCircle2, Trophy, Clock, Sparkles, X, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  REFERENCE_CARDS,
  QUIZZES,
  TRAINING_MODULES,
  CATEGORY_META,
  getTrainingProgress,
  markTrainingComplete,
  type TrainingCategory,
  type ReferenceCard,
  type Quiz,
  type TrainingModule,
} from "@/lib/training-data";
import { addXP } from "@/lib/xp";

type Tab = "all" | TrainingCategory;
type ActiveView = null | { type: "quiz"; quiz: Quiz } | { type: "module"; module: TrainingModule };

const TAB_ITEMS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "all", label: "All", icon: GraduationCap },
  { key: "product", label: "Product", icon: BookOpen },
  { key: "sales", label: "Sales", icon: Brain },
  { key: "compliance", label: "Compliance", icon: ShieldCheck },
];

const CATEGORY_ICONS: Record<TrainingCategory, React.ElementType> = {
  product: BookOpen,
  sales: Brain,
  compliance: ShieldCheck,
};

export default function Training() {
  const [tab, setTab] = useState<Tab>("all");
  const [activeView, setActiveView] = useState<ActiveView>(null);
  const [progress, setProgress] = useState(getTrainingProgress);

  const refreshProgress = () => setProgress(getTrainingProgress());

  const filteredCards = tab === "all" ? REFERENCE_CARDS : REFERENCE_CARDS.filter((c) => c.category === tab);
  const filteredQuizzes = tab === "all" ? QUIZZES : QUIZZES.filter((q) => q.category === tab);
  const filteredModules = tab === "all" ? TRAINING_MODULES : TRAINING_MODULES.filter((m) => m.category === tab);

  const totalItems = QUIZZES.length + TRAINING_MODULES.length;
  const completedItems = Object.values(progress).filter((p) => p.completed).length;
  const overallProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  if (activeView?.type === "quiz") {
    return (
      <QuizPlayer
        quiz={activeView.quiz}
        onBack={() => { setActiveView(null); refreshProgress(); }}
        isCompleted={!!progress[activeView.quiz.id]?.completed}
      />
    );
  }

  if (activeView?.type === "module") {
    return (
      <ModuleViewer
        module={activeView.module}
        onBack={() => { setActiveView(null); refreshProgress(); }}
        isCompleted={!!progress[activeView.module.id]?.completed}
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Training Center</h1>
          <p className="text-sm text-muted-foreground mt-1">Master products, sharpen skills, stay compliant</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium">Overall Progress</p>
            <p className="text-sm font-mono font-bold text-foreground">{completedItems}/{totalItems} completed</p>
          </div>
          <div className="w-24">
            <Progress value={overallProgress} className="h-1.5 bg-white/[0.06]" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-white/[0.04] pb-px">
        {TAB_ITEMS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "relative px-3 py-3 text-[11px] uppercase tracking-[0.15em] font-medium transition-colors duration-200",
              tab === key ? "text-primary" : "text-muted-foreground/50 hover:text-foreground/80"
            )}
          >
            <span className="flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5" />
              {label}
            </span>
            <span
              className={cn(
                "absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-300",
                tab === key ? "w-full opacity-100" : "w-0 opacity-0"
              )}
            />
          </button>
        ))}
      </div>

      {/* Guided Modules */}
      {filteredModules.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground/60 font-medium">Guided Modules</h2>
          <div className="grid grid-cols-3 gap-4">
            {filteredModules.map((mod) => {
              const done = !!progress[mod.id]?.completed;
              const CatIcon = CATEGORY_ICONS[mod.category];
              return (
                <Card
                  key={mod.id}
                  className={cn(
                    "group cursor-pointer border-white/[0.04] bg-card hover-lift glass-edge",
                    done && "border-primary/20"
                  )}
                  onClick={() => setActiveView({ type: "module", module: mod })}
                >
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-md",
                        done ? "bg-primary/20" : "bg-secondary"
                      )}>
                        {done ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <CatIcon className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[9px] font-mono">{CATEGORY_META[mod.category].label}</Badge>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{mod.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{mod.description}</p>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground/60">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{mod.duration}</span>
                      <span className="flex items-center gap-1"><Sparkles className="h-3 w-3" />+{mod.xpReward} XP</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      {done ? "Review" : "Start"} Module <ChevronRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Quizzes */}
      {filteredQuizzes.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground/60 font-medium">Knowledge Quizzes</h2>
          <div className="grid grid-cols-3 gap-4">
            {filteredQuizzes.map((quiz) => {
              const done = progress[quiz.id];
              const CatIcon = CATEGORY_ICONS[quiz.category];
              return (
                <Card
                  key={quiz.id}
                  className={cn(
                    "group cursor-pointer border-white/[0.04] bg-card hover-lift glass-edge",
                    done?.completed && "border-primary/20"
                  )}
                  onClick={() => setActiveView({ type: "quiz", quiz })}
                >
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-md",
                        done?.completed ? "bg-primary/20" : "bg-secondary"
                      )}>
                        {done?.completed ? <Trophy className="h-4 w-4 text-primary" /> : <CatIcon className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      {done?.completed && done.score != null && (
                        <span className="text-xs font-mono font-bold text-primary">{done.score}%</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{quiz.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{quiz.description}</p>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground/60">
                      <span>{quiz.questions.length} questions</span>
                      <span className="flex items-center gap-1"><Sparkles className="h-3 w-3" />+{quiz.xpReward} XP</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      {done?.completed ? "Retake" : "Start"} Quiz <ChevronRight className="h-3 w-3" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Reference Cards */}
      {filteredCards.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground/60 font-medium">Quick Reference</h2>
          <div className="grid grid-cols-3 gap-4">
            {filteredCards.map((card) => (
              <ReferenceCardComponent key={card.id} card={card} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ─── Reference Card Expandable ──────────────────────────────────

function ReferenceCardComponent({ card }: { card: ReferenceCard }) {
  const [expanded, setExpanded] = useState(false);
  const CatIcon = CATEGORY_ICONS[card.category];

  return (
    <Card
      className="border-white/[0.04] bg-card glass-edge cursor-pointer hover-lift"
      onClick={() => setExpanded(!expanded)}
    >
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary">
            <CatIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground">{card.title}</h3>
            <p className="text-[11px] text-muted-foreground">{card.subtitle}</p>
          </div>
        </div>
        {expanded && (
          <ul className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
            {card.facts.map((fact, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                {fact}
              </li>
            ))}
          </ul>
        )}
        {!expanded && (
          <p className="text-[10px] text-muted-foreground/50">{card.facts.length} key facts — click to expand</p>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Quiz Player ────────────────────────────────────────────────

function QuizPlayer({ quiz, onBack, isCompleted }: { quiz: Quiz; onBack: () => void; isCompleted: boolean }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = quiz.questions[current];

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.correctIndex) setCorrectCount((c) => c + 1);
  };

  const handleNext = () => {
    if (current < quiz.questions.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      const score = Math.round(((correctCount + (selected === q.correctIndex ? 0 : 0)) / quiz.questions.length) * 100);
      const finalScore = Math.round((correctCount / quiz.questions.length) * 100);
      if (!isCompleted) {
        markTrainingComplete(quiz.id, finalScore);
        addXP(quiz.xpReward);
      }
      setFinished(true);
    }
  };

  if (finished) {
    const score = Math.round((correctCount / quiz.questions.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-in fade-in duration-300">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
          <Trophy className="h-8 w-8 text-primary" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">Quiz Complete!</h2>
          <p className="text-3xl font-mono font-bold text-primary mt-2">{score}%</p>
          <p className="text-sm text-muted-foreground mt-1">{correctCount}/{quiz.questions.length} correct</p>
          {!isCompleted && <p className="text-xs text-primary/80 mt-2">+{quiz.xpReward} XP earned</p>}
        </div>
        <Button variant="outline" onClick={onBack}>Back to Training</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
        <span className="text-xs font-mono text-muted-foreground/60">{current + 1} / {quiz.questions.length}</span>
      </div>

      <div>
        <h2 className="text-lg font-bold text-foreground">{quiz.title}</h2>
        <Progress value={((current + 1) / quiz.questions.length) * 100} className="h-1 mt-3 bg-white/[0.06]" />
      </div>

      {/* Question */}
      <Card className="border-white/[0.04] bg-card">
        <CardContent className="p-6 space-y-5">
          <p className="text-sm font-medium text-foreground">{q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correctIndex;
              const isSelected = i === selected;
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={answered}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-md text-sm transition-all duration-200 border",
                    !answered && "border-white/[0.06] bg-secondary/50 hover:border-primary/30 hover:bg-secondary",
                    answered && isCorrect && "border-primary/40 bg-primary/10 text-primary",
                    answered && isSelected && !isCorrect && "border-destructive/40 bg-destructive/10 text-destructive",
                    answered && !isCorrect && !isSelected && "border-white/[0.04] bg-secondary/30 text-muted-foreground/50"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground/40 w-4">{String.fromCharCode(65 + i)}</span>
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
          {answered && (
            <div className="p-3 rounded-md bg-primary/5 border border-primary/10 animate-in fade-in slide-in-from-bottom-1 duration-200">
              <p className="text-xs text-foreground/80">{q.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {answered && (
        <div className="flex justify-end">
          <Button onClick={handleNext} className="gap-1.5">
            {current < quiz.questions.length - 1 ? "Next Question" : "See Results"}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Module Viewer ──────────────────────────────────────────────

function ModuleViewer({ module, onBack, isCompleted }: { module: TrainingModule; onBack: () => void; isCompleted: boolean }) {
  const [currentSection, setCurrentSection] = useState(0);
  const isLast = currentSection === module.sections.length - 1;

  const handleComplete = () => {
    if (!isCompleted) {
      markTrainingComplete(module.id);
      addXP(module.xpReward);
    }
    onBack();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
        <span className="text-xs font-mono text-muted-foreground/60">{currentSection + 1} / {module.sections.length}</span>
      </div>

      <div>
        <h2 className="text-lg font-bold text-foreground">{module.title}</h2>
        <Progress value={((currentSection + 1) / module.sections.length) * 100} className="h-1 mt-3 bg-white/[0.06]" />
      </div>

      {/* Section nav */}
      <div className="flex gap-1">
        {module.sections.map((s, i) => (
          <button
            key={i}
            onClick={() => setCurrentSection(i)}
            className={cn(
              "text-[10px] px-2.5 py-1 rounded-full transition-colors",
              i === currentSection ? "bg-primary/20 text-primary font-medium" : "text-muted-foreground/40 hover:text-muted-foreground"
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Content */}
      <Card className="border-white/[0.04] bg-card">
        <CardContent className="p-6 space-y-4">
          <h3 className="text-base font-semibold text-foreground">{module.sections[currentSection].title}</h3>
          <p className="text-sm text-foreground/80 leading-relaxed">{module.sections[currentSection].content}</p>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          disabled={currentSection === 0}
          onClick={() => setCurrentSection((c) => c - 1)}
          className="gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Previous
        </Button>

        {isLast ? (
          <Button onClick={handleComplete} className="gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {isCompleted ? "Done" : "Complete Module"}
          </Button>
        ) : (
          <Button onClick={() => setCurrentSection((c) => c + 1)} className="gap-1.5">
            Next <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
