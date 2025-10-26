import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Activity, BookOpen, Camera, Calendar, Star, TrendingUp, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { PEPTIDION_LOGO_URL } from '@/constants/branding';
import { useUser } from '@/contexts/UserContext';
import { PEPTIDES } from '@/constants/peptides';
import { Peptide } from '@/constants/types';

const getMaleAvatar = (level: number) => {
  const backgrounds = ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'];
  const bg = backgrounds[Math.min(level - 1, backgrounds.length - 1)];
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=male${level}&backgroundColor=${bg}`;
};

const getFemaleAvatar = (level: number) => {
  const backgrounds = ['ffd5dc', 'ffdfbf', 'f0aede', 'd1f4f9', 'ffc0cb'];
  const bg = backgrounds[Math.min(level - 1, backgrounds.length - 1)];
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=female${level}&backgroundColor=${bg}`;
};

const getOtherAvatar = (level: number) => {
  const backgrounds = ['d1d4f9', 'b6e3f4', 'c0aede', 'ffd5dc', 'ffdfbf'];
  const bg = backgrounds[Math.min(level - 1, backgrounds.length - 1)];
  return `https://api.dicebear.com/7.x/bottts/svg?seed=other${level}&backgroundColor=${bg}`;
};

export default function HomeScreen() {
  const router = useRouter();
  const { user, activeCycles, photos } = useUser();

  const recommendedPeptides = useMemo(() => {
    if (user.goals.length === 0) return [];
    
    const scored = PEPTIDES.map((peptide: Peptide) => {
      let score = 0;
      user.goals.forEach(goal => {
        if (peptide.goals.includes(goal)) {
          score += 10;
        }
      });
      
      if (peptide.experienceLevel.includes(user.experienceLevel)) {
        score += 5;
      }
      
      return { peptide, score };
    });
    
    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.peptide);
  }, [user.goals, user.experienceLevel]);

  const levelProgress = ((user.experiencePoints || 0) % 100) / 100;
  const getAvatarUrl = () => {
    const level = user.level || 1;
    const gender = user.gender || 'male';
    if (gender === 'female') return getFemaleAvatar(level);
    if (gender === 'other') return getOtherAvatar(level);
    return getMaleAvatar(level);
  };
  const avatarUrl = getAvatarUrl();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={{ uri: PEPTIDION_LOGO_URL }} style={styles.logo} />
        </View>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Welcome Back</Text>
            <Text style={styles.userName}>{user.name || 'Explorer'}</Text>
          </View>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{user.level || 1}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${levelProgress * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {user.experiencePoints || 0} / {((Math.floor((user.experiencePoints || 0) / 100) + 1) * 100)} XP
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: Colors.light.blue50 }]}>
              <Activity size={20} color={Colors.light.primary} />
            </View>
            <Text style={styles.statValue}>{activeCycles.length}</Text>
            <Text style={styles.statLabel}>Active Cycles</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#FFF4ED' }]}>
              <Camera size={20} color={Colors.light.accent} />
            </View>
            <Text style={styles.statValue}>{photos.length}</Text>
            <Text style={styles.statLabel}>Progress Photos</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#F0FDF4' }]}>
              <TrendingUp size={20} color={Colors.light.success} />
            </View>
            <Text style={styles.statValue}>{user.level || 1}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
        </View>

        {recommendedPeptides.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Recommended for You</Text>
                <Text style={styles.sectionSubtitle}>Based on your goals</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/learn')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContent}
            >
              {recommendedPeptides.map((peptide, index) => (
                <TouchableOpacity
                  key={peptide.id}
                  style={[
                    styles.peptideCard,
                    index === 0 && styles.peptideCardFirst
                  ]}
                  onPress={() => router.push(`/peptide/${peptide.id}` as any)}
                >
                  <View style={styles.peptideCardHeader}>
                    <View style={styles.peptideBadge}>
                      <Star size={12} color={Colors.light.accent} fill={Colors.light.accent} />
                      <Text style={styles.peptideBadgeText}>Recommended</Text>
                    </View>
                  </View>
                  <Text style={styles.peptideName}>{peptide.name}</Text>
                  <Text style={styles.peptideDescription} numberOfLines={2}>
                    {peptide.shortDescription}
                  </Text>
                  <View style={styles.peptideFooter}>
                    <View style={styles.peptideTag}>
                      <Text style={styles.peptideTagText}>{peptide.category}</Text>
                    </View>
                    <ChevronRight size={20} color={Colors.light.primary} />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: Colors.light.blue50 }]}
              onPress={() => router.push('/learn')}
            >
              <View style={styles.actionIconWrapper}>
                <BookOpen size={24} color={Colors.light.primary} />
              </View>
              <Text style={styles.actionTitle}>Learn</Text>
              <Text style={styles.actionSubtitle}>Explore peptides</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#FFF4ED' }]}
              onPress={() => router.push('/camera' as any)}
            >
              <View style={styles.actionIconWrapper}>
                <Camera size={24} color={Colors.light.accent} />
              </View>
              <Text style={styles.actionTitle}>Progress</Text>
              <Text style={styles.actionSubtitle}>Track photos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: '#F0FDF4' }]}
              onPress={() => router.push('/appointments')}
            >
              <View style={styles.actionIconWrapper}>
                <Calendar size={24} color={Colors.light.success} />
              </View>
              <Text style={styles.actionTitle}>Book</Text>
              <Text style={styles.actionSubtitle}>Get guidance</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: Colors.light.cardSecondary }]}
              onPress={() => router.push('/progress')}
            >
              <View style={styles.actionIconWrapper}>
                <Activity size={24} color={Colors.light.primary} />
              </View>
              <Text style={styles.actionTitle}>Cycles</Text>
              <Text style={styles.actionSubtitle}>Manage active</Text>
            </TouchableOpacity>
          </View>
        </View>

        {activeCycles.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active Cycles</Text>
              <TouchableOpacity onPress={() => router.push('/progress')}>
                <Text style={styles.seeAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            {activeCycles.slice(0, 2).map((cycle) => (
              <View key={cycle.id} style={styles.cycleCard}>
                <View style={styles.cycleCardContent}>
                  <View style={styles.cycleIcon}>
                    <Activity size={20} color={Colors.light.primary} />
                  </View>
                  <View style={styles.cycleInfo}>
                    <Text style={styles.cycleName}>{cycle.peptideName}</Text>
                    <Text style={styles.cycleDosage}>{cycle.dosage} · {cycle.frequency}</Text>
                    <Text style={styles.cycleDate}>
                      Started {new Date(cycle.startDate).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.activeBadge}>
                    <View style={styles.activeDot} />
                    <Text style={styles.activeBadgeText}>Active</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.disclaimerCard}>
          <Text style={styles.disclaimerTitle}>Educational Purpose Only</Text>
          <Text style={styles.disclaimerText}>
            This app provides educational information only. Always consult a licensed healthcare professional before starting any peptide protocol.
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
    backgroundColor: Colors.light.primary,
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain' as const,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: Colors.light.accent,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  progressBarContainer: {
    gap: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light.card,
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.light.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '600' as const,
  },
  horizontalScrollContent: {
    paddingRight: 20,
  },
  peptideCard: {
    width: 260,
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  peptideCardFirst: {
    marginLeft: 0,
  },
  peptideCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  peptideBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4ED',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  peptideBadgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.light.accent,
  },
  peptideName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 6,
  },
  peptideDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  peptideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  peptideTag: {
    backgroundColor: Colors.light.cardSecondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  peptideTagText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.primary,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    padding: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIconWrapper: {
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  cycleCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cycleCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cycleIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.blue50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cycleInfo: {
    flex: 1,
  },
  cycleName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 2,
  },
  cycleDosage: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  cycleDate: {
    fontSize: 12,
    color: Colors.light.textLight,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.success,
  },
  activeBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.light.success,
  },
  disclaimerCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginTop: 8,
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.light.text,
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
});
