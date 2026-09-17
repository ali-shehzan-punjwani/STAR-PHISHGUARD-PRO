import React, { useState } from 'react';
import { SECURITY_TIPS, QUIZ_QUESTIONS } from '../data/tips';
import {
  GraduationCap,
  Lightbulb,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const SecurityTips: React.FC = () => {
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[activeQuizIndex];

  const handleAnswer = (userChoice: boolean) => {
    if (showExplanation) return;
    setSelectedAnswer(userChoice);
    setShowExplanation(true);
    if (userChoice === currentQ.isPhishing) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (activeQuizIndex < QUIZ_QUESTIONS.length - 1) {
      setActiveQuizIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setActiveQuizIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizScore(0);
    setQuizFinished(false);
  };

  return (
    <div id="security-tips-view" className="max-w-4xl mx-auto space-y-8 pb-12 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>🎓 Security Tips</span>
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Simple, essential cybersecurity guidelines every email user should know.
        </p>
      </div>

      {/* 5 Core Tip Cards from Prompt #15 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SECURITY_TIPS.map((tip) => (
          <div
            key={tip.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-indigo-200 transition-colors space-y-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl select-none">{tip.icon}</span>
              <h2 className="text-base font-extrabold text-slate-900">
                {tip.title}
              </h2>
            </div>

            <p className="text-sm font-semibold text-slate-800">
              {tip.summary}
            </p>

            <p className="text-xs text-slate-600 leading-relaxed">
              {tip.advice}
            </p>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 italic">
              <strong className="font-bold text-slate-700 not-italic block mb-0.5">Example clue:</strong>
              {tip.example}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Quick Phishing Challenge */}
      <div className="rounded-2xl border border-blue-200 bg-gradient-to-b from-blue-50/40 to-white p-6 md:p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-blue-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Interactive Practice Quiz
              </h3>
              <p className="text-xs text-slate-500">
                Can you spot whether this email is Safe or Phishing?
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-blue-700 bg-blue-100/80 px-2.5 py-1 rounded-full">
            Question {activeQuizIndex + 1} of {QUIZ_QUESTIONS.length}
          </span>
        </div>

        {!quizFinished ? (
          <div className="space-y-4">
            {/* Email Card to Evaluate */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
              <div className="text-xs text-slate-500 border-b border-slate-100 pb-2 space-y-1">
                <div><span className="font-bold text-slate-700">From:</span> {currentQ.emailSender}</div>
                <div><span className="font-bold text-slate-700">Subject:</span> {currentQ.emailSubject}</div>
              </div>
              <div className="text-xs text-slate-800 font-mono bg-slate-50/80 p-3 rounded-lg leading-relaxed">
                {currentQ.emailBody}
              </div>
            </div>

            {/* Answer Buttons */}
            {!showExplanation ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleAnswer(true)}
                  className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  <span>🚨 Phishing Attack</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAnswer(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>✅ Legitimate Email</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 animate-fadeIn">
                <div
                  className={`p-4 rounded-xl border ${
                    selectedAnswer === currentQ.isPhishing
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-rose-50 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-extrabold text-sm mb-1">
                    {selectedAnswer === currentQ.isPhishing ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Correct Assessment!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Incorrect Evaluation</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed">{currentQ.explanation}</p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all"
                  >
                    <span>{activeQuizIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Scenario' : 'View Results'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 space-y-3 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-extrabold text-slate-900">Quiz Completed!</h4>
            <p className="text-sm text-slate-600">
              You scored <strong className="text-blue-600">{quizScore} / {QUIZ_QUESTIONS.length}</strong> on phishing detection skills.
            </p>
            <button
              type="button"
              onClick={resetQuiz}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Practice Quiz</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
