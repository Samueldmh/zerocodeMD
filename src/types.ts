export type QuestionType = 'OBJECTIVE' | 'THEORY';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswerIndex?: number;
  modelAnswer?: string;
  keyPoints?: string[];
  explanation: string;
  citation: string;
}

export interface Quiz {
  title: string;
  type: QuestionType;
  questions: Question[];
}

export interface QuizResult {
  question: Question;
  userAnswer: string | number;
  isCorrect?: boolean;
  theoryScore?: number;
  foundPoints?: string[];
}

export type AppState = 'IDLE' | 'UPLOADING' | 'GENERATING' | 'QUIZ' | 'RESULTS';
