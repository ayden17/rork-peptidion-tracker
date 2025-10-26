import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User as UserIcon, Target, Activity, Heart, Settings, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUser } from '@/contexts/UserContext';

export default function ProfileScreen() {
  const { user, favoritePeptides, activeCycles } = useUser();

  const goalLabels: Record<string, string> = {
    muscle_gain: 'Muscle Gain',
    fat_loss: 'Fat Loss',
    recovery: 'Recovery',
    longevity: 'Longevity',
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={20} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <UserIcon size={32} color={Colors.light.card} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name || 'User'}</Text>
            <Text style={styles.profileLevel}>
              {user.experienceLevel.charAt(0).toUpperCase() + user.experienceLevel.slice(1)} Level
            </Text>
          </View>
        </View>

        {user.goals.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Target size={20} color={Colors.light.text} />
              <Text style={styles.sectionTitle}>My Goals</Text>
            </View>
            <View style={styles.goalsContainer}>
              {user.goals.map((goal) => (
                <View key={goal} style={styles.goalBadge}>
                  <Text style={styles.goalBadgeText}>{goalLabels[goal] || goal}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Activity size={24} color={Colors.light.primary} />
            </View>
            <Text style={styles.statValue}>{activeCycles.length}</Text>
            <Text style={styles.statLabel}>Active Cycles</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIcon}>
              <Heart size={24} color={Colors.light.primary} />
            </View>
            <Text style={styles.statValue}>{favoritePeptides.length}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
        </View>

        {(user.age || user.weight || user.height) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Body Stats</Text>
            <View style={styles.card}>
              {user.age && (
                <View style={styles.statRow}>
                  <Text style={styles.statRowLabel}>Age</Text>
                  <Text style={styles.statRowValue}>{user.age} years</Text>
                </View>
              )}
              {user.weight && (
                <View style={styles.statRow}>
                  <Text style={styles.statRowLabel}>Weight</Text>
                  <Text style={styles.statRowValue}>{user.weight} lbs</Text>
                </View>
              )}
              {user.height && (
                <View style={styles.statRow}>
                  <Text style={styles.statRowLabel}>Height</Text>
                  <Text style={styles.statRowValue}>{Math.floor(user.height / 12)}&apos;{user.height % 12}&quot;</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {favoritePeptides.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Favorite Peptides</Text>
            {favoritePeptides.map((peptide) => (
              <View key={peptide.id} style={styles.peptideItem}>
                <View style={styles.peptideItemContent}>
                  <Text style={styles.peptideItemName}>{peptide.name}</Text>
                  <Text style={styles.peptideItemCategory}>{peptide.category}</Text>
                </View>
                <ChevronRight size={20} color={Colors.light.textSecondary} />
              </View>
            ))}
          </View>
        )}

        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerText}>
            Educational use only. Not medical advice. Always consult a healthcare professional.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  profileLevel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalBadge: {
    backgroundColor: Colors.light.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  goalBadgeText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light.card,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.light.card,
    padding: 16,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statRowLabel: {
    fontSize: 15,
    color: Colors.light.textSecondary,
  },
  statRowValue: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.light.text,
  },
  peptideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.light.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  peptideItemContent: {
    flex: 1,
  },
  peptideItemName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  peptideItemCategory: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textTransform: 'capitalize' as const,
  },
  disclaimerContainer: {
    backgroundColor: Colors.light.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginTop: 16,
  },
  disclaimerText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
