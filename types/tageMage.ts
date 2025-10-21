
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

export type SessionMode = 
  | 'section' // Practice specific section
  | 'exam' // Full exam simulation
  | 'training'; // Training session with mixed questions

export interface RevisionSession {
  id: string;
  date: Date;
  section: TageMageSection | 'mixed'; // 'mixed' for exam/training modes
  mode: SessionMode;
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
  examStats: {
    sessions: number;
    bestScore: number;
    averageScore: number;
  };
  trainingStats: {
    sessions: number;
    bestScore: number;
    averageScore: number;
  };
}
