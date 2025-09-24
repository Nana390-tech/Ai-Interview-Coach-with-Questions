import React from 'react';
import SparklesIcon from './icons/SparklesIcon';
import ArrowRightIcon from './icons/ArrowRightIcon';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-black/30 backdrop-blur-xl rounded-2xl shadow-2xl ring-1 ring-white/20 transform transition-all duration-500 hover:scale-[1.02]">
        <div className="text-center">
            <div className="inline-block p-3 bg-gradient-to-br from-purple-500 to-cyan-400 rounded-full mb-4 shadow-lg">
                <SparklesIcon className="w-8 h-8 text-white"/>
            </div>
          <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 sm:text-5xl">
            AI Interview Coach
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            Practice for your interview and get instant feedback.
          </p>
        </div>
        
        <div>
          <button
            onClick={onLogin}
            type="button"
            className="group relative flex w-full items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-4 text-lg font-semibold text-white hover:from-purple-500 hover:to-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Start Practicing Now
            <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;