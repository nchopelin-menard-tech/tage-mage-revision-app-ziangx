
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RevisionSession, Stats, TageMageSection } from '@/types/tageMage';

const STORAGE_KEY = '@tage_mage_sessions';

export const useRevisionStats = () => {
  const [sessions, setSessions] = useState<RevisionSession[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalSessions: 0,
    bestScore: 0,
    averageScore: 0,
    totalTimeSpent: 0,
    sectionStats: {
      comprehension: { sessions: 0, bestScore: 0, averageScore: 0 },
      calcul: { sessions: 0, bestScore: 0, averageScore: 0 },
      raisonnement: { sessions: 0, bestScore: 0, averageScore: 0 },
      logique: { sessions: 0, bestScore: 0, averageScore: 0 },
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [sessions]);

  const loadSessions = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsedSessions = JSON.parse(data).map((session: any) => ({
          ...session,
          date: new Date(session.date),
        }));
        setSessions(parsedSessions);
      }
    } catch (error) {
      console.log('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSessions = async (newSessions: RevisionSession[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSessions));
    } catch (error) {
      console.log('Error saving sessions:', error);
    }
  };

  const addSession = async (session: RevisionSession) => {
    const newSessions = [...sessions, session];
    setSessions(newSessions);
    await saveSessions(newSessions);
  };

  const calculateStats = () => {
    if (sessions.length === 0) {
      return;
    }

    const totalSessions = sessions.length;
    const totalScore = sessions.reduce((sum, s) => sum + (s.score / s.totalQuestions) * 100, 0);
    const averageScore = totalScore / totalSessions;
    const bestScore = Math.max(...sessions.map(s => (s.score / s.totalQuestions) * 100));
    const totalTimeSpent = sessions.reduce((sum, s) => sum + s.timeSpent, 0);

    const sectionStats: Stats['sectionStats'] = {
      comprehension: calculateSectionStats('comprehension'),
      calcul: calculateSectionStats('calcul'),
      raisonnement: calculateSectionStats('raisonnement'),
      logique: calculateSectionStats('logique'),
    };

    setStats({
      totalSessions,
      bestScore,
      averageScore,
      totalTimeSpent,
      sectionStats,
    });
  };

  const calculateSectionStats = (section: TageMageSection) => {
    const sectionSessions = sessions.filter(s => s.section === section);
    if (sectionSessions.length === 0) {
      return { sessions: 0, bestScore: 0, averageScore: 0 };
    }

    const totalScore = sectionSessions.reduce((sum, s) => sum + (s.score / s.totalQuestions) * 100, 0);
    const averageScore = totalScore / sectionSessions.length;
    const bestScore = Math.max(...sectionSessions.map(s => (s.score / s.totalQuestions) * 100));

    return {
      sessions: sectionSessions.length,
      bestScore,
      averageScore,
    };
  };

  return {
    sessions,
    stats,
    loading,
    addSession,
  };
};
