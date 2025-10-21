
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { getMixedQuestions, getBalancedMixedQuestions } from '@/data/questions';
import { Question, RevisionSession, SessionMode } from '@/types/tageMage';
import { useRevisionStats } from '@/hooks/useRevisionStats';

export default function MixedRevisionScreen() {
  const { mode, count } = useLocalSearchParams<{ mode: string; count: string }>();
  const router = useRouter();
  const { addSession } = useRevisionStats();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  
  // Timer state for exam mode
  const [timeRemaining, setTimeRemaining] = useState<number>(0); // in seconds
  const [timerExpired, setTimerExpired] = useState(false);

  const finishSession = useCallback(async () => {
    const score = selectedAnswers.reduce((acc, answer, index) => {
      return acc + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    const session: RevisionSession = {
      id: Date.now().toString(),
      date: new Date(),
      section: 'mixed',
      mode: mode as SessionMode,
      score,
      totalQuestions: questions.length,
      timeSpent,
      questions,
      answers: selectedAnswers,
    };

    await addSession(session);
    setShowResults(true);
  }, [selectedAnswers, questions, startTime, mode, addSession]);

  // Initialize questions and timer
  useEffect(() => {
    if (mode && count) {
      const questionCount = parseInt(count, 10);
      // Use balanced mix for exams, random mix for training
      const qs = mode === 'exam' 
        ? getBalancedMixedQuestions(questionCount)
        : getMixedQuestions(questionCount);
      setQuestions(qs);
      setSelectedAnswers(new Array(qs.length).fill(-1));
      setStartTime(Date.now());
      
      // Set timer for exam mode: 2 hours (7200 seconds) for 40 questions
      if (mode === 'exam') {
        setTimeRemaining(7200); // 2 hours
      }
    }
  }, [mode, count]);

  // Timer countdown for exam mode
  useEffect(() => {
    if (mode === 'exam' && timeRemaining > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setTimerExpired(true);
            finishSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [mode, timeRemaining, showResults, finishSession]);

  const currentQuestion = questions[currentQuestionIndex];

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishSession();
    }
  };

  const handlePrevious = () => {
    // Only allow going back in training mode
    if (mode !== 'exam' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    return selectedAnswers.reduce((acc, answer, index) => {
      return acc + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  const getModeName = () => {
    return mode === 'exam' ? 'Examen Blanc' : 'Session d\'Entraînement';
  };

  const getSectionName = (section: string) => {
    const names: { [key: string]: string } = {
      comprehension: 'Compréhension',
      calcul: 'Calcul',
      raisonnement: 'Raisonnement',
      logique: 'Logique',
    };
    return names[section] || section;
  };

  const getSectionColor = (section: string) => {
    const sectionColors: { [key: string]: string } = {
      comprehension: colors.primary,
      calcul: colors.secondary,
      raisonnement: colors.accent,
      logique: colors.highlight,
    };
    return sectionColors[section] || colors.primary;
  };

  if (questions.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const percentage = (score / questions.length) * 100;

    // Calculate section breakdown
    const sectionBreakdown: { [key: string]: { correct: number; total: number } } = {};
    questions.forEach((q, index) => {
      if (!sectionBreakdown[q.section]) {
        sectionBreakdown[q.section] = { correct: 0, total: 0 };
      }
      sectionBreakdown[q.section].total++;
      if (selectedAnswers[index] === q.correctAnswer) {
        sectionBreakdown[q.section].correct++;
      }
    });

    return (
      <>
        <Stack.Screen
          options={{
            title: 'Résultats',
            headerBackTitle: 'Retour',
          }}
        />
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <ScrollView
            contentContainerStyle={[
              styles.resultsContainer,
              Platform.OS !== 'ios' && styles.resultsContainerWithTabBar
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.resultsHeader}>
              <View style={[styles.scoreCircle, { borderColor: percentage >= 60 ? colors.accent : colors.error }]}>
                <Text style={[styles.scorePercentage, { color: percentage >= 60 ? colors.accent : colors.error }]}>
                  {percentage.toFixed(0)}%
                </Text>
              </View>
              <Text style={styles.resultsTitle}>
                {percentage >= 80 ? 'Excellence!' : percentage >= 60 ? 'Très Bien!' : 'Continuez vos Efforts!'}
              </Text>
              <Text style={styles.resultsSubtitle}>
                {score} / {questions.length} bonnes réponses
              </Text>
              <Text style={styles.resultsMode}>{getModeName()}</Text>
              {timerExpired && (
                <Text style={styles.timerExpiredText}>⏱️ Temps écoulé</Text>
              )}
            </View>

            <View style={styles.sectionBreakdown}>
              <Text style={styles.breakdownTitle}>Performance par Section</Text>
              {Object.entries(sectionBreakdown).map(([section, data]) => {
                const sectionPercentage = (data.correct / data.total) * 100;
                return (
                  <View key={section} style={styles.breakdownCard}>
                    <View style={styles.breakdownHeader}>
                      <View style={[styles.sectionDot, { backgroundColor: getSectionColor(section) }]} />
                      <Text style={styles.breakdownSectionName}>{getSectionName(section)}</Text>
                    </View>
                    <View style={styles.breakdownStats}>
                      <Text style={styles.breakdownScore}>
                        {data.correct}/{data.total}
                      </Text>
                      <Text style={[
                        styles.breakdownPercentage,
                        { color: sectionPercentage >= 60 ? colors.accent : colors.error }
                      ]}>
                        {sectionPercentage.toFixed(0)}%
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={styles.answersReview}>
              <Text style={styles.reviewTitle}>Révision des Réponses</Text>
              {questions.map((question, index) => {
                const isCorrect = selectedAnswers[index] === question.correctAnswer;
                return (
                  <View key={question.id} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <View style={styles.reviewHeaderLeft}>
                        <Text style={styles.reviewQuestionNumber}>Question {index + 1}</Text>
                        <View style={[styles.sectionBadge, { backgroundColor: getSectionColor(question.section) }]}>
                          <Text style={styles.sectionBadgeText}>{getSectionName(question.section)}</Text>
                        </View>
                      </View>
                      <View style={[styles.reviewBadge, { backgroundColor: isCorrect ? colors.accent : colors.error }]}>
                        <IconSymbol
                          name={isCorrect ? 'checkmark' : 'xmark'}
                          size={16}
                          color="#ffffff"
                        />
                      </View>
                    </View>
                    <Text style={styles.reviewQuestion}>{question.question}</Text>
                    <Text style={styles.reviewAnswer}>
                      Votre réponse: {question.options[selectedAnswers[index]] || 'Non répondu'}
                    </Text>
                    {!isCorrect && (
                      <Text style={styles.reviewCorrectAnswer}>
                        Bonne réponse: {question.options[question.correctAnswer]}
                      </Text>
                    )}
                    {question.explanation && (
                      <Text style={styles.reviewExplanation}>{question.explanation}</Text>
                    )}
                  </View>
                );
              })}
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.finishButton,
                pressed && styles.finishButtonPressed
              ]}
              onPress={() => router.push('/(tabs)/(home)')}
            >
              <Text style={styles.finishButtonText}>Retour à l&apos;Accueil</Text>
            </Pressable>
          </ScrollView>
        </View>
      </>
    );
  }

  const isExamMode = mode === 'exam';
  const canGoBack = !isExamMode && currentQuestionIndex > 0;

  return (
    <>
      <Stack.Screen
        options={{
          title: getModeName(),
          headerBackTitle: 'Retour',
        }}
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Timer for exam mode */}
        {isExamMode && (
          <View style={[styles.timerContainer, timeRemaining < 600 && styles.timerWarning]}>
            <IconSymbol name="clock.fill" size={20} color={timeRemaining < 600 ? colors.error : colors.primary} />
            <Text style={[styles.timerText, timeRemaining < 600 && styles.timerTextWarning]}>
              {formatTime(timeRemaining)}
            </Text>
          </View>
        )}

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                backgroundColor: colors.primary,
              },
            ]}
          />
        </View>

        <ScrollView
          style={styles.questionContainer}
          contentContainerStyle={[
            styles.questionContent,
            Platform.OS !== 'ios' && styles.questionContentWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.questionHeader}>
            <Text style={styles.questionNumber}>
              Question {currentQuestionIndex + 1} / {questions.length}
            </Text>
            <View style={[styles.sectionBadge, { backgroundColor: getSectionColor(currentQuestion.section) }]}>
              <Text style={styles.sectionBadgeText}>{getSectionName(currentQuestion.section)}</Text>
            </View>
          </View>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>

          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === index;
              return (
                <Pressable
                  key={index}
                  style={({ pressed }) => [
                    styles.optionButton,
                    isSelected && styles.optionButtonSelected,
                    pressed && styles.optionButtonPressed,
                  ]}
                  onPress={() => handleAnswerSelect(index)}
                >
                  <View style={[styles.optionCircle, isSelected && styles.optionCircleSelected]}>
                    {isSelected && <View style={styles.optionCircleInner} />}
                  </View>
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.navigationButtons}>
          {!isExamMode && (
            <Pressable
              style={({ pressed }) => [
                styles.navButton,
                styles.previousButton,
                !canGoBack && styles.navButtonDisabled,
                pressed && canGoBack && styles.navButtonPressed,
              ]}
              onPress={handlePrevious}
              disabled={!canGoBack}
            >
              <IconSymbol name="chevron.left" size={20} color="#ffffff" />
              <Text style={styles.navButtonText}>Précédent</Text>
            </Pressable>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.navButton,
              styles.nextButton,
              isExamMode && styles.nextButtonExam,
              selectedAnswers[currentQuestionIndex] === -1 && styles.navButtonDisabled,
              pressed && styles.navButtonPressed,
            ]}
            onPress={handleNext}
            disabled={selectedAnswers[currentQuestionIndex] === -1}
          >
            <Text style={styles.navButtonText}>
              {currentQuestionIndex === questions.length - 1 ? 'Terminer' : 'Suivant'}
            </Text>
            <IconSymbol name="chevron.right" size={20} color="#ffffff" />
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
    marginTop: 100,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.card,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    gap: 8,
  },
  timerWarning: {
    backgroundColor: '#FEF2F2',
    borderBottomColor: colors.error,
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    fontVariant: ['tabular-nums'],
  },
  timerTextWarning: {
    color: colors.error,
  },
  timerExpiredText: {
    fontSize: 14,
    color: colors.error,
    fontWeight: '600',
    marginTop: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.card,
  },
  progressFill: {
    height: '100%',
  },
  questionContainer: {
    flex: 1,
  },
  questionContent: {
    padding: 20,
  },
  questionContentWithTabBar: {
    paddingBottom: 180,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionNumber: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  sectionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sectionBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 24,
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  optionButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.card,
    boxShadow: '0px 4px 8px rgba(30, 58, 138, 0.15)',
    elevation: 4,
  },
  optionButtonPressed: {
    opacity: 0.7,
  },
  optionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionCircleSelected: {
    borderColor: colors.primary,
  },
  optionCircleInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  optionTextSelected: {
    fontWeight: '600',
    color: colors.primary,
  },
  navigationButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.card,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  previousButton: {
    backgroundColor: colors.textSecondary,
  },
  nextButton: {
    backgroundColor: colors.primary,
  },
  nextButtonExam: {
    flex: 1,
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonPressed: {
    opacity: 0.8,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  resultsContainer: {
    padding: 20,
  },
  resultsContainerWithTabBar: {
    paddingBottom: 100,
  },
  resultsHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  scoreCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  scorePercentage: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  resultsSubtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  resultsMode: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  sectionBreakdown: {
    marginBottom: 24,
  },
  breakdownTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  breakdownCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  breakdownSectionName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  breakdownStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  breakdownScore: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  breakdownPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  answersReview: {
    marginBottom: 24,
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  reviewCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  reviewQuestionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  reviewBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewQuestion: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  reviewAnswer: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  reviewCorrectAnswer: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '600',
    marginBottom: 8,
  },
  reviewExplanation: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 8,
    lineHeight: 20,
  },
  finishButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  finishButtonPressed: {
    opacity: 0.8,
  },
  finishButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
