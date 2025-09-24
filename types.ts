
export interface InterviewQuestion {
  id: number;
  question: string;
  exampleAnswer: string;
}

export interface VocabularySuggestion {
  original: string;
  suggestion: string;
  explanation: string;
}

export interface GrammarCorrection {
  original: string;
  corrected: string;
}

export interface AIFeedback {
  betterIdeas: string[];
  vocabularyBoost: VocabularySuggestion[];
  grammarFixes: GrammarCorrection[];
}
