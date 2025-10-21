
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { useRevisionStats } from '@/hooks/useRevisionStats';
import { useRouter } from 'expo-router';

interface QuestionnaireAnswer {
  question: string;
  options: string[];
  selectedIndex: number;
  weight: number;
}

interface SchoolPrediction {
  name: string;
  percentage: number;
  color: string;
  tier: 'top3' | 'top10' | 'top20';
}

export default function AdmissionScreen() {
  const router = useRouter();
  const { stats } = useRevisionStats();
  const [currentStep, setCurrentStep] = useState<'intro' | 'questionnaire' | 'results'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [predictions, setPredictions] = useState<SchoolPrediction[]>([]);

  const questionnaire: QuestionnaireAnswer[] = [
    {
      question: 'Quel est votre niveau académique actuel?',
      options: [
        'Mention Très Bien au Bac',
        'Mention Bien au Bac',
        'Mention Assez Bien au Bac',
        'Sans mention'
      ],
      selectedIndex: -1,
      weight: 15
    },
    {
      question: 'Combien d\'heures par semaine consacrez-vous à la préparation?',
      options: [
        'Plus de 20 heures',
        '15-20 heures',
        '10-15 heures',
        'Moins de 10 heures'
      ],
      selectedIndex: -1,
      weight: 20
    },
    {
      question: 'Avez-vous une expérience professionnelle significative?',
      options: [
        'Oui, plus de 2 ans',
        'Oui, 1-2 ans',
        'Oui, moins d\'un an',
        'Non, aucune expérience'
      ],
      selectedIndex: -1,
      weight: 10
    },
    {
      question: 'Quel est votre niveau en anglais?',
      options: [
        'Bilingue / C2',
        'Avancé / C1',
        'Intermédiaire / B2',
        'Débutant / B1 ou moins'
      ],
      selectedIndex: -1,
      weight: 15
    },
    {
      question: 'Avez-vous des activités extra-scolaires significatives?',
      options: [
        'Oui, leadership dans plusieurs associations',
        'Oui, membre actif d\'associations',
        'Oui, quelques activités',
        'Non, aucune activité'
      ],
      selectedIndex: -1,
      weight: 10
    },
    {
      question: 'Quelle est votre motivation principale?',
      options: [
        'Passion pour le business et entrepreneuriat',
        'Développement de carrière',
        'Réseau et opportunités',
        'Diplôme reconnu'
      ],
      selectedIndex: -1,
      weight: 10
    }
  ];

  const calculatePredictions = () => {
    // Calculate base score from stats
    const examAverage = stats.examStats.averageScore || 0;
    const trainingAverage = stats.trainingStats.averageScore || 0;
    const overallAverage = stats.averageScore || 0;
    const totalSessions = stats.totalSessions || 0;

    // Base score from performance (0-40 points)
    let baseScore = 0;
    if (totalSessions >= 10) {
      baseScore = (examAverage * 0.5 + trainingAverage * 0.3 + overallAverage * 0.2) * 0.4;
    } else {
      baseScore = overallAverage * 0.2; // Penalize if not enough data
    }

    // Add questionnaire score (0-60 points)
    let questionnaireScore = 0;
    answers.forEach((answerIndex, questionIndex) => {
      const question = questionnaire[questionIndex];
      const points = question.weight * (1 - (answerIndex * 0.25)); // Best answer = full points
      questionnaireScore += points;
    });

    const totalScore = baseScore + questionnaireScore;

    // Define schools with their thresholds
    const schools: SchoolPrediction[] = [
      {
        name: 'HEC Paris',
        percentage: Math.min(95, Math.max(5, totalScore * 0.95)),
        color: colors.primary,
        tier: 'top3'
      },
      {
        name: 'ESSEC Business School',
        percentage: Math.min(95, Math.max(10, totalScore * 1.0)),
        color: colors.secondary,
        tier: 'top3'
      },
      {
        name: 'ESCP Business School',
        percentage: Math.min(95, Math.max(10, totalScore * 1.05)),
        color: colors.gold,
        tier: 'top3'
      },
      {
        name: 'EDHEC Business School',
        percentage: Math.min(95, Math.max(15, totalScore * 1.1)),
        color: colors.accent,
        tier: 'top10'
      },
      {
        name: 'EM Lyon',
        percentage: Math.min(95, Math.max(15, totalScore * 1.15)),
        color: colors.highlight,
        tier: 'top10'
      },
      {
        name: 'SKEMA Business School',
        percentage: Math.min(95, Math.max(20, totalScore * 1.25)),
        color: '#8B5CF6',
        tier: 'top10'
      },
      {
        name: 'Audencia Business School',
        percentage: Math.min(95, Math.max(25, totalScore * 1.3)),
        color: '#EC4899',
        tier: 'top10'
      },
      {
        name: 'Grenoble EM',
        percentage: Math.min(95, Math.max(30, totalScore * 1.35)),
        color: '#06B6D4',
        tier: 'top20'
      },
      {
        name: 'NEOMA Business School',
        percentage: Math.min(95, Math.max(30, totalScore * 1.4)),
        color: '#F59E0B',
        tier: 'top20'
      },
      {
        name: 'Toulouse Business School',
        percentage: Math.min(95, Math.max(35, totalScore * 1.45)),
        color: '#10B981',
        tier: 'top20'
      }
    ];

    // Sort by percentage descending
    schools.sort((a, b) => b.percentage - a.percentage);
    setPredictions(schools);
    setCurrentStep('results');
  };

  const handleStartQuestionnaire = () => {
    if (stats.totalSessions < 5) {
      console.log('Not enough data for accurate prediction');
      return;
    }
    setCurrentStep('questionnaire');
    setCurrentQuestionIndex(0);
    setAnswers([]);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questionnaire.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculatePredictions();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep('intro');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setPredictions([]);
  };

  if (currentStep === 'intro') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.introHeader}>
            <View style={styles.iconContainer}>
              <IconSymbol name="graduationcap.fill" size={64} color={colors.primary} />
            </View>
            <Text style={styles.introTitle}>Prédiction d&apos;Admission</Text>
            <Text style={styles.introSubtitle}>
              Estimez vos chances d&apos;intégrer les grandes écoles de commerce
            </Text>
          </View>

          <View style={styles.navigationCard}>
            <Pressable
              style={({ pressed }) => [
                styles.navButton,
                pressed && styles.navButtonPressed
              ]}
              onPress={() => router.push('/(tabs)/(home)')}
            >
              <IconSymbol name="house.fill" size={20} color={colors.primary} />
              <Text style={styles.navButtonText}>Accueil</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.navButton,
                pressed && styles.navButtonPressed
              ]}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <IconSymbol name="person.fill" size={20} color={colors.accent} />
              <Text style={styles.navButtonText}>Profil</Text>
            </Pressable>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <IconSymbol name="info.circle.fill" size={24} color={colors.primary} />
              <Text style={styles.infoTitle}>Comment ça marche?</Text>
            </View>
            <Text style={styles.infoText}>
              Notre algorithme analyse vos performances aux examens blancs et sessions d&apos;entraînement, 
              combinées à vos réponses à un questionnaire personnalisé, pour estimer vos chances d&apos;admission 
              dans les principales écoles de commerce françaises.
            </Text>
          </View>

          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Vos Statistiques Actuelles</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.totalSessions}</Text>
                <Text style={styles.statLabel}>Sessions</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.accent }]}>
                  {stats.averageScore.toFixed(0)}%
                </Text>
                <Text style={styles.statLabel}>Moyenne</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.secondary }]}>
                  {stats.examStats.sessions}
                </Text>
                <Text style={styles.statLabel}>Examens</Text>
              </View>
            </View>
          </View>

          {stats.totalSessions < 5 ? (
            <View style={styles.warningCard}>
              <IconSymbol name="exclamationmark.triangle.fill" size={24} color={colors.highlight} />
              <Text style={styles.warningText}>
                Vous devez compléter au moins 5 sessions (dont 2 examens blancs) pour obtenir une prédiction fiable.
              </Text>
            </View>
          ) : (
            <Pressable
              style={({ pressed }) => [
                styles.startButton,
                pressed && styles.startButtonPressed
              ]}
              onPress={handleStartQuestionnaire}
            >
              <Text style={styles.startButtonText}>Commencer l&apos;Évaluation</Text>
              <IconSymbol name="arrow.right" size={20} color="#ffffff" />
            </Pressable>
          )}

          <View style={styles.schoolsPreview}>
            <Text style={styles.schoolsPreviewTitle}>Écoles Évaluées</Text>
            <View style={styles.schoolsList}>
              {['HEC Paris', 'ESSEC', 'ESCP', 'EDHEC', 'EM Lyon', 'SKEMA', 'Audencia', 'Grenoble EM', 'NEOMA', 'TBS'].map((school) => (
                <View key={school} style={styles.schoolChip}>
                  <Text style={styles.schoolChipText}>{school}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (currentStep === 'questionnaire') {
    const currentQuestion = questionnaire[currentQuestionIndex];
    const currentAnswer = answers[currentQuestionIndex];

    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.questionnaireContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((currentQuestionIndex + 1) / questionnaire.length) * 100}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>

          <ScrollView
            contentContainerStyle={styles.questionContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.questionCounter}>
              Question {currentQuestionIndex + 1} / {questionnaire.length}
            </Text>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>

            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option, index) => {
                const isSelected = currentAnswer === index;
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
            <Pressable
              style={({ pressed }) => [
                styles.navButtonBottom,
                styles.previousButton,
                currentQuestionIndex === 0 && styles.navButtonDisabled,
                pressed && currentQuestionIndex > 0 && styles.navButtonPressed,
              ]}
              onPress={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              <IconSymbol name="chevron.left" size={20} color="#ffffff" />
              <Text style={styles.navButtonBottomText}>Précédent</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.navButtonBottom,
                styles.nextButton,
                currentAnswer === undefined && styles.navButtonDisabled,
                pressed && styles.navButtonPressed,
              ]}
              onPress={handleNext}
              disabled={currentAnswer === undefined}
            >
              <Text style={styles.navButtonBottomText}>
                {currentQuestionIndex === questionnaire.length - 1 ? 'Voir Résultats' : 'Suivant'}
              </Text>
              <IconSymbol name="chevron.right" size={20} color="#ffffff" />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Results view
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.resultsHeader}>
          <IconSymbol name="chart.bar.fill" size={48} color={colors.primary} />
          <Text style={styles.resultsTitle}>Vos Prédictions d&apos;Admission</Text>
          <Text style={styles.resultsSubtitle}>
            Basées sur vos performances et votre profil
          </Text>
        </View>

        <View style={styles.disclaimerCard}>
          <IconSymbol name="info.circle" size={20} color={colors.textSecondary} />
          <Text style={styles.disclaimerText}>
            Ces prédictions sont indicatives et basées sur des statistiques générales. 
            Les résultats réels dépendent de nombreux facteurs.
          </Text>
        </View>

        <View style={styles.predictionsContainer}>
          <Text style={styles.sectionTitle}>Top 3 - Écoles d&apos;Excellence</Text>
          {predictions.filter(p => p.tier === 'top3').map((prediction) => (
            <View key={prediction.name} style={styles.predictionCard}>
              <View style={styles.predictionHeader}>
                <Text style={styles.predictionSchool}>{prediction.name}</Text>
                <Text style={[styles.predictionPercentage, { color: prediction.color }]}>
                  {prediction.percentage.toFixed(0)}%
                </Text>
              </View>
              <View style={styles.predictionBarContainer}>
                <View
                  style={[
                    styles.predictionBar,
                    {
                      width: `${prediction.percentage}%`,
                      backgroundColor: prediction.color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.predictionLabel}>Chances d&apos;admission</Text>
            </View>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Top 10 - Écoles Prestigieuses</Text>
          {predictions.filter(p => p.tier === 'top10').map((prediction) => (
            <View key={prediction.name} style={styles.predictionCard}>
              <View style={styles.predictionHeader}>
                <Text style={styles.predictionSchool}>{prediction.name}</Text>
                <Text style={[styles.predictionPercentage, { color: prediction.color }]}>
                  {prediction.percentage.toFixed(0)}%
                </Text>
              </View>
              <View style={styles.predictionBarContainer}>
                <View
                  style={[
                    styles.predictionBar,
                    {
                      width: `${prediction.percentage}%`,
                      backgroundColor: prediction.color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.predictionLabel}>Chances d&apos;admission</Text>
            </View>
          ))}

          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Top 20 - Écoles Reconnues</Text>
          {predictions.filter(p => p.tier === 'top20').map((prediction) => (
            <View key={prediction.name} style={styles.predictionCard}>
              <View style={styles.predictionHeader}>
                <Text style={styles.predictionSchool}>{prediction.name}</Text>
                <Text style={[styles.predictionPercentage, { color: prediction.color }]}>
                  {prediction.percentage.toFixed(0)}%
                </Text>
              </View>
              <View style={styles.predictionBarContainer}>
                <View
                  style={[
                    styles.predictionBar,
                    {
                      width: `${prediction.percentage}%`,
                      backgroundColor: prediction.color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.predictionLabel}>Chances d&apos;admission</Text>
            </View>
          ))}
        </View>

        <View style={styles.recommendationsCard}>
          <Text style={styles.recommendationsTitle}>Recommandations</Text>
          <View style={styles.recommendation}>
            <IconSymbol name="checkmark.circle.fill" size={20} color={colors.accent} />
            <Text style={styles.recommendationText}>
              Continuez à pratiquer régulièrement avec des examens blancs
            </Text>
          </View>
          <View style={styles.recommendation}>
            <IconSymbol name="checkmark.circle.fill" size={20} color={colors.accent} />
            <Text style={styles.recommendationText}>
              Travaillez vos points faibles identifiés dans les statistiques
            </Text>
          </View>
          <View style={styles.recommendation}>
            <IconSymbol name="checkmark.circle.fill" size={20} color={colors.accent} />
            <Text style={styles.recommendationText}>
              Préparez votre dossier et vos expériences extra-académiques
            </Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.restartButton,
            pressed && styles.restartButtonPressed
          ]}
          onPress={handleRestart}
        >
          <IconSymbol name="arrow.clockwise" size={20} color="#ffffff" />
          <Text style={styles.restartButtonText}>Refaire l&apos;Évaluation</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  introHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  introTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  introSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  navigationCard: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  navButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  navButtonPressed: {
    opacity: 0.7,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  statsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  warningCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
    boxShadow: '0px 4px 12px rgba(30, 58, 138, 0.2)',
    elevation: 4,
  },
  startButtonPressed: {
    opacity: 0.8,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  schoolsPreview: {
    marginBottom: 20,
  },
  schoolsPreviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  schoolsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  schoolChip: {
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  schoolChipText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  questionnaireContainer: {
    flex: 1,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.card,
  },
  progressFill: {
    height: '100%',
  },
  questionContent: {
    padding: 20,
    paddingBottom: 120,
  },
  questionCounter: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 12,
  },
  questionText: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 24,
    lineHeight: 30,
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
  navButtonBottom: {
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
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonBottomText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  resultsHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  resultsSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  disclaimerCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 24,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  predictionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  predictionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  predictionSchool: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  predictionPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  predictionBarContainer: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  predictionBar: {
    height: '100%',
    borderRadius: 4,
  },
  predictionLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  recommendationsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  recommendation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  restartButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  restartButtonPressed: {
    opacity: 0.8,
  },
  restartButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
