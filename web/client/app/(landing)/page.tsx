'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { ArrowRight, Mic, Brain, Trophy, BookOpen, Search, TrendingUp, Users, Zap, MessageSquare, Star, Volume2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-card flex items-center justify-center">
              <span className="text-white font-bold text-2xl font-cabinet">E</span>
            </div>
            <span className="font-cabinet font-bold text-2xl">EduEcho</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="#features" className="hidden md:block text-sm font-medium hover:text-[rgb(108,93,211)] transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="hidden md:block text-sm font-medium hover:text-[rgb(108,93,211)] transition-colors">
              How it Works
            </Link>
            <ThemeToggle />
            <Button variant="ghost" asChild className="font-medium">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild className="bg-purple-card hover:bg-[rgb(129,140,248)] font-medium rounded-2xl h-11 px-6">
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-24 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-light-purple text-[rgb(108,93,211)] text-sm font-semibold">
                <Zap className="w-4 h-4 mr-2" />
                AI-Powered Learning Platform
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-cabinet font-bold tracking-tight leading-[1.05]">
                Learn from{" "}
                <span className="text-[rgb(108,93,211)]">peers</span>,
                <br />powered by AI
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                Voice-enabled Q&A platform with AI evaluation, personalized ranking, and semantic search. 
                Experience the future of collaborative learning.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" asChild className="bg-purple-card hover:bg-[rgb(129,140,248)] text-base h-14 px-8 font-semibold rounded-2xl">
                  <Link href="/auth/signup">
                    Start Learning Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-base h-14 px-8 font-semibold rounded-2xl">
                  <Link href="#features">
                    Explore Features
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-12 pt-8">
                <div>
                  <div className="font-cabinet font-bold text-4xl text-[rgb(108,93,211)]">50K+</div>
                  <div className="text-sm text-muted-foreground mt-1">Active Learners</div>
                </div>
                <div>
                  <div className="font-cabinet font-bold text-4xl text-[rgb(108,93,211)]">100K+</div>
                  <div className="text-sm text-muted-foreground mt-1">Questions Answered</div>
                </div>
                <div>
                  <div className="font-cabinet font-bold text-4xl text-[rgb(108,93,211)]">8.5</div>
                  <div className="text-sm text-muted-foreground mt-1">Avg AI Score</div>
                </div>
              </div>
            </motion.div>

            {/* Hero Bento Grid */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="grid grid-cols-6 gap-4">
                {/* Voice Q&A Card - Large */}
                <div className="col-span-6 bg-purple-card text-white p-8 rounded-3xl">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Mic className="w-6 h-6" />
                        <span className="font-cabinet font-bold text-xl">Voice Q&A</span>
                      </div>
                      <p className="text-sm opacity-90">Ask anything with your voice</p>
                    </div>
                    <Volume2 className="w-6 h-6 opacity-70" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-1 bg-white/30 rounded-full flex-1" />
                      <span className="text-xs opacity-70">2:34</span>
                    </div>
                    <div className="flex gap-2">
                      {[40, 60, 50, 70, 45, 80, 60, 90, 70, 50, 65, 75, 55, 85, 60, 70].map((h, i) => (
                        <div key={i} className="flex-1 bg-white/40 rounded-full" style={{ height: `${h}%`, minHeight: '20px' }} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="col-span-3 bg-bg-yellow-card p-6 rounded-3xl">
                  <Trophy className="w-8 h-8 text-amber-700 mb-4" />
                  <div className="font-cabinet font-bold text-4xl text-foreground mb-1">8.5</div>
                  <div className="text-sm font-medium">Avg AI Score</div>
                </div>

                <div className="col-span-3 bg-card border p-6 rounded-3xl">
                  <Users className="w-8 h-8 text-[rgb(108,93,211)] mb-4" />
                  <div className="font-cabinet font-bold text-4xl mb-1">50K+</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>

                {/* Features Row */}
                <div className="col-span-2 bg-light-purple p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                  <Brain className="w-8 h-8 text-[rgb(108,93,211)] mb-2" />
                  <div className="text-xs font-semibold">AI Powered</div>
                </div>

                <div className="col-span-2 bg-light-yellow p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                  <Star className="w-8 h-8 text-amber-600 mb-2" />
                  <div className="text-xs font-semibold">Top Rated</div>
                </div>

                <div className="col-span-2 bg-card border p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                  <TrendingUp className="w-8 h-8 text-emerald-600 mb-2" />
                  <div className="text-xs font-semibold">Growing Fast</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="bg-muted/30 py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-5xl lg:text-6xl font-cabinet font-bold tracking-tight mb-6">
                Everything you need to <span className="text-[rgb(108,93,211)]">excel</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Powerful features designed for modern learners
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className={`p-8 h-full rounded-3xl border-0 hover:shadow-xl transition-shadow ${feature.bgClass}`}>
                    <div className={`w-14 h-14 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-6`}>
                      <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                    </div>
                    <h3 className="text-2xl font-cabinet font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-5xl lg:text-6xl font-cabinet font-bold tracking-tight mb-6">
                How it <span className="text-[rgb(108,93,211)]">works</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Simple steps to supercharge your learning
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-12">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-purple-card text-white flex items-center justify-center text-3xl font-cabinet font-bold mx-auto mb-6">
                    {index + 1}
                  </div>
                  <h3 className="text-2xl font-cabinet font-bold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="bg-purple-card text-white p-16 text-center rounded-[3rem]">
              <h2 className="text-5xl lg:text-6xl font-cabinet font-bold tracking-tight mb-6">
                Ready to transform<br />your learning?
              </h2>
              <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                Join thousands of learners already using EduEcho to achieve their academic goals
              </p>
              <Button size="lg" asChild className="bg-white text-[rgb(108,93,211)] hover:bg-white/90 text-base h-14 px-10 font-semibold rounded-2xl">
                <Link href="/auth/signup">
                  Create Free Account
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-6 py-16">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div className="col-span-2 space-y-4">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-card flex items-center justify-center">
                  <span className="text-white font-bold text-xl font-cabinet">E</span>
                </div>
                <span className="font-cabinet font-bold text-xl">EduEcho</span>
              </Link>
              <p className="text-muted-foreground">
                AI-powered adaptive peer learning platform for the modern student
              </p>
            </div>
            
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h4 className="font-cabinet font-bold mb-4">{group.title}</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {group.links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="hover:text-[rgb(108,93,211)] transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} EduEcho. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Mic,
    title: "Voice Q&A",
    description: "Ask and answer with voice. AI transcribes and evaluates everything instantly.",
    bgClass: "bg-light-purple",
    iconBg: "bg-white",
    iconColor: "text-[rgb(108,93,211)]"
  },
  {
    icon: Brain,
    title: "AI Evaluation",
    description: "Every answer scored on clarity, relevance, depth, and confidence automatically.",
    bgClass: "bg-card border",
    iconBg: "bg-light-purple",
    iconColor: "text-[rgb(108,93,211)]"
  },
  {
    icon: TrendingUp,
    title: "Personalized",
    description: "Content adapted to your learning style. QuickLearner, FullMark, or Beginner.",
    bgClass: "bg-light-yellow",
    iconBg: "bg-white",
    iconColor: "text-amber-600"
  },
  {
    icon: Trophy,
    title: "Gamification",
    description: "Earn points, climb leaderboards. Make learning competitive and rewarding.",
    bgClass: "bg-card border",
    iconBg: "bg-light-yellow",
    iconColor: "text-amber-600"
  },
  {
    icon: BookOpen,
    title: "Smart Notebooks",
    description: "Save explanations and generate AI flashcards for efficient studying.",
    bgClass: "bg-light-purple",
    iconBg: "bg-white",
    iconColor: "text-[rgb(108,93,211)]"
  },
  {
    icon: Search,
    title: "Semantic Search",
    description: "Find answers by meaning, not keywords. Powered by vector embeddings.",
    bgClass: "bg-card border",
    iconBg: "bg-light-purple",
    iconColor: "text-[rgb(108,93,211)]"
  }
];

const steps = [
  {
    title: "Create Account",
    description: "Sign up in seconds and tell us about your learning style and goals."
  },
  {
    title: "Ask or Answer",
    description: "Post questions with voice or text. Help others by sharing your knowledge."
  },
  {
    title: "Learn & Grow",
    description: "Get AI-evaluated answers, earn points, and track your progress on the leaderboard."
  }
];

const footerLinks = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "#features" },
      { name: "How it Works", href: "#how-it-works" },
      { name: "Pricing", href: "#" }
    ]
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Careers", href: "#" }
    ]
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy", href: "#" },
      { name: "Terms", href: "#" },
      { name: "Security", href: "#" }
    ]
  }
];
