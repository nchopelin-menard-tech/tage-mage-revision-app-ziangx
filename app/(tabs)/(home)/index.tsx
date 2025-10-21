
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
            <View style={styles.logoContainer}>
              <IconSymbol name="graduationcap.fill" size={40} color={colors.primary} />
            </View>
            <Text style={styles.welcomeText}>Excellence & Réussite</Text>
            <Text style={styles.title}>Tage Mage</Text>
            <Text style={styles.subtitle}>Votre Passeport pour les Grandes Écoles</Text>
          </View>

          <View style={styles.statsCard}>
            <View style={styles.statsHeader}>
              <IconSymbol name="chart.bar.fill" size={24} color={colors.primary} />
              <Text style={styles.cardTitle}>Vos Performances</Text>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.totalSessions}</Text>
                <Text style={styles.statLabel}>Sessions</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.gold }]}>
                  {stats.bestScore.toFixed(0)}%
                </Text>
                <Text style={styles.statLabel}>Meilleur Score</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.accent }]}>
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

          <View style={styles.examSection}>
            <Text style={styles.sectionTitle}>Modes de Révision</Text>
            
            <Pressable
              style={({ pressed }) => [
                styles.examCard,
                styles.examCardPrimary,
                pressed && styles.examCardPressed
              ]}
              onPress={() => router.push('/revision/mixed?mode=exam&count=40')}
            >
              <View style={styles.examCardContent}>
                <View style={[styles.examIcon, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                  <IconSymbol name="doc.text.fill" size={32} color="#ffffff" />
                </View>
                <View style={styles.examTextContent}>
                  <Text style={styles.examCardTitle}>Examen Blanc</Text>
                  <Text style={styles.examCardDescription}>
                    40 questions • 2 heures • Conditions réelles
                  </Text>
                  <View style={styles.examStats}>
                    <Text style={styles.examStatsText}>
                      {stats.examStats.sessions} sessions
                    </Text>
                    {stats.examStats.sessions > 0 && (
                      <>
                        <Text style={styles.examStatsText}>•</Text>
                        <Text style={styles.examStatsText}>
                          Meilleur: {stats.examStats.bestScore.toFixed(0)}%
                        </Text>
                      </>
                    )}
                  </View>
                </View>
                <IconSymbol name="chevron.right" size={24} color="#ffffff" />
              </View>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.examCard,
                styles.examCardSecondary,
                pressed && styles.examCardPressed
              ]}
              onPress={() => router.push('/revision/mixed?mode=training&count=20')}
            >
              <View style={styles.examCardContent}>
                <View style={[styles.examIcon, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                  <IconSymbol name="figure.run" size={32} color="#ffffff" />
                </View>
                <View style={styles.examTextContent}>
                  <Text style={styles.examCardTitle}>Session d&apos;Entraînement</Text>
                  <Text style={styles.examCardDescription}>
                    20 questions • Pratique flexible
                  </Text>
                  <View style={styles.examStats}>
                    <Text style={styles.examStatsText}>
                      {stats.trainingStats.sessions} sessions
                    </Text>
                    {stats.trainingStats.sessions > 0 && (
                      <>
                        <Text style={styles.examStatsText}>•</Text>
                        <Text style={styles.examStatsText}>
                          Meilleur: {stats.trainingStats.bestScore.toFixed(0)}%
                        </Text>
                      </>
                    )}
                  </View>
                </View>
                <IconSymbol name="chevron.right" size={24} color="#ffffff" />
              </View>
            </Pressable>
          </View>

          <View style={styles.sectionsContainer}>
            <Text style={styles.sectionTitle}>Révision par Section</Text>
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
                  <IconSymbol name={section.icon as any} size={28} color="#ffffff" />
                </View>
                <View style={styles.sectionContent}>
                  <Text style={styles.sectionName}>{section.name}</Text>
                  <View style={styles.sectionStats}>
                    <Text style={styles.sectionStatsText}>
                      {stats.sectionStats[section.id as keyof typeof stats.sectionStats].sessions} sessions
                    </Text>
                    {stats.sectionStats[section.id as keyof typeof stats.sectionStats].sessions > 0 && (
                      <>
                        <Text style={styles.sectionStatsText}>•</Text>
                        <Text style={styles.sectionStatsText}>
                          Meilleur: {stats.sectionStats[section.id as keyof typeof stats.sectionStats].bestScore.toFixed(0)}%
                        </Text>
                      </>
                    )}
                  </View>
                </View>
                <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
              </Pressable>
            ))}
          </View>

          <View style={styles.ctaContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.ctaButton,
                pressed && styles.ctaButtonPressed
              ]}
              onPress={() => router.push('/(tabs)/admission')}
            >
              <View style={styles.ctaContent}>
                <IconSymbol name="graduationcap.fill" size={24} color={colors.gold} />
                <View style={styles.ctaTextContainer}>
                  <Text style={styles.ctaTitle}>Prédiction d&apos;Admission</Text>
                  <Text style={styles.ctaSubtitle}>Estimez vos chances d&apos;intégrer les grandes écoles</Text>
                </View>
                <IconSymbol name="arrow.right" size={20} color={colors.gold} />
              </View>
            </Pressable>
          </View>
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
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  welcomeText: {
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 4,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(30, 58, 138, 0.1)',
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
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
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  examSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  examCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 5,
  },
  examCardPrimary: {
    backgroundColor: colors.primary,
  },
  examCardSecondary: {
    backgroundColor: colors.accent,
  },
  examCardPressed: {
    opacity: 0.8,
  },
  examCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  examIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  examTextContent: {
    flex: 1,
  },
  examCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  examCardDescription: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  examStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  examStatsText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  sectionsContainer: {
    marginBottom: 24,
  },
  sectionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  sectionCardPressed: {
    opacity: 0.7,
  },
  sectionIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sectionContent: {
    flex: 1,
  },
  sectionName: {
    fontSize: 17,
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
    fontSize: 13,
    color: colors.textSecondary,
  },
  ctaContainer: {
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: colors.darkBlue,
    borderRadius: 16,
    padding: 20,
    boxShadow: '0px 4px 16px rgba(15, 23, 42, 0.2)',
    elevation: 6,
    borderWidth: 2,
    borderColor: colors.gold,
  },
  ctaButtonPressed: {
    opacity: 0.8,
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  ctaTextContainer: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  ctaSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
