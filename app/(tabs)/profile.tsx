
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import React from "react";
import { colors } from "@/styles/commonStyles";
import { useRevisionStats } from "@/hooks/useRevisionStats";

export default function ProfileScreen() {
  const theme = useTheme();
  const { stats, sessions } = useRevisionStats();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getSectionName = (section: string) => {
    const names: { [key: string]: string } = {
      comprehension: 'Compréhension',
      calcul: 'Calcul',
      raisonnement: 'Raisonnement',
      logique: 'Logique',
      mixed: 'Mixte',
    };
    return names[section] || section;
  };

  const getModeName = (mode: string) => {
    const names: { [key: string]: string } = {
      section: 'Section',
      exam: 'Examen',
      training: 'Entraînement',
    };
    return names[mode] || mode;
  };

  const getSectionColor = (section: string) => {
    const sectionColors: { [key: string]: string } = {
      comprehension: colors.primary,
      calcul: colors.secondary,
      raisonnement: colors.accent,
      logique: colors.highlight,
      mixed: colors.textSecondary,
    };
    return sectionColors[section] || colors.primary;
  };

  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'ios' && styles.contentContainerWithTabBar
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <IconSymbol name="person.circle.fill" size={80} color={colors.primary} />
          <Text style={styles.title}>Vos Statistiques</Text>
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.cardTitle}>Statistiques Globales</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalSessions}</Text>
              <Text style={styles.statLabel}>Sessions Totales</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.secondary }]}>
                {stats.bestScore.toFixed(0)}%
              </Text>
              <Text style={styles.statLabel}>Meilleur Score</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {stats.averageScore > 0 ? stats.averageScore.toFixed(0) : '0'}%
              </Text>
              <Text style={styles.statLabel}>Score Moyen</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{formatTime(stats.totalTimeSpent)}</Text>
              <Text style={styles.statLabel}>Temps Total</Text>
            </View>
          </View>
        </View>

        <View style={styles.modeStatsSection}>
          <Text style={styles.sectionTitle}>Statistiques par Mode</Text>
          
          <View style={styles.modeCard}>
            <View style={styles.modeHeader}>
              <IconSymbol name="doc.text.fill" size={24} color={colors.primary} />
              <Text style={styles.modeTitle}>Examens Blancs</Text>
            </View>
            <View style={styles.modeStats}>
              <View style={styles.modeStatItem}>
                <Text style={styles.modeStatValue}>{stats.examStats.sessions}</Text>
                <Text style={styles.modeStatLabel}>Sessions</Text>
              </View>
              <View style={styles.modeStatItem}>
                <Text style={[styles.modeStatValue, { color: colors.secondary }]}>
                  {stats.examStats.bestScore.toFixed(0)}%
                </Text>
                <Text style={styles.modeStatLabel}>Meilleur</Text>
              </View>
              <View style={styles.modeStatItem}>
                <Text style={styles.modeStatValue}>
                  {stats.examStats.averageScore > 0 ? stats.examStats.averageScore.toFixed(0) : '0'}%
                </Text>
                <Text style={styles.modeStatLabel}>Moyenne</Text>
              </View>
            </View>
          </View>

          <View style={styles.modeCard}>
            <View style={styles.modeHeader}>
              <IconSymbol name="figure.run" size={24} color={colors.accent} />
              <Text style={styles.modeTitle}>Entraînements</Text>
            </View>
            <View style={styles.modeStats}>
              <View style={styles.modeStatItem}>
                <Text style={styles.modeStatValue}>{stats.trainingStats.sessions}</Text>
                <Text style={styles.modeStatLabel}>Sessions</Text>
              </View>
              <View style={styles.modeStatItem}>
                <Text style={[styles.modeStatValue, { color: colors.secondary }]}>
                  {stats.trainingStats.bestScore.toFixed(0)}%
                </Text>
                <Text style={styles.modeStatLabel}>Meilleur</Text>
              </View>
              <View style={styles.modeStatItem}>
                <Text style={styles.modeStatValue}>
                  {stats.trainingStats.averageScore > 0 ? stats.trainingStats.averageScore.toFixed(0) : '0'}%
                </Text>
                <Text style={styles.modeStatLabel}>Moyenne</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionStatsContainer}>
          <Text style={styles.sectionTitle}>Statistiques par Section</Text>
          {Object.entries(stats.sectionStats).map(([section, data]) => (
            <View key={section} style={styles.sectionStatCard}>
              <View style={styles.sectionStatHeader}>
                <View style={[styles.sectionDot, { backgroundColor: getSectionColor(section) }]} />
                <Text style={styles.sectionStatName}>{getSectionName(section)}</Text>
              </View>
              <View style={styles.sectionStatContent}>
                <View style={styles.sectionStatItem}>
                  <Text style={styles.sectionStatValue}>{data.sessions}</Text>
                  <Text style={styles.sectionStatLabel}>Sessions</Text>
                </View>
                <View style={styles.sectionStatItem}>
                  <Text style={[styles.sectionStatValue, { color: colors.secondary }]}>
                    {data.bestScore.toFixed(0)}%
                  </Text>
                  <Text style={styles.sectionStatLabel}>Meilleur</Text>
                </View>
                <View style={styles.sectionStatItem}>
                  <Text style={styles.sectionStatValue}>
                    {data.averageScore > 0 ? data.averageScore.toFixed(0) : '0'}%
                  </Text>
                  <Text style={styles.sectionStatLabel}>Moyenne</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Historique Récent</Text>
          {recentSessions.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="clock" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyStateText}>Aucune session pour le moment</Text>
            </View>
          ) : (
            recentSessions.map((session) => {
              const percentage = (session.score / session.totalQuestions) * 100;
              return (
                <View key={session.id} style={styles.historyCard}>
                  <View style={styles.historyHeader}>
                    <View style={styles.historyHeaderLeft}>
                      <View style={[styles.sectionDot, { backgroundColor: getSectionColor(session.section) }]} />
                      <View>
                        <Text style={styles.historySection}>{getSectionName(session.section)}</Text>
                        <Text style={styles.historyMode}>{getModeName(session.mode)}</Text>
                      </View>
                    </View>
                    <Text style={styles.historyDate}>{formatDate(session.date)}</Text>
                  </View>
                  <View style={styles.historyStats}>
                    <View style={styles.historyStatItem}>
                      <Text style={[
                        styles.historyScore,
                        { color: percentage >= 60 ? colors.accent : colors.secondary }
                      ]}>
                        {percentage.toFixed(0)}%
                      </Text>
                      <Text style={styles.historyStatLabel}>
                        {session.score}/{session.totalQuestions} bonnes réponses
                      </Text>
                    </View>
                    <View style={styles.historyStatItem}>
                      <Text style={styles.historyTime}>{formatTime(session.timeSpent)}</Text>
                      <Text style={styles.historyStatLabel}>Temps passé</Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
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
    paddingBottom: 20,
  },
  contentContainerWithTabBar: {
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 12,
  },
  statsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  modeStatsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  modeCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  modeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  modeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modeStatItem: {
    alignItems: 'center',
  },
  modeStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  modeStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  sectionStatsContainer: {
    marginBottom: 24,
  },
  sectionStatCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  sectionStatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  sectionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  sectionStatName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  sectionStatContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sectionStatItem: {
    alignItems: 'center',
  },
  sectionStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  sectionStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  historyContainer: {
    marginBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
  },
  historyCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  historySection: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  historyMode: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  historyDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  historyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyStatItem: {
    flex: 1,
  },
  historyScore: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  historyTime: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  historyStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
