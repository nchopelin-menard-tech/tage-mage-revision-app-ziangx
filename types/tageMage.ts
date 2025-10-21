
export interface Question {
  id: string;
  section: TageMageSection;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export type TageMageSection = 
  | 'comprehension'
  | 'calcul'
  | 'raisonnement'
  | 'logique';

export interface RevisionSession {
  id: string;
  date: Date;
  section: TageMageSection;
  score: number;
  totalQuestions: number;
  timeSpent: number; // in seconds
  questions: Question[];
  answers: number[];
}

export interface Stats {
  totalSessions: number;
  bestScore: number;
  averageScore: number;
  totalTimeSpent: number;
  sectionStats: {
    [key in TageMageSection]: {
      sessions: number;
      bestScore: number;
      averageScore: number;
    };
  };
}
