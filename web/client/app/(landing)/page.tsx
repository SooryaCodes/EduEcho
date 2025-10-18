'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Users, MessageSquare, Brain, Zap, Star, Play, Heart, Bookmark } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/shared/Header';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Hero Section - PodPod Style */}
      <section className="relative overflow-hidden bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                <Zap className="w-4 h-4 mr-2" />
                AI-Powered Learning Platform
              </Badge>
              
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="gradient-text">Learn from peers,</span>
                  <br />
                  <span className="text-gray-900">powered by AI</span>
              </h1>
              
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Voice-enabled Q&A platform with AI evaluation, personalized ranking, and semantic search. 
                Experience the future of collaborative learning.
              </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-purple-gradient text-white hover:opacity-90 text-lg px-8 py-4">
                    Start Learning Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg" className="border-purple-200 text-purple-700 hover:bg-purple-50 text-lg px-8 py-4">
                    Explore Features
                </Button>
                </div>
              </div>

            {/* Right Side - Core Features */}
            <div className="grid grid-cols-1 gap-6">
              {/* Main Feature Card */}
              <Card className="bento-card-purple p-8">
                <div className="flex items-center justify-between mb-6">
                  <Badge className="bg-white/20 text-white border-white/20">
                    🎯 CORE FEATURE
                  </Badge>
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  AI-Powered Q&A Platform
                </h3>
                <p className="text-white/90 mb-6">
                  Ask questions using voice, get AI-evaluated answers, and learn from peer discussions with semantic search.
                </p>
                <div className="flex items-center gap-4 text-white/80 text-sm mb-6">
                  <span>🎤 Voice Input</span>
                  <span>🤖 AI Evaluation</span>
                  <span>🔍 Smart Search</span>
                </div>
                <Button className="bg-white/20 hover:bg-white/30 text-white w-full">
                  Try Voice Q&A
                  <Zap className="ml-2 w-4 h-4" />
                </Button>
              </Card>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bento-card-yellow p-6 text-center">
                  <div className="text-3xl font-bold text-gray-800 mb-2">50K+</div>
                  <p className="text-gray-700 font-medium">Active Learners</p>
                </Card>
                
                <Card className="bento-card-purple-secondary p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">8.5</div>
                  <p className="text-white/90 font-medium">AI Score Avg</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold gradient-text">50K+</div>
              <div className="text-gray-600">Active Learners</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold gradient-text">100K+</div>
              <div className="text-gray-600">Questions Answered</div>
                    </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold gradient-text">8.5</div>
              <div className="text-gray-600">Avg AI Score</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Advance learning</span> statistics to track your progress
              </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
              labore et dolore magna aliqua.
            </p>
          </div>

          <div className="bento-grid">
            {/* Large Purple Card */}
            <Card className="bento-card-purple lg:col-span-2 p-8">
              <div className="flex items-center justify-between mb-6">
                <Badge className="bg-white/20 text-white">Featured</Badge>
                <Bookmark className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Open your mind before
                <br />
                <span className="text-white/80">Open your mouse</span>
              </h3>
              <p className="text-white/80 mb-6">
                Experience AI-powered learning with voice interactions and personalized feedback.
              </p>
              <Button className="bg-white/20 hover:bg-white/30 text-white">
                Learn more
              </Button>
            </Card>

            {/* Yellow Card */}
            <Card className="bento-card-yellow p-6">
              <div className="flex items-center justify-between mb-4">
                <Brain className="w-8 h-8 text-gray-800" />
                <Badge className="bg-gray-800 text-yellow-400">AI</Badge>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                Smart Evaluation
              </h4>
              <p className="text-gray-700">
                AI-powered assessment and personalized learning paths.
              </p>
            </Card>

            {/* Black Card */}
            <Card className="bento-card-black p-6">
              <div className="flex items-center justify-between mb-4">
                <MessageSquare className="w-8 h-8 text-white" />
                <Badge className="bg-white/20 text-white">Live</Badge>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">
                Voice Q&A
              </h4>
              <p className="text-white/80">
                Ask questions using voice and get instant AI-powered responses.
              </p>
            </Card>

            {/* White Card */}
            <Card className="bento-card-white p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-purple-600" />
                <Badge className="bg-purple-100 text-purple-700">Community</Badge>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                Peer Learning
              </h4>
              <p className="text-gray-600">
                Learn from your peers and share knowledge in real-time.
              </p>
            </Card>

            {/* Purple Secondary Card */}
            <Card className="bento-card-purple-secondary lg:col-span-2 p-8">
              <div className="flex items-center justify-between mb-6">
                <Badge className="bg-white/20 text-white">Community</Badge>
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Join thousands of learners worldwide
              </h3>
              <p className="text-white/80 mb-6">
                Connect with students, professionals, and experts from around the globe.
              </p>
              <div className="flex gap-4">
                <Button className="bg-white/20 hover:bg-white/30 text-white">
                  Join Community
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  View Stats
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Ready to <span className="gradient-text">transform</span> your learning?
              </h2>
            <p className="text-xl text-gray-600">
              Join thousands of learners who are already experiencing the future of education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-purple-gradient text-white hover:opacity-90 text-lg px-8 py-4">
                Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-purple-200 text-purple-700 hover:bg-purple-50 text-lg px-8 py-4">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}