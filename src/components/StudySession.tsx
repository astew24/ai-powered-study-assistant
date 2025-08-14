'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Lightbulb, 
  BookOpen, 
  Target,
  Clock,
  Brain,
  Save,
  Share2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';

interface StudySessionProps {
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  focus: 'concepts' | 'practice' | 'review' | 'mixed';
  onEndSession: () => void;
}

interface Question {
  id: string;
  question: string;
  options?: string[];
  correctAnswer?: string;
  explanation: string;
  type: 'multiple-choice' | 'open-ended' | 'true-false';
}

interface StudyContent {
  concepts: string[];
  questions: Question[];
  summary: string;
}

export default function StudySession({
  topic,
  difficulty,
  focus,
  onEndSession
}: StudySessionProps) {
  const [currentStep, setCurrentStep] = useState<'concepts' | 'practice' | 'review'>('concepts');
  const [studyContent, setStudyContent] = useState<StudyContent | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionStartTime] = useState(Date.now());

  useEffect(() => {
    generateStudyContent();
  }, []);

  const generateStudyContent = async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call to OpenAI GPT-4
      // In production, this would be a real API call
      const mockContent: StudyContent = {
        concepts: [
          `**Core Concept 1**: Understanding the fundamental principles of ${topic}`,
          `**Core Concept 2**: Key terminology and definitions related to ${topic}`,
          `**Core Concept 3**: Practical applications and real-world examples`,
          `**Core Concept 4**: Common misconceptions and how to avoid them`
        ],
        questions: [
          {
            id: '1',
            question: `What is the primary definition of ${topic}?`,
            options: [
              'Option A: Basic definition',
              'Option B: Advanced definition', 
              'Option C: Technical definition',
              'Option D: Simplified definition'
            ],
            correctAnswer: 'Option A: Basic definition',
            explanation: `The primary definition of ${topic} is the most fundamental understanding that forms the basis for deeper learning.`,
            type: 'multiple-choice'
          },
          {
            id: '2',
            question: `Explain how ${topic} relates to its broader field of study.`,
            explanation: `${topic} serves as a foundational element that connects various aspects of its field, providing a framework for understanding complex relationships and applications.`,
            type: 'open-ended'
          },
          {
            id: '3',
            question: `True or False: ${topic} is only relevant in academic settings.`,
            options: ['True', 'False'],
            correctAnswer: 'False',
            explanation: `${topic} has practical applications beyond academic settings, including real-world scenarios and professional contexts.`,
            type: 'true-false'
          }
        ],
        summary: `${topic} represents a fundamental area of study that provides essential knowledge and skills. Understanding this topic requires grasping core concepts, practicing with relevant examples, and applying knowledge in various contexts.`
      };

      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStudyContent(mockContent);
      setIsLoading(false);
      toast.success('Study content generated successfully!');
    } catch (error) {
      toast.error('Failed to generate study content');
      console.error('Content generation error:', error);
    }
  };

  const handleAnswerSubmit = (questionId: string, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (studyContent?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
    } else {
      setCurrentStep('review');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowExplanation(false);
    }
  };

  const getCurrentQuestion = () => {
    return studyContent?.questions[currentQuestionIndex];
  };

  const calculateScore = () => {
    if (!studyContent) return 0;
    
    let correct = 0;
    studyContent.questions.forEach(q => {
      if (q.correctAnswer && userAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    
    return Math.round((correct / studyContent.questions.length) * 100);
  };

  const getSessionDuration = () => {
    const duration = Date.now() - sessionStartTime;
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Generating Study Content</h2>
          <p className="text-gray-600">AI is preparing personalized learning materials for you...</p>
        </div>
      </div>
    );
  }

  if (!studyContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Failed to Load Content</h2>
          <button
            onClick={generateStudyContent}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={onEndSession}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>End Session</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{topic}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{getSessionDuration()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Brain className="h-4 w-4" />
                <span className="capitalize">{difficulty}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {['concepts', 'practice', 'review'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                    ${currentStep === step 
                      ? 'bg-blue-600 text-white' 
                      : index < ['concepts', 'practice', 'review'].indexOf(currentStep)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                    }
                  `}
                >
                  {index + 1}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 capitalize">
                  {step}
                </span>
                {index < 2 && (
                  <div className="ml-4 w-16 h-0.5 bg-gray-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          {currentStep === 'concepts' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Core Concepts</h2>
                <p className="text-gray-600">Let's start by understanding the fundamental concepts</p>
              </div>
              
              <div className="space-y-4">
                {studyContent.concepts.map((concept, index) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight, rehypeRaw]}
                      className="prose prose-sm max-w-none"
                    >
                      {concept}
                    </ReactMarkdown>
                  </div>
                ))}
              </div>

              <div className="text-center pt-6">
                <button
                  onClick={() => setCurrentStep('practice')}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue to Practice
                </button>
              </div>
            </div>
          )}

          {currentStep === 'practice' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Target className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Practice Questions</h2>
                <p className="text-gray-600">
                  Question {currentQuestionIndex + 1} of {studyContent.questions.length}
                </p>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {getCurrentQuestion()?.question}
                  </h3>

                  {getCurrentQuestion()?.type === 'multiple-choice' && (
                    <div className="space-y-3">
                      {getCurrentQuestion()?.options?.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSubmit(getCurrentQuestion()?.id || '', option)}
                          disabled={showExplanation}
                          className={`
                            w-full p-3 text-left rounded-lg border transition-colors
                            ${showExplanation
                              ? option === getCurrentQuestion()?.correctAnswer
                                ? 'bg-green-100 border-green-300'
                                : 'bg-red-100 border-red-300'
                              : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                            }
                          `}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}

                  {getCurrentQuestion()?.type === 'true-false' && (
                    <div className="space-y-3">
                      {getCurrentQuestion()?.options?.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSubmit(getCurrentQuestion()?.id || '', option)}
                          disabled={showExplanation}
                          className={`
                            w-full p-3 text-left rounded-lg border transition-colors
                            ${showExplanation
                              ? option === getCurrentQuestion()?.correctAnswer
                                ? 'bg-green-100 border-green-300'
                                : 'bg-red-100 border-red-300'
                              : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                            }
                          `}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}

                  {getCurrentQuestion()?.type === 'open-ended' && (
                    <div className="space-y-4">
                      <textarea
                        placeholder="Type your answer here..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={4}
                        onChange={(e) => setUserAnswers(prev => ({ ...prev, [getCurrentQuestion()?.id || '']: e.target.value }))}
                      />
                      <button
                        onClick={() => setShowExplanation(true)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Submit Answer
                      </button>
                    </div>
                  )}
                </div>

                {showExplanation && (
                  <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <Lightbulb className="h-5 w-5 text-blue-600" />
                      <h4 className="font-medium text-blue-900">Explanation</h4>
                    </div>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight, rehypeRaw]}
                      className="prose prose-sm max-w-none text-blue-800"
                    >
                      {getCurrentQuestion()?.explanation}
                    </ReactMarkdown>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {currentQuestionIndex === (studyContent?.questions.length || 0) - 1 ? 'Finish' : 'Next'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 'review' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Complete!</h2>
                <p className="text-gray-600">Great job! Here's your performance summary</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{calculateScore()}%</div>
                  <div className="text-sm text-blue-700">Score</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{studyContent.questions.length}</div>
                  <div className="text-sm text-green-700">Questions</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{getSessionDuration()}</div>
                  <div className="text-sm text-purple-700">Duration</div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Session Summary</h3>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  className="prose prose-sm max-w-none"
                >
                  {studyContent.summary}
                </ReactMarkdown>
              </div>

              <div className="flex justify-center space-x-4 pt-6">
                <button
                  onClick={() => setCurrentStep('concepts')}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Review Again
                </button>
                <button
                  onClick={onEndSession}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  End Session
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
// Add study session history
// Add progress persistence
