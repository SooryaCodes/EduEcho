'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserStore } from "@/stores/user-store";
import api from "@/lib/api";
import { Loader2, Brain, Zap, Target, BookOpen } from "lucide-react";

const learnerTypes = [
  {
    value: "QuickLearner",
    title: "Quick Learner",
    description: "I prefer short, direct answers to get to the point fast",
    icon: Zap,
    color: "bg-bg-yellow-card"
  },
  {
    value: "FullMark",
    title: "Full-Mark Learner",
    description: "I want deep, detailed explanations with examples",
    icon: Target,
    color: "bg-purple-card"
  },
  {
    value: "Average",
    title: "Balanced Learner",
    description: "I like a mix of concise and detailed explanations",
    icon: Brain,
    color: "bg-light-purple"
  },
  {
    value: "Beginner",
    title: "Beginner",
    description: "I need simple, easy-to-understand explanations",
    icon: BookOpen,
    color: "bg-light-yellow"
  }
];

const topics = [
  "Computer Science", "Mathematics", "Physics", "Chemistry", 
  "Biology", "Economics", "Literature", "History",
  "Engineering", "Business", "Psychology", "Languages"
];

export default function OnboardingPage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: "",
    interests: [] as string[],
  });

  const handleNext = () => {
    if (step === 1 && !formData.type) {
      toast.error("Please select a learning type");
      return;
    }
    if (step === 2 && formData.interests.length === 0) {
      toast.error("Please select at least one topic");
      return;
    }
    setStep(step + 1);
  };

  const handleFinish = async () => {
    if (formData.interests.length === 0) {
      toast.error("Please select at least one topic");
      return;
    }

    setLoading(true);

    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        toast.error("User not found. Please sign up again.");
        router.push("/auth/signup");
        return;
      }

      const userData = JSON.parse(storedUser);
      
      // Update user with learning type and interests
      const response: any = await api.put(`/users/${userData._id}`, {
        type: formData.type,
        interests: formData.interests,
      });

      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));

      toast.success("Profile completed!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to complete onboarding");
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(topic)
        ? prev.interests.filter(t => t !== topic)
        : [...prev.interests, topic]
    }));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">Step {step} of 2</span>
            <span className="text-sm font-medium text-muted-foreground">{Math.round((step / 2) * 100)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-card transition-all duration-300"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        </div>

        <Card className="border-0 shadow-xl rounded-3xl p-8 md:p-12">
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <h1 className="text-4xl font-cabinet font-bold">Welcome to EduEcho!</h1>
                <p className="text-lg text-muted-foreground">
                  Let's personalize your learning experience
                </p>
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-cabinet font-bold">What's your learning style?</Label>
                <RadioGroup value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <div className="grid gap-4">
                    {learnerTypes.map((type) => (
                      <label
                        key={type.value}
                        className={`relative flex items-start space-x-4 p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                          formData.type === type.value
                            ? "border-[rgb(108,93,211)] bg-light-purple"
                            : "border-border hover:border-[rgb(108,93,211)]/50"
                        }`}
                      >
                        <RadioGroupItem value={type.value} className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-10 h-10 rounded-xl ${type.color} flex items-center justify-center ${type.value === 'FullMark' ? 'text-white' : 'text-foreground'}`}>
                              <type.icon className="w-5 h-5" />
                            </div>
                            <div className="font-cabinet font-bold text-lg">{type.title}</div>
                          </div>
                          <p className="text-muted-foreground">{type.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <Button 
                onClick={handleNext} 
                className="w-full h-12 bg-purple-card hover:bg-[rgb(129,140,248)] rounded-2xl font-semibold"
                disabled={!formData.type}
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center space-y-3">
                <h1 className="text-4xl font-cabinet font-bold">Choose your interests</h1>
                <p className="text-lg text-muted-foreground">
                  Select topics you want to learn about
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {topics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => toggleInterest(topic)}
                    className={`p-4 rounded-2xl border-2 font-medium transition-all ${
                      formData.interests.includes(topic)
                        ? "border-[rgb(108,93,211)] bg-light-purple text-[rgb(108,93,211)]"
                        : "border-border hover:border-[rgb(108,93,211)]/50"
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setStep(1)} 
                  className="flex-1 h-12 rounded-2xl font-semibold"
                  disabled={loading}
                >
                  Back
                </Button>
                <Button 
                  onClick={handleFinish} 
                  className="flex-1 h-12 bg-purple-card hover:bg-[rgb(129,140,248)] rounded-2xl font-semibold"
                  disabled={loading || formData.interests.length === 0}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    "Complete Setup"
                  )}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
