import React, { useState, useEffect, useRef } from 'react';
import { InterviewQuestion, AIFeedback } from '../types';
import { getAIFeedback } from '../services/geminiService';
import SparklesIcon from './icons/SparklesIcon';
import SaveIcon from './icons/SaveIcon';
import CheckIcon from './icons/CheckIcon';
import LightbulbIcon from './icons/LightbulbIcon';
import ArrowRightIcon from './icons/ArrowRightIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';
import ClockIcon from './icons/ClockIcon';
import PlayIcon from './icons/PlayIcon';
import PauseIcon from './icons/PauseIcon';
import ArrowPathIcon from './icons/ArrowPathIcon';
import ChatBubbleBottomCenterTextIcon from './icons/ChatBubbleBottomCenterTextIcon';
import MicrophoneIcon from './icons/MicrophoneIcon';

// Add SpeechRecognition types to the global window object for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface QuestionCardProps {
  question: InterviewQuestion;
  isTimerEnabled: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, isTimerEnabled }) => {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showExample, setShowExample] = useState(false);

  // Timer state
  const [time, setTime] = useState(120); // 2 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Voice input state
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null); // Using 'any' for SpeechRecognition instance
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);


  const storageKey = `interview_answer_${question.id}`;

  useEffect(() => {
    const savedAnswer = localStorage.getItem(storageKey);
    if (savedAnswer) {
      setAnswer(savedAnswer);
    }
  }, [storageKey]);
  
  // Setup speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setAnswer(prev => (prev ? prev + ' ' : '') + finalTranscript);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };
      
      recognition.onerror = (event: any) => {
        setError(`Speech recognition error: ${event.error}. Please ensure microphone access is allowed.`);
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } else {
        setIsSpeechSupported(false);
    }

    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };
  }, []);

  useEffect(() => {
    if (isTimerRunning && time > 0) {
      timerRef.current = setTimeout(() => setTime(time - 1), 1000);
    } else if (time === 0) {
      setIsTimerRunning(false);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isTimerRunning, time]);

  const handleSave = () => {
    localStorage.setItem(storageKey, answer);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleGetFeedback = async () => {
    if (!answer.trim()) {
      setError("Please provide an answer before getting feedback.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setFeedback(null);
    try {
      const result = await getAIFeedback(question.question, answer);
      setFeedback(result);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setError(null);
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const startTimer = () => {
    if (time === 0) setTime(120); // Reset if finished
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTime(120);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const feedbackHasContent = feedback && (feedback.betterIdeas?.length > 0 || feedback.vocabularyBoost?.length > 0 || feedback.grammarFixes?.length > 0);

  return (
    <div className="bg-black/30 backdrop-blur-xl rounded-2xl shadow-lg ring-1 ring-white/20 overflow-hidden transition-all duration-300 hover:shadow-purple-500/10">
      <div className="p-6">
        <div className="flex justify-between items-start gap-4">
            <div>
                <p className="text-sm font-semibold text-purple-400">Question {question.id}</p>
                <h3 className="mt-1 text-xl font-bold text-white">{question.question}</h3>
            </div>
            {isTimerEnabled && (
                <div className="flex flex-shrink-0 items-center gap-2 text-slate-300 bg-slate-800/60 px-3 py-1.5 rounded-lg">
                    <ClockIcon className="w-5 h-5" />
                    <span className={`font-mono text-lg ${time === 0 ? 'text-red-400' : 'text-white'}`}>{formatTime(time)}</span>
                    {!isTimerRunning && time > 0 && <button onClick={startTimer} className="text-slate-300 hover:text-white"><PlayIcon className="w-5 h-5"/></button>}
                    {isTimerRunning && <button onClick={pauseTimer} className="text-slate-300 hover:text-white"><PauseIcon className="w-5 h-5"/></button>}
                    <button onClick={resetTimer} className="text-slate-300 hover:text-white"><ArrowPathIcon className="w-5 h-5"/></button>
                </div>
            )}
        </div>

        <div className="mt-4 relative">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here, or use the microphone..."
            className="w-full h-32 p-3 pr-14 bg-slate-900/70 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          />
          {isSpeechSupported && (
            <button
                onClick={handleToggleRecording}
                type="button"
                aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                className={`absolute bottom-3 right-3 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500 transition-all duration-200 ease-in-out ${
                isRecording
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
            >
                <MicrophoneIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-3 items-center">
            <button
                onClick={handleGetFeedback}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-md shadow-sm hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Getting Feedback...
                    </>
                ) : (
                    <>
                        <SparklesIcon className="w-5 h-5" />
                        Get AI Feedback
                    </>
                )}
            </button>
            <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700/50 border border-slate-600 rounded-md shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500 transition-all transform hover:scale-105"
            >
                {isSaved ? <CheckIcon className="w-5 h-5 text-green-400" /> : <SaveIcon className="w-5 h-5" />}
                {isSaved ? 'Saved!' : 'Save Answer'}
            </button>
            <button
                onClick={() => setShowExample(!showExample)}
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-purple-300 transition-colors"
            >
                <LightbulbIcon className="w-5 h-5" />
                {showExample ? 'Hide Example' : 'Show Example'}
            </button>
        </div>

        {showExample && (
            <div className="mt-4 p-4 bg-slate-900/50 border-l-4 border-purple-500 rounded-r-lg transition-all duration-300">
                <p className="text-sm text-slate-400 italic whitespace-pre-wrap">{question.exampleAnswer}</p>
            </div>
        )}

        {error && <p className="mt-4 text-sm text-red-400 bg-red-900/20 p-3 rounded-lg">{error}</p>}
        
        {feedback && (
          <div className="mt-6 border-t border-slate-700/50 pt-6 space-y-6">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-purple-400"/>
                AI Feedback
            </h4>
            {!feedbackHasContent ? (
                 <div className="flex items-center gap-3 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                    <CheckCircleIcon className="w-6 h-6 text-green-400" />
                    <p className="text-green-300">Great job! Your answer looks solid. No specific suggestions at this time.</p>
                </div>
            ) : (
                <>
                {feedback.betterIdeas && feedback.betterIdeas.length > 0 && (
                    <div>
                        <h5 className="font-semibold text-purple-300 flex items-center gap-2 mb-2"><LightbulbIcon className="w-5 h-5"/>Better Ideas</h5>
                        <ul className="list-disc list-inside space-y-1 text-slate-300 pl-2">
                            {feedback.betterIdeas.map((idea, i) => <li key={i}>{idea}</li>)}
                        </ul>
                    </div>
                )}
                {feedback.vocabularyBoost && feedback.vocabularyBoost.length > 0 && (
                    <div>
                        <h5 className="font-semibold text-purple-300 flex items-center gap-2 mb-2"><SparklesIcon className="w-5 h-5"/>Vocabulary Boost</h5>
                        <ul className="space-y-3">
                            {feedback.vocabularyBoost.map((vocab, i) => (
                            <li key={i} className="p-3 bg-slate-900/50 rounded-md">
                                <div className="flex items-center gap-3">
                                    <span className="text-slate-400 line-through">{vocab.original}</span>
                                    <ArrowRightIcon className="w-4 h-4 text-purple-400 flex-shrink-0"/>
                                    <span className="font-semibold text-white">{vocab.suggestion}</span>
                                </div>
                                <p className="text-xs text-slate-500 italic mt-1.5 pl-1">{vocab.explanation}</p>
                            </li>
                            ))}
                        </ul>
                    </div>
                )}
                {feedback.grammarFixes && feedback.grammarFixes.length > 0 && (
                    <div>
                        <h5 className="font-semibold text-purple-300 flex items-center gap-2 mb-2"><CheckCircleIcon className="w-5 h-5"/>Grammar Fixes</h5>
                         <ul className="space-y-2 text-slate-300">
                            {feedback.grammarFixes.map((fix, i) => (
                            <li key={i} className="p-3 bg-slate-900/50 rounded-md">
                                <p className="text-red-400/80 flex items-center gap-2"><XCircleIcon className="w-5 h-5 flex-shrink-0"/> <span className="line-through">{fix.original}</span></p>
                                <p className="text-green-400/90 flex items-center gap-2 mt-1"><CheckCircleIcon className="w-5 h-5 flex-shrink-0"/> <span>{fix.corrected}</span></p>
                            </li>
                            ))}
                        </ul>
                    </div>
                )}
                </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;