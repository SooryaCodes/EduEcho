'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/api";
import { Brain, Zap, Target, Book, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const subjects = [
  "Computer Science", "Mathematics", "Physics", "Chemistry", 
  "Biology", "Engineering", "Business", "Languages", "History", "Other"
];

const questions = [
  {
    id: 1,
    question: "When learning a new concept, I prefer:",
    options: [
      { value: "quick", label: "Quick summaries and key points", type: "QuickLearner" },
      { value: "detailed", label: "In-depth explanations with examples", type: "FullMark" },
      { value: "balanced", label: "A mix of both", type: "Average" },
      { value: "simple", label: "Simple, easy-to-understand basics", type: "Beginner" },
    ]
  },
  {
    id: 2,
    question: "How do you approach problem-solving?",
    options: [
      { value: "fast", label: "I like to solve problems quickly", type: "QuickLearner" },
      { value: "thorough", label: "I analyze every detail carefully", type: "FullMark" },
      { value: "moderate", label: "I balance speed and thoroughness", type: "Average" },
      { value: "guided", label: "I need step-by-step guidance", type: "Beginner" },
    ]
  },
  {
    id: 3,
    question: "Your ideal study material is:",
    options: [
      { value: "concise", label: "Bullet points and short notes", type: "QuickLearner" },
      { value: "comprehensive", label: "Detailed textbooks and papers", type: "FullMark" },
      { value: "mixed", label: "Mix of summaries and details", type: "Average" },
      { value: "visual", label: "Videos and simple explanations", type: "Beginner" },
    ]
  },
  {
    id: 4,
    question: "When you get stuck on a topic:",
    options: [
      { value: "search", label: "I quickly search for solutions", type: "QuickLearner" },
      { value: "research", label: "I deep dive into research", type: "FullMark" },
      { value: "ask", label: "I ask for help and explore", type: "Average" },
      { value: "basics", label: "I go back to basics first", type: "Beginner" },
    ]
  },
  {
    id: 5,
    question: "Your learning goal is to:",
    options: [
      { value: "efficient", label: "Learn efficiently and move fast", type: "QuickLearner" },
      { value: "mastery", label: "Achieve complete mastery", type: "FullMark" },
      { value: "practical", label: "Understand practical applications", type: "Average" },
      { value: "foundation", label: "Build strong foundations", type: "Beginner" },
    ]
  }
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const currentQuestion = questions[step];
  const progress = ((step + 1) / (questions.length + 1)) * 100;

  const calculateLearnerType = () => {
    const typeCount: Record<string, number> = {};
    
    Object.values(answers).forEach((answer) => {
      const option = questions
        .flatMap(q => q.options)
        .find(opt => opt.value === answer);
      
      if (option) {
        typeCount[option.type] = (typeCount[option.type] || 0) + 1;
      }
    });

    return Object.entries(typeCount).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setStep(questions.length);
    }
  };

  const handleComplete = async () => {
    if (selectedSubjects.length === 0) {
      toast.error("Please select at least one subject");
      return;
    }

    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const learnerType = calculateLearnerType();

      await api.put(`/users/${user._id}`, {
        type: learnerType,
        // Store subjects in user metadata
      });

      // Update local storage
      localStorage.setItem("user", JSON.stringify({
        ...user,
        type: learnerType,
      }));

      toast.success("Profile setup complete!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to complete setup");
    } finally {
      setLoading(false);
    }
  };

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Let's personalize your learning</h1>
          <p className="text-muted-foreground">Answer a few questions to help us understand your learning style</p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <Progress value={progress} className="mb-4" />
            <CardTitle>
              {step < questions.length ? `Question ${step + 1} of ${questions.length}` : "Select Your Interests"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {step < questions.length ? (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <p className="text-lg font-medium">{currentQuestion.question}</p>
                  
                  <RadioGroup
                    value={answers[currentQuestion.id]}
                    onValueChange={(value) => setAnswers({ ...answers, [currentQuestion.id]: value })}
                  >
                    {currentQuestion.options.map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg border-2 hover:border-primary/50 transition-colors cursor-pointer">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  <div className="flex justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setStep(Math.max(0, step - 1))}
                      disabled={step === 0}
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={!answers[currentQuestion.id]}
                    >
                      Next
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <p className="text-lg font-medium">What subjects are you interested in?</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {subjects.map((subject) => (
                      <Badge
                        key={subject}
                        variant={selectedSubjects.includes(subject) ? "default" : "outline"}
                        className="cursor-pointer px-4 py-2 text-sm hover:bg-primary/90 transition-colors"
                        onClick={() => toggleSubject(subject)}
                      >
                        {subject}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setStep(questions.length - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={handleComplete}
                      disabled={loading || selectedSubjects.length === 0}
                      className="bg-gradient-to-r from-primary to-primary/80"
                    >
                      {loading ? "Completing..." : "Complete Setup"}
                      <Sparkles className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-center gap-2">
          {[...Array(questions.length + 1)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === step ? "bg-primary" : i < step ? "bg-primary/50" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

