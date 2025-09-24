import React, { useState } from 'react';
import { INTERVIEW_QUESTIONS } from '../constants';
import QuestionCard from './QuestionCard';
import SparklesIcon from './icons/SparklesIcon';
import TrashIcon from './icons/TrashIcon';

const InterviewPage: React.FC = () => {
  const [isTimerEnabled, setIsTimerEnabled] = useState(true);

  const handleClearAllAnswers = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to clear all your saved answers? This action cannot be undone."
    );

    if (isConfirmed) {
      INTERVIEW_QUESTIONS.forEach(question => {
        localStorage.removeItem(`interview_answer_${question.id}`);
      });
      // Reload the page to reflect the changes
      window.location.reload();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-12 animate-fade-in-down">
         <div className="inline-flex items-center gap-3 bg-purple-500/10 text-purple-300 rounded-full px-4 py-2 mb-4">
            <SparklesIcon className="w-5 h-5"/>
            <span className="font-medium">Your Personal Interview Coach</span>
         </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          Mock Interview Practice
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
          Answer each question below. When you're ready, click "Get AI Feedback" to receive personalized tips.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className={`font-medium transition-colors ${isTimerEnabled ? 'text-purple-300' : 'text-slate-400'}`}>
            Timed Mode
          </span>
          <button
            onClick={() => setIsTimerEnabled(!isTimerEnabled)}
            role="switch"
            aria-checked={isTimerEnabled}
            className={`${
              isTimerEnabled ? 'bg-purple-600' : 'bg-slate-700'
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
          >
            <span
              aria-hidden="true"
              className={`${
                isTimerEnabled ? 'translate-x-5' : 'translate-x-0'
              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
          </button>
        </div>
      </header>
      
      <main className="space-y-8 mt-8">
        {INTERVIEW_QUESTIONS.map((q, index) => (
          <div key={q.id} style={{ animation: `fade-in-up 0.5s ${index * 0.1}s ease-out forwards`, opacity: 0 }}>
            <QuestionCard question={q} isTimerEnabled={isTimerEnabled} />
          </div>
        ))}
      </main>
      <footer className="text-center mt-12 text-slate-500 space-y-4">
        <button
          onClick={handleClearAllAnswers}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-md shadow-sm hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 transition-all transform hover:scale-105"
        >
          <TrashIcon className="w-4 h-4" />
          Clear All Saved Answers
        </button>
        <p>Good luck with your practice!</p>
      </footer>
       <style>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out forwards;
        }
       `}</style>
    </div>
  );
};

export default InterviewPage;