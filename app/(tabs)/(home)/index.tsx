
import React from "react";
import { Stack } from "expo-router";
import { ScrollView, StyleSheet, View, Text, Pressable, Platform } from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { colors } from "@/styles/commonStyles";
import { useRevisionStats } from "@/hooks/useRevisionStats";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { stats, loading } = useRevisionStats();

  const sections = [
    { id: 'comprehension', name: 'Compréhension', icon: 'book.fill', color: colors.primary },
    { id: 'calcul', name: 'Calcul', icon: 'number', color: colors.secondary },
    { id: 'raisonnement', name: 'Raisonnement', icon: 'brain.head.profile', color: colors.accent },
    { id: 'logique', name: 'Logique', icon: 'puzzlepiece.fill', color: colors.highlight },
  ];

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Tage Mage Révision",
            headerLargeTitle: true,
          }}
        />
      )}
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.contentContainer,
            Platform.OS !== 'ios' && styles.contentContainerWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Bienvenue sur</Text>
            <Text style={styles.title}>Tage Mage Révision</Text>
            <Text style={styles.subtitle}>Préparez-vous pour réussir!</Text>
          </View>

          <View style={styles.statsCard}>
            <Text style={styles.cardTitle}>Vos Statistiques</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.totalSessions}</Text>
                <Text style={styles.statLabel}>Sessions</Text>
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
                <Text style={styles.statLabel}>Moyenne</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{formatTime(stats.totalTimeSpent)}</Text>
                <Text style={styles.statLabel}>Temps Total</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionsContainer}>
            <Text style={styles.sectionTitle}>Choisissez une Section</Text>
            {sections.map((section) => (
              <Pressable
                key={section.id}
                style={({ pressed }) => [
                  styles.sectionCard,
                  pressed && styles.sectionCardPressed
                ]}
                onPress={() => router.push(`/revision/${section.id}`)}
              >
                <View style={[styles.sectionIcon, { backgroundColor: section.color }]}>
                  <IconSymbol name={section.icon as any} size={32} color="#ffffff" />
                </View>
                <View style={styles.sectionContent}>
                  <Text style={styles.sectionName}>{section.name}</Text>
                  <View style={styles.sectionStats}>
                    <Text style={styles.sectionStatsText}>
                      {stats.sectionStats[section.id as keyof typeof stats.sectionStats].sessions} sessions
                    </Text>
                    <Text style={styles.sectionStatsText}>•</Text>
                    <Text style={styles.sectionStatsText}>
                      Meilleur: {stats.sectionStats[section.id as keyof typeof stats.sectionStats].bestScore.toFixed(0)}%
                    </Text>
                  </View>
                </View>
                <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
              </Pressable>
            ))}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.allStatsButton,
              pressed && styles.allStatsButtonPressed
            ]}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <IconSymbol name="chart.bar.fill" size={20} color="#ffffff" />
            <Text style={styles.allStatsButtonText}>Voir Toutes les Statistiques</Text>
          </Pressable>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  contentContainerWithTabBar: {
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
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
  },
  sectionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  sectionCardPressed: {
    opacity: 0.7,
  },
  sectionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sectionContent: {
    flex: 1,
  },
  sectionName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  sectionStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionStatsText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  allStatsButton: {
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
  allStatsButtonPressed: {
    opacity: 0.8,
  },
  allStatsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
