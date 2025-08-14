'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BookOpen, Brain, Target, Clock, TrendingUp, Users, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import StudySession from '@/components/StudySession';
import ProgressChart from '@/components/ProgressChart';
import RecentTopics from '@/components/RecentTopics';
import { cn } from '@/lib/utils';

interface StudyFormData {
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  focus: 'concepts' | 'practice' | 'review' | 'mixed';
}

export default function HomePage() {
  const [isStudying, setIsStudying] = useState(false);
  const [currentTopic, setCurrentTopic] = useState('');
  const [studyData, setStudyData] = useState<StudyFormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<StudyFormData>();

  const onSubmit = async (data: StudyFormData) => {
    try {
      setCurrentTopic(data.topic);
      setStudyData(data);
      setIsStudying(true);
      toast.success(`Starting study session for: ${data.topic}`);
    } catch (error) {
      toast.error('Failed to start study session');
      console.error('Study session error:', error);
    }
  };

  const handleEndSession = () => {
    setIsStudying(false);
    setCurrentTopic('');
    setStudyData(null);
    reset();
    toast.success('Study session ended. Great work!');
  };

  if (isStudying && studyData) {
    return (
      <StudySession
        topic={currentTopic}
        difficulty={studyData.difficulty}
        focus={studyData.focus}
        onEndSession={handleEndSession}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Study Assistant</h1>
                <p className="text-sm text-gray-600">Powered by GPT-4</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900">
                <Users className="h-5 w-5" />
              </button>
              <button className="text-gray-600 hover:text-gray-900">
                <TrendingUp className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Master Any Topic with AI
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get personalized study sessions, practice questions, and detailed explanations 
            tailored to your learning style and difficulty level.
          </p>
        </div>

        {/* Main Study Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Topic Input */}
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                  What would you like to study today?
                </label>
                <input
                  {...register('topic', { 
                    required: 'Topic is required',
                    minLength: { value: 3, message: 'Topic must be at least 3 characters' }
                  })}
                  type="text"
                  id="topic"
                  placeholder="e.g., Quantum Physics, JavaScript Promises, Organic Chemistry..."
                  className={cn(
                    "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
                    errors.topic ? "border-red-300" : "border-gray-300"
                  )}
                />
                {errors.topic && (
                  <p className="mt-1 text-sm text-red-600">{errors.topic.message}</p>
                )}
              </div>

              {/* Difficulty Selection */}
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  {...register('difficulty', { required: 'Difficulty is required' })}
                  id="difficulty"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="beginner">Beginner - New to the topic</option>
                  <option value="intermediate">Intermediate - Some knowledge</option>
                  <option value="advanced">Advanced - Deep understanding</option>
                </select>
              </div>

              {/* Focus Area */}
              <div>
                <label htmlFor="focus" className="block text-sm font-medium text-gray-700 mb-2">
                  Focus Area
                </label>
                <select
                  {...register('focus', { required: 'Focus area is required' })}
                  id="focus"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="concepts">Core Concepts - Understanding fundamentals</option>
                  <option value="practice">Practice Problems - Hands-on exercises</option>
                  <option value="review">Review & Test - Assess knowledge</option>
                  <option value="mixed">Mixed Approach - Balanced learning</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center space-x-2",
                  isSubmitting 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5"
                )}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Preparing Session...</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="h-5 w-5" />
                    <span>Start Learning</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Personalized Learning</h3>
            </div>
            <p className="text-gray-600">
              AI adapts to your knowledge level and learning style for optimal comprehension.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Instant Feedback</h3>
            </div>
            <p className="text-gray-600">
              Get immediate explanations and corrections to reinforce your understanding.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Progress Tracking</h3>
            </div>
            <p className="text-gray-600">
              Monitor your learning journey with detailed analytics and insights.
            </p>
          </div>
        </div>

        {/* Stats and Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progress Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h3>
            <ProgressChart />
          </div>

          {/* Recent Topics */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Study Topics</h3>
            <RecentTopics />
          </div>
        </div>
      </main>
    </div>
  );
}
// Add dark mode support
// Improve responsive design
