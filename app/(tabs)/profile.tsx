
import React from "react";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
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

  const sections = [
    { id: 'comprehension', name: 'Compréhension', icon: 'book.fill', color: colors.primary },
    { id: 'calcul', name: 'Calcul', icon: 'number', color: colors.secondary },
    { id: 'raisonnement', name: 'Raisonnement', icon: 'brain.head.profile', color: colors.accent },
    { id: 'logique', name: 'Logique', icon: 'puzzlepiece.fill', color: colors.highlight },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'ios' && styles.contentContainerWithTabBar
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.profileIcon}>
            <IconSymbol name="person.fill" size={48} color="#ffffff" />
          </View>
          <Text style={styles.headerTitle}>Statistiques Détaillées</Text>
        </View>

        <View style={styles.overallStatsCard}>
          <Text style={styles.cardTitle}>Vue d&apos;Ensemble</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <IconSymbol name="chart.bar.fill" size={24} color={colors.primary} />
              <Text style={styles.statBoxValue}>{stats.totalSessions}</Text>
              <Text style={styles.statBoxLabel}>Sessions Totales</Text>
            </View>
            <View style={styles.statBox}>
              <IconSymbol name="star.fill" size={24} color={colors.secondary} />
              <Text style={styles.statBoxValue}>{stats.bestScore.toFixed(0)}%</Text>
              <Text style={styles.statBoxLabel}>Meilleur Score</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <IconSymbol name="chart.line.uptrend.xyaxis" size={24} color={colors.accent} />
              <Text style={styles.statBoxValue}>
                {stats.averageScore > 0 ? stats.averageScore.toFixed(0) : '0'}%
              </Text>
              <Text style={styles.statBoxLabel}>Score Moyen</Text>
            </View>
            <View style={styles.statBox}>
              <IconSymbol name="clock.fill" size={24} color={colors.highlight} />
              <Text style={styles.statBoxValue}>{formatTime(stats.totalTimeSpent)}</Text>
              <Text style={styles.statBoxLabel}>Temps Total</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionStatsContainer}>
          <Text style={styles.sectionTitle}>Statistiques par Section</Text>
          {sections.map((section) => {
            const sectionStats = stats.sectionStats[section.id as keyof typeof stats.sectionStats];
            return (
              <View key={section.id} style={styles.sectionStatCard}>
                <View style={[styles.sectionStatIcon, { backgroundColor: section.color }]}>
                  <IconSymbol name={section.icon as any} size={24} color="#ffffff" />
                </View>
                <View style={styles.sectionStatContent}>
                  <Text style={styles.sectionStatName}>{section.name}</Text>
                  <View style={styles.sectionStatDetails}>
                    <Text style={styles.sectionStatText}>
                      {sectionStats.sessions} sessions
                    </Text>
                    <Text style={styles.sectionStatSeparator}>•</Text>
                    <Text style={styles.sectionStatText}>
                      Meilleur: {sectionStats.bestScore.toFixed(0)}%
                    </Text>
                    <Text style={styles.sectionStatSeparator}>•</Text>
                    <Text style={styles.sectionStatText}>
                      Moyenne: {sectionStats.averageScore > 0 ? sectionStats.averageScore.toFixed(0) : '0'}%
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {sessions.length > 0 && (
          <View style={styles.recentSessionsContainer}>
            <Text style={styles.sectionTitle}>Sessions Récentes</Text>
            {sessions.slice(-5).reverse().map((session) => {
              const percentage = (session.score / session.totalQuestions) * 100;
              const sectionInfo = sections.find(s => s.id === session.section);
              return (
                <View key={session.id} style={styles.sessionCard}>
                  <View style={[styles.sessionIcon, { backgroundColor: sectionInfo?.color || colors.primary }]}>
                    <IconSymbol name={sectionInfo?.icon as any || 'book.fill'} size={20} color="#ffffff" />
                  </View>
                  <View style={styles.sessionContent}>
                    <Text style={styles.sessionName}>{sectionInfo?.name || session.section}</Text>
                    <Text style={styles.sessionDate}>{formatDate(session.date)}</Text>
                  </View>
                  <View style={styles.sessionScore}>
                    <Text style={[styles.sessionScoreText, { color: percentage >= 60 ? colors.accent : colors.secondary }]}>
                      {percentage.toFixed(0)}%
                    </Text>
                    <Text style={styles.sessionScoreLabel}>
                      {session.score}/{session.totalQuestions}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {sessions.length === 0 && (
          <View style={styles.emptyState}>
            <IconSymbol name="tray.fill" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>Aucune session pour le moment</Text>
            <Text style={styles.emptyStateSubtext}>
              Commencez une révision pour voir vos statistiques ici
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  contentContainerWithTabBar: {
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  overallStatsCard: {
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statBoxValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statBoxLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  sectionStatsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  sectionStatCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  sectionStatIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sectionStatContent: {
    flex: 1,
  },
  sectionStatName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  sectionStatDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  sectionStatText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  sectionStatSeparator: {
    fontSize: 13,
    color: colors.textSecondary,
    marginHorizontal: 6,
  },
  recentSessionsContainer: {
    marginBottom: 24,
  },
  sessionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  sessionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sessionContent: {
    flex: 1,
  },
  sessionName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  sessionDate: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  sessionScore: {
    alignItems: 'flex-end',
  },
  sessionScoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  sessionScoreLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
